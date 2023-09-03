/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
import { writeToStorage } from './storage';
import { logger } from './devLogger';
import history from './history';
import { defaultHeaders } from './requestWrapper';

function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  const responseCopy = response.clone();
  return responseCopy.text().then(function (text) {
    if (text) {
      try {
        const response = JSON.parse(text);
        logger('%c REQUEST RESPONSE', 'color: green', response);
        if (response && response.Code === 7) {
          writeToStorage('userInfo', null);
          writeToStorage('authToken', null);
          writeToStorage('paymentIntentSecret', null);
          window.location.href = window.location.origin;
        }
        return response;
      } catch (e) {
        console.warn(e);
        return response;
      }
    }
  });
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request3
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  let error = new Error('Un problème est survenu');

  if (response.CodeString === 'Unauthorized') {
    // writeToStorage('authToken', null);
    error = new Error('Unauthorized');
    history.push('/auth/login');
  }

  if (response.status === 403) {
    // writeToStorage('authToken', null);
    // history.push('billingPlanChoice');
  }

  return parseJSON(response).then((data) => {
    error.response = data;
    if (response.status === 404) {
      if (!error.response.CodeString) {
        error.response.CodeString = 'Undefined';
      }
      if (!error.response.Error) {
        error.response.Error = 'Media is not available';
      }
    }
    if (response.status === 401) {
      if (!error.response.CodeString) {
        error.response.CodeString = 'Unauthorized';
      }
      if (!error.response.Error) {
        error.response.Error =
          'You do not have permission to access the media. Check if your are logged in and have an active subscription';
      }
    }
    error.response.code = response.status;
    error.response.CodeString = data.CodeString;
    error.message = error.message || data?.Error;
    logger('%c REQUEST ERROR', 'color: red', data);
    throw error;
  });
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  const requestOptions = {
    ...(options || {}),
    headers: {
      ...defaultHeaders(true),
      ...(options?.headers || {}),
    },
  };
  return fetch(url, requestOptions)
    .then(checkStatus)
    .then(parseJSON)
    .catch((e) => {
      throw e;
    });
}

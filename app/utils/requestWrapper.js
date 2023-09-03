import { put } from 'redux-saga/effects';
import { setLoadingAction, handleErrorAction } from '../containers/HomePage/actions';
import { readFromStorage } from './storage';
import { BASE_URL } from '../config/env';

export const defaultHeaders = (isAuth) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': BASE_URL,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Header': '*',
  };
  if (isAuth) {
    headers.Authorization = `Bearer ${readFromStorage('authToken')}`;
  }
  return headers;
};

function* triggerLoadingRequest(action, ...args) {
  try {
    yield put(setLoadingAction(true));
    yield action(...args);
  } catch (err) {
    yield put(handleErrorAction(err, ...args));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export default triggerLoadingRequest;

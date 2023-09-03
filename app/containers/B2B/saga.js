// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import { API_URL } from '../../config/env';
import { setLoadingAction, handleErrorAction } from '../HomePage/actions';
import request from '../../utils/request';
import {
  CANCEL_LIBRARY_SUBSCRIPTION,
  CHANGE_LIBRARY_SUBSCRIPTION,
  CREATE_LIBRARY,
  CREATE_LIBRARY_REFERENT,
  DELETE_LIBRARY_REFERENT,
  GENERATE_LIBRARY_LINK,
  GET_LIBRARIES,
  GET_LIBRARY,
  GET_PROFILE_DATA,
  LOG_IN,
  UPDATE_LIBRARY,
  UPDATE_LIBRARY_REFERENT,
  UPDATE_PROFILE_DATA,
} from './constants';
import {
  getProfileAction,
  logInSuccessAction,
  setLibrariesAction,
  setLibraryAction,
  setProfileAction,
} from './actions';
import { setUserInfoAction } from '../Auth/actions';
import { toast } from 'react-toastify';

export function* logInSaga({ payload }) {
  const { body, actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  const requestURL = `${API_URL}/B2BAccount/Login`;
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    yield put(logInSuccessAction(response));
    yield put(
      setUserInfoAction({
        authToken: response.authToken,
        userInfo: { userRole: response.accountTypeStr },
      }),
    );
    yield put(getProfileAction({ body: { token: response.authToken } }));
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}
export function* companyProfileSaga({ payload, type }) {
  const { body, actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  console.log('Payload', payload);
  let requestURL = `${API_URL}/B2BAccount/GetMyAccountInfo?token=${body.token}`;
  let method = 'GET';
  let data = null;
  const requestOptions = {
    method,
  };
  switch (type) {
    case GET_PROFILE_DATA:
      break;
    case UPDATE_PROFILE_DATA:
      requestURL = `${API_URL}/B2BAccount/UpdateB2BAccount`;
      requestOptions.method = 'PATCH';
      data = { ...body.form, token: body.token };
      requestOptions.body = JSON.stringify(data);
      break;
  }
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, requestOptions);
    switch (type) {
      case GET_PROFILE_DATA:
        yield put(setProfileAction(response));
        break;
      case UPDATE_PROFILE_DATA:
        toast.success('Le compte a été modifié avec succès');
        break;
    }
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}
export function* librarySaga({ type, payload }) {
  const { onFinish = () => null, onSuccess = (data) => null } = payload?.actions || {};
  const { body: data } = payload || {};
  // @ts-ignore
  let requestURL = `${API_URL}/B2BAccount/libraries`;
  let method = 'POST';
  let body = JSON.stringify(data);
  switch (type) {
    case GET_LIBRARIES:
      break;
    case GET_LIBRARY:
      requestURL = `${API_URL}/B2BAccount/libraries/${data.id}`;
      method = 'POST';
      body = JSON.stringify(data);
      break;
    case CREATE_LIBRARY:
      requestURL = `${API_URL}/B2BAccount/CreateLibraryAccount`;
      method = 'POST';
      body = JSON.stringify(data);
      break;
    case UPDATE_LIBRARY:
      requestURL = `${API_URL}/B2BAccount/UpdateLibraryAccount/${data.id}`;
      method = 'PATCH';
      body = JSON.stringify({ ...data, country: data.country?.value || data.country });
      break;
  }
  try {
    const response = yield call(request, requestURL, {
      method,
      body,
    });
    switch (type) {
      case GET_LIBRARIES:
        yield put(setLibrariesAction(response));
        break;
      case GET_LIBRARY:
        yield put(setLibraryAction(response));
        break;
      case CREATE_LIBRARY:
        toast.success('La bibliothèque a été créée avec succès');
        break;
      case UPDATE_LIBRARY:
        toast.success('La bibliothèque a été mise à jour avec succès');
        break;
      // case DELETE_PRICING:
      //   toast.success('La tarification a été supprimée avec succès');
      //   break;
    }
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    onFinish();
  }
}

export function* libraryReferentSaga({ type, payload }) {
  const { onFinish = () => null } = payload?.actions || {};
  const { body: data } = payload || {};
  let requestURL = `${API_URL}/B2BManagement/AddLibraryReferent/${data.accountId}`;
  let method = 'PATCH';
  let body = JSON.stringify(data);
  switch (type) {
    case CREATE_LIBRARY_REFERENT:
      requestURL = `${API_URL}/B2BManagement/AddLibraryReferent/${data.accountId}`;
      method = 'PATCH';
      body = JSON.stringify({ ...data, photoBase64: '' });
      break;
    case UPDATE_LIBRARY_REFERENT:
      requestURL = `${API_URL}/B2BManagement/UpdateLibraryReferent/${data.personId}`;
      method = 'PATCH';
      body = JSON.stringify(data);
      break;
    case DELETE_LIBRARY_REFERENT:
      requestURL = `${API_URL}/B2BManagement/DeleteLibraryReferent/${data.personId}`;
      method = 'DELETE';
      body = null;
      break;
  }
  try {
    yield call(request, requestURL, {
      method,
      body,
    });
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    onFinish();
  }
}

export function* librarySubscriptionSaga({ payload, type }) {
  const { onSuccess = () => null, onFinish = () => null } = payload?.actions || {};
  const { body } = payload || {};
  let requestURL = `${API_URL}/B2BAccount/AssignSubscriptionForLibrary/${body.id}`;
  switch (type) {
    case CHANGE_LIBRARY_SUBSCRIPTION:
      break;
    case CANCEL_LIBRARY_SUBSCRIPTION:
      requestURL = `${API_URL}/B2BAccount/CancelLibrarySubscription/${body.subscription.id}`;
      break;
  }
  try {
    const MILLISECONDS_DELAY = 60 * 60 * 2 * 1000 + 10000;
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        subscriptionStartDate: new Date(Date.now() + MILLISECONDS_DELAY).toISOString(),
        pricingPlanId: body.subscription.serviceId,
        negotiatedPrice: body.subscription.price,
        token: body.token,
      }),
    });
    switch (type) {
      case CHANGE_LIBRARY_SUBSCRIPTION:
        toast.success(
          "L'abonnement a été modifié avec succès et sera actif dans un délai de 2 heures.",
        );
        break;
      case CANCEL_LIBRARY_SUBSCRIPTION:
        toast.success('Le compte a été supprimé avec succès');
        break;
    }
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    onFinish();
  }
}

export function* libraryLinkSaga({ payload }) {
  const { onFinish = () => null } = payload?.actions || {};
  const { body } = payload || {};
  const requestURL = `${API_URL}/B2BAccount/GenerateInstitutionLink/${body.libraryId}`;
  try {
    yield call(request, requestURL, {
      method: 'PATCH',
      body: JSON.stringify({
        proposedName: body.proposedName,
        token: body.token,
      }),
    });
    toast.success('Le lien a été généré avec succès');
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    onFinish();
  }
}

export default function* b2BSaga() {
  yield takeLatest(LOG_IN, logInSaga);
  yield takeLatest(GET_PROFILE_DATA, companyProfileSaga);
  yield takeLatest(UPDATE_PROFILE_DATA, companyProfileSaga);
  yield takeLatest(GET_LIBRARIES, librarySaga);
  yield takeLatest(GET_LIBRARY, librarySaga);
  yield takeLatest(CREATE_LIBRARY, librarySaga);
  yield takeLatest(UPDATE_LIBRARY, librarySaga);
  yield takeLatest(CHANGE_LIBRARY_SUBSCRIPTION, librarySubscriptionSaga);
  yield takeLatest(CANCEL_LIBRARY_SUBSCRIPTION, librarySubscriptionSaga);
  yield takeLatest(GENERATE_LIBRARY_LINK, libraryLinkSaga);
  yield takeLatest(CREATE_LIBRARY_REFERENT, libraryReferentSaga);
  yield takeLatest(UPDATE_LIBRARY_REFERENT, libraryReferentSaga);
  yield takeLatest(DELETE_LIBRARY_REFERENT, libraryReferentSaga);
}

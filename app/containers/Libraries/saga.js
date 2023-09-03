// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import { API_URL, APPLICATION_URL } from '../../config/env';
import { call, put, takeLatest } from 'redux-saga/effects';
import { setLoadingAction, handleErrorAction, showErrorAction } from '../HomePage/actions';
import request from '../../utils/request';
import { defaultHeaders } from '../../utils/requestWrapper';
import {
  getProfileAction,
  logInSuccessAction,
  setInstitutionAction,
  setLibraryConnectionStatisticsAction,
  setLibraryStatisticsAction,
  setLibraryStatisticsChartAction,
  setLibraryStatisticsRangeAction,
  setProfessionsAction,
  setProfileAction,
} from './actions';
import { logIntoAccountSuccess, setUserInfoAction } from '../Auth/actions';
import {
  GENERATE_XLSX,
  GET_CONNECTION_STATISTICS,
  GET_INSTITUTION_DATA,
  GET_PROFESSIONS,
  GET_PROFILE_DATA,
  GET_STATISTICS,
  GET_STATISTICS_CHART,
  LOG_IN,
  REGISTER_FOR_INSTITUTION,
  UPDATE_PROFILE_DATA,
} from './constants';
import { toast } from 'react-toastify';
import history from '../../utils/history';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import { setLinkOptionsAction } from '../Affiliation/actions';
import downloadResponseBlob from '../../utils/downloadResponseBlob';

export function* logInSaga({ payload }) {
  const { body, actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  const requestURL = `${API_URL}/LibraryAccount/Login`;
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
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    stats.fakeAccountsEmails.includes(body.login) && writeToStorage('isMockedAccount', true);
    yield put(getProfileAction({ body: { token: response.authToken } }));
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}
export function* libraryProfileSaga({ payload, type }) {
  const { body, actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  let requestURL = `${API_URL}/LibraryAccount/GetAccountInfo`;
  let data = body;
  let method = 'POST';
  switch (type) {
    case GET_PROFILE_DATA:
      if (body.id) {
        requestURL = `${API_URL}/B2BAccount/libraries/${body.id}`;
        data = body;
        method = 'POST';
      }
      break;
    case UPDATE_PROFILE_DATA:
      requestURL = `${API_URL}/LibraryAccount/UpdateLibraryAccountInfo`;
      data = body.form;
      method = 'PATCH';
      if (body.id) {
        requestURL = `${API_URL}/B2BAccount/UpdateLibraryAccountInfo/${body.id}`;
        data = body.form;
        method = 'PATCH';
      }
      break;
  }

  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method,

      body: JSON.stringify(data),
    });
    yield put(setProfileAction(response));
    switch (type) {
      case GET_PROFILE_DATA:
        break;
      case UPDATE_PROFILE_DATA:
        toast.success('La bibliothèque a été mise à jour avec succès');
    }
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}
export function* professionsSaga({ payload }) {
  const { actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  const requestURL = `${API_URL}/Institution/GetProfessions`;
  const method = 'GET';
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method,
    });
    yield put(setProfessionsAction(response));
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}
export function* institutionSaga({ payload }) {
  const { body, actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  const requestURL = `${API_URL}/Institution/GetInstitutionInfo/${body.id}`;
  const method = 'GET';
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method,
    });
    yield put(setInstitutionAction(response));
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}
export function* statisticsSaga({ payload }) {
  const { body, actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  const hasId = !!body.id;
  let requestURL = hasId
    ? `${API_URL}/B2BAccount/GetStatsForLibraryFromBeggining/${body.id}`
    : `${API_URL}/LibraryAccount/GetStatsFromBeggining`;
  let data = body;
  let method = 'POST';
  if (body.start && body.end) {
    requestURL = hasId
      ? `${API_URL}/B2BAccount/GetStatsForLibraryForTimePeriod/${body.id}`
      : `${API_URL}/LibraryAccount/GetStatsWithinTimeRange`;
  }
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method,

      body: JSON.stringify(data),
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount =
      readFromStorage('isMockedAccount') || stats.fakeAccountsIds.includes(body.id);
    if (body.start && body.end) {
      yield put(setLibraryStatisticsRangeAction(isMockedAccount ? stats.statistics : response));
    } else {
      yield put(setLibraryStatisticsAction(isMockedAccount ? stats.statistics : response));
    }
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}
export function* registerForInstitutionSaga({ payload }) {
  const { body, actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  let requestURL = `${API_URL}/Institution/RegisterStudentAccountForInstitution`;
  let data = body;
  let method = 'POST';
  try {
    yield put(setLoadingAction(true));
    yield call(request, requestURL, {
      method,

      body: JSON.stringify({
        ...data,
        professionId: data.profession.value,
        gender: data.gender.value,
        region: data.region.value,
      }),
    });
    toast.success('Le compte a été créé avec succès');
    history.replace('/auth/confirmEmail');
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}
export function* statisticsChartSaga({ payload }) {
  const { body, actions } = payload || {};
  const { onSuccess = () => null } = actions || {};
  const isB2BAccount = !!readFromStorage('B2BAuthToken');
  let requestURL = isB2BAccount
    ? `${API_URL}/B2BAccount/libraries/${body.id}/chart`
    : `${API_URL}/LibraryAccount/libraries/${body.id}/chart`;
  let data = body;
  let method = 'POST';
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method,

      body: JSON.stringify(data),
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount =
      readFromStorage('isMockedAccount') || stats.fakeAccountsIds.includes(body.id);
    yield put(setLibraryStatisticsChartAction(isMockedAccount ? stats.statisticsChart : response));
    onSuccess(isMockedAccount ? stats.statisticsChart : response);
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* connectionStatisticsSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { token, key, from, to } = body;
  const isB2BAccount = !!readFromStorage('B2BAuthToken');

  let method = 'POST';
  let requestUrl = isB2BAccount
    ? `${API_URL}/B2BAccount/libraries/${body.id}/stats`
    : `${API_URL}/LibraryAccount/libraries/${body.id}/stats`;
  try {
    const response = yield call(request, requestUrl, {
      method,
      body: JSON.stringify({ token, key, from, to }),
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount =
      readFromStorage('isMockedAccount') || stats.fakeAccountsIds.includes(body.id);
    yield put(setLibraryConnectionStatisticsAction(response));
    onSuccess(isMockedAccount ? stats.connectionStatistics[key] : response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* generateXLSXSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { token, key, from, to } = body;
  const isB2BAccount = !!readFromStorage('B2BAuthToken');

  let method = 'POST';
  let requestUrl = isB2BAccount
    ? `${API_URL}/B2BAccount/libraries/${body.id}/stats/excel`
    : `${API_URL}/LibraryAccount/libraries/${body.id}/stats/excel`;
  try {
    const response = yield call(request, requestUrl, {
      method,
      body: JSON.stringify({ token, key, from, to }),
    });
    yield downloadResponseBlob(response);
    onSuccess(response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export default function* librariesSaga() {
  yield takeLatest(LOG_IN, logInSaga);
  yield takeLatest(GET_PROFILE_DATA, libraryProfileSaga);
  yield takeLatest(UPDATE_PROFILE_DATA, libraryProfileSaga);
  yield takeLatest(REGISTER_FOR_INSTITUTION, professionsSaga);
  yield takeLatest(GET_PROFESSIONS, professionsSaga);
  yield takeLatest(GET_INSTITUTION_DATA, institutionSaga);
  yield takeLatest(GET_STATISTICS, statisticsSaga);
  yield takeLatest(GET_CONNECTION_STATISTICS, connectionStatisticsSaga);
  yield takeLatest(GET_STATISTICS_CHART, statisticsChartSaga);
  yield takeLatest(REGISTER_FOR_INSTITUTION, registerForInstitutionSaga);
  yield takeLatest(GENERATE_XLSX, generateXLSXSaga);
}

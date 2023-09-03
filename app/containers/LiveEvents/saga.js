import { call, put, takeLatest } from 'redux-saga/effects';
import { API_URL } from '../../config/env';
import request from '../../utils/request';
import { setLoadingAction, handleErrorAction } from '../HomePage/actions';
import triggerLoadingRequest, { defaultHeaders } from '../../utils/requestWrapper';
import {
  CREATE_LIVE_EVENT,
  GET_CREATED_EVENTS,
  GET_CREATED_LIVE_EVENT,
  PUBLISH_LIVE_EVENT,
  UPDATE_LIVE_EVENT,
} from './constants';
import history from '../../utils/history';
import {
  getCreatedLiveEventsAction,
  setCreatedLiveEventAction,
  setCreatedLiveEventsAction,
  setCurrentTabAction,
} from './actions';

export function* getCreatedLiveEventsSaga() {
  const requestUrl = `${API_URL}/Event/GetMyEvents`;
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setCreatedLiveEventsAction(response));
  } catch (err) {
    // yield put(showErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* createLiveEventSaga({ payload }) {
  const requestUrl = `${API_URL}/Event/CreateEventDraft`;
  yield put(setLoadingAction(true));
  const response = yield call(request, requestUrl, {
    method: 'POST',
  });
  yield put(getCreatedLiveEventsAction());
  history.push(`/live/createLiveEvent/${response?.eventId}`, {
    background: payload,
  });
}

export function* getCreatedLiveEventSaga({ payload }) {
  const requestUrl = `${API_URL}/Event/GetMyEvent/${payload.id}`;
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setCreatedLiveEventAction(response));
    payload.onSuccess && payload.onSuccess(response);
  } catch (err) {
    //
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* updateCreatedLiveEventSaga({ payload }) {
  const requestUrl = `${API_URL}/Event/UpdateEventFields/${payload.id}`;
  console.log('pyaload', payload);
  if (payload?.data && Object.keys(payload?.data).length) {
    yield put(setLoadingAction(true));
    const data = Object.keys(payload.data).map((key) => ({
      propertyName: key,
      propertyValue: payload?.data?.[key],
    }));
    const response = yield call(request, requestUrl, {
      method: 'PATCH',
      body: JSON.stringify([...data, { propertyName: 'currency', propertyValue: 'eur' }]),
    });
    yield put(getCreatedLiveEventsAction());
  }
  payload?.onSuccess && payload?.onSuccess();
}
export function* publishLiveEventSaga({ payload }) {
  const requestUrl = `${API_URL}/Event/CreateEvent/${payload.id}`;
  const response = yield call(request, requestUrl, {
    method: 'PATCH',
  });
  yield put(getCreatedLiveEventsAction());
  payload?.onSuccess && payload?.onSuccess(response);
}

// Individual exports for testing
export default function* liveEventsSaga() {
  yield takeLatest(GET_CREATED_EVENTS, getCreatedLiveEventsSaga);
  yield takeLatest(GET_CREATED_LIVE_EVENT, getCreatedLiveEventSaga);
  yield takeLatest(CREATE_LIVE_EVENT, (data) => triggerLoadingRequest(createLiveEventSaga, data));
  yield takeLatest(UPDATE_LIVE_EVENT, (data) =>
    triggerLoadingRequest(updateCreatedLiveEventSaga, data),
  );
  yield takeLatest(PUBLISH_LIVE_EVENT, (data) => triggerLoadingRequest(publishLiveEventSaga, data));
}

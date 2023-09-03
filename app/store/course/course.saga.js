// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import { readFromStorage } from '../../utils/storage';
import { API_URL } from '../../config/env';
import request from '../../utils/request';
import { getEpisode, setEpisode, setEpisodeError } from './course.slice';
import { setLoadingAction } from '../../containers/HomePage/actions';

export function* openEpisodeSaga({ payload }) {
  const { episodeId, onSuccess, onFetchEnd, onError } = payload;
  try {
    yield put(setEpisodeError(null));
    yield put(setLoadingAction(true));
    const authToken = readFromStorage('authToken');
    const requestUrl = `${API_URL}/Player/OpenEpisode?episodeId=${episodeId}`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setEpisode(response));
    onSuccess && onSuccess(response);
  } catch (err) {
    const data = {
      codeString: err?.response?.CodeString || 'Undefined',
      error: err?.response?.Error || 'Sorry... media is not available at the moment',
    };
    yield put(setEpisodeError(data));
    onError && onError(data);
  } finally {
    yield put(setLoadingAction(false));
    onFetchEnd && onFetchEnd();
  }
}

export default function* courseSaga() {
  yield takeLatest(getEpisode, openEpisodeSaga);
}

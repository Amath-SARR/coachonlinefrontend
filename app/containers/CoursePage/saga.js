// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import { readFromStorage } from '../../utils/storage';
import { API_URL, BASE_URL } from '../../config/env';
import request from '../../utils/request';
import { setEpisodeErrorAction, setEpisodeAction } from './actions';
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  EDIT_COMMENT,
  GET_COMMENTS,
  GET_EPISODE,
  REPLY_TO_COMMENT,
  TOGGLE_LIKE,
} from './constants';
import { setLoadingAction, setNumberOfLikesAction } from '../HomePage/actions';
import history from '../../utils/history';

export function* openEpisodeSaga({ payload }) {
  const { episodeId, onSuccess, onFetchEnd, onError } = payload;
  try {
    yield put(setEpisodeErrorAction(null));
    yield put(setLoadingAction(true));
    const authToken = readFromStorage('authToken');
    const requestUrl = `${API_URL}/Player/OpenEpisode?episodeId=${episodeId}`;
    // if (!authToken) {
    //   return history.push('/auth/login');
    // }
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setEpisodeAction(response));
    onSuccess && onSuccess(response);
  } catch (err) {
    const data = {
      codeString: err?.response?.CodeString || 'Undefined',
      error: err?.response?.Error || 'Sorry... media is not available at the moment',
    };
    yield put(setEpisodeErrorAction(data));
    onError && onError(data);
  } finally {
    yield put(setLoadingAction(false));
    onFetchEnd && onFetchEnd();
  }
}

export function* toggleLikeSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { courseId, liked } = body;
  try {
    const requestUrl = `${API_URL}/Player/course/${courseId}/${liked ? 'like' : 'unlike'}`;
    const response = yield call(request, requestUrl, {
      method: 'PATCH',
    });
    onSuccess(response);
    yield put(setNumberOfLikesAction(response));
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export function* createCommentSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { courseId, commentTxt } = body;
  try {
    const requestUrl = `${API_URL}/Player/course/${courseId}/comments`;
    const response = yield call(request, requestUrl, {
      method: 'POST',
      body: JSON.stringify({
        commentTxt,
      }),
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* getCommentsSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { courseId } = body;
  try {
    const requestUrl = `${API_URL}/Player/course/${courseId}/comments`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* replyToCommentSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { courseId, commentTxt, commentId } = body;
  try {
    const requestUrl = `${API_URL}/Player/course/${courseId}/comments/${commentId}/reply`;
    const response = yield call(request, requestUrl, {
      method: 'PATCH',
      body: JSON.stringify({
        commentTxt,
      }),
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* editCommentSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { courseId, commentTxt, commentId } = body;
  try {
    const requestUrl = `${API_URL}/Player/course/${courseId}/comments/${commentId}`;
    const response = yield call(request, requestUrl, {
      method: 'PATCH',
      body: JSON.stringify({
        commentTxt,
      }),
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* deleteCommentSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { courseId, commentTxt, commentId } = body;
  try {
    const requestUrl = `${API_URL}/Player/course/${courseId}/comments/${commentId}`;
    const response = yield call(request, requestUrl, {
      method: 'DELETE',
      body: JSON.stringify({
        commentTxt,
      }),
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export default function* homePageSaga() {
  yield takeLatest(GET_EPISODE, openEpisodeSaga);
  yield takeLatest(TOGGLE_LIKE, toggleLikeSaga);
  yield takeLatest(CREATE_COMMENT, createCommentSaga);
  yield takeLatest(GET_COMMENTS, getCommentsSaga);
  yield takeLatest(EDIT_COMMENT, editCommentSaga);
  yield takeLatest(REPLY_TO_COMMENT, replyToCommentSaga);
  yield takeLatest(DELETE_COMMENT, deleteCommentSaga);
}

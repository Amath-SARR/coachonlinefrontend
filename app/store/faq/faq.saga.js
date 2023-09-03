// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import { API_URL } from '../../config/env';
import request from '../../utils/request';
import {
  createCategory,
  createTopic,
  deleteCategory,
  deleteTopic,
  getCategories,
  getTopic,
  getTopicByCategory,
  searchInTopics,
  setCategories,
  setLoading,
  updateTopic,
} from './faq.slice';
import { showErrorAction } from '../../containers/Dashboard/actions';

export function* createCategorySaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { name: categoryName } = body;
  const requestUrl = `${API_URL}/FAQ/Categories`;
  const method = 'POST';
  const data = JSON.stringify({
    categoryName,
  });
  try {
    const response = yield call(request, requestUrl, {
      method,
      body: data,
    });
    yield put(getCategories());
    onSuccess(response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* getCategoriesSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const requestUrl = `${API_URL}/FAQ/Categories?includeTopics=true`;
  const method = 'GET';
  try {
    yield put(setLoading(true));
    const response = yield call(request, requestUrl, {
      method,
    });
    yield put(setCategories(response));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
    yield put(setLoading(false));
  }
}
export function* deleteCategorySaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { id } = body;
  const requestUrl = `${API_URL}/FAQ/Categories/${id}`;
  const method = 'DELETE';
  try {
    const response = yield call(request, requestUrl, {
      method,
    });
    yield put(getCategories());
    onSuccess(response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export function* createTopicSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { categoryId, topicName, topicBody, tags } = body;
  const requestUrl = `${API_URL}/FAQ/Topics`;
  const method = 'POST';
  const data = JSON.stringify({
    categoryId,
    topicName,
    topicBody,
    tags,
  });
  try {
    const response = yield call(request, requestUrl, {
      method,
      body: data,
    });
    yield put(getCategories());
    onSuccess(response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* getTopicSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { id } = body;
  const requestUrl = `${API_URL}/FAQ/Topics/${id}`;
  const method = 'GET';
  try {
    yield put(setLoading(true));
    const response = yield call(request, requestUrl, {
      method,
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
    yield put(setLoading(false));
  }
}
export function* updateTopicSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { categoryId, name: topicName, body: topicBody, tags, id } = body;
  const requestUrl = `${API_URL}/FAQ/Topics/${id}`;
  const method = 'PATCH';
  const data = JSON.stringify({
    categoryId,
    topicName,
    topicBody,
    tags,
  });
  try {
    const response = yield call(request, requestUrl, {
      method,
      body: data,
    });
    onSuccess(response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* deleteTopicSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { id } = body;
  const requestUrl = `${API_URL}/FAQ/Topics/${id}`;
  const method = 'DELETE';
  try {
    const response = yield call(request, requestUrl, {
      method,
    });
    yield put(getCategories());
    onSuccess(response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export function* searchTopicsSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { value } = body;
  const requestUrl = `${API_URL}/FAQ/Topics/search/${value}`;
  const method = 'GET';
  try {
    yield put(setLoading(true));
    const response = yield call(request, requestUrl, {
      method,
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
    yield put(setLoading(false));
  }
}

export function* getTopicByCategorySaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { id } = body;
  const requestUrl = `${API_URL}/FAQ/Topics/byCat/${id}`;
  const method = 'GET';
  try {
    yield put(setLoading(true));
    const response = yield call(request, requestUrl, {
      method,
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
    yield put(setLoading(false));
  }
}

export default function* faqSaga() {
  yield takeLatest(getCategories, getCategoriesSaga);
  yield takeLatest(createCategory, createCategorySaga);
  yield takeLatest(deleteCategory, deleteCategorySaga);
  yield takeLatest(getTopic, getTopicSaga);
  yield takeLatest(getTopicByCategory, getTopicByCategorySaga);
  yield takeLatest(createTopic, createTopicSaga);
  yield takeLatest(updateTopic, updateTopicSaga);
  yield takeLatest(deleteTopic, deleteTopicSaga);
  yield takeLatest(searchInTopics, searchTopicsSaga);
}

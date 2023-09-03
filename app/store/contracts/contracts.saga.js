// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  createContract,
  deleteContract,
  getLatestContractOfType,
  setLatestContractOfType,
  setLoading,
  updateContract,
} from './contracts.slice';
import { API_URL } from '../../config/env';
import request from '../../utils/request';

export function* createContractSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { name, body: text, type: contractType, isCurrent = true } = body;
  const requestUrl = `${API_URL}/Contracts/contracts`;
  const method = 'POST';
  const data = JSON.stringify({
    name,
    body: text,
    type: contractType,
    isCurrent,
  });
  try {
    const response = yield call(request, requestUrl, {
      method,
      body: data,
    });
    yield put(getLatestContractOfType({ body: { type: contractType }, actions: { onSuccess } }));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* getContractSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { type: contractType } = body;
  const requestUrl = `${API_URL}/Contracts/contracts/byType/${contractType}/latest`;
  const method = 'GET';
  try {
    yield put(setLoading(true));
    const response = yield call(request, requestUrl, {
      method,
    });
    if (!response) {
      yield put(
        createContract({
          body: { name: 'Document', body: 'Insert document body here', type: contractType },
          actions: { onSuccess },
        }),
      );
      return;
    }
    yield put(setLatestContractOfType(response));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
    yield put(setLoading(false));
  }
}
export function* updateContractSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { id, name, body: text, isCurrent = true } = body;
  const requestUrl = `${API_URL}/Contracts/contracts/${id}`;
  const method = 'PATCH';
  const data = JSON.stringify({
    name,
    body: text,
    isCurrent,
  });
  try {
    const response = yield call(request, requestUrl, {
      method,
      body: data,
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* deleteContractSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { id } = body;
  const requestUrl = `${API_URL}/Contracts/contracts/${id}`;
  const method = 'DELETE';
  try {
    const response = yield call(request, requestUrl, {
      method,
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export default function* contractsSaga() {
  yield takeLatest(getLatestContractOfType, getContractSaga);
  yield takeLatest(createContract, createContractSaga);
  yield takeLatest(updateContract, updateContractSaga);
  yield takeLatest(deleteContract, deleteContractSaga);
}

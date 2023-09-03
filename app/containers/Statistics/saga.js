// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import { API_URL } from '../../config/env';
import request from '../../utils/request';
import {
  setCoachRankingsAction,
  setMonthBalanceAction,
  setMonthMinutesAction,
  setMonthStatisticsAction,
} from './actions';
import {
  GET_COACH_RANKINGS,
  GET_MONTH_BALANCE,
  GET_MONTH_MINUTES,
  GET_MONTH_STATISTICS,
} from './constants';
import { readFromStorage } from '../../utils/storage';
import { fullName } from '../../utils/formatters';

export function* getMonthStatisticsSaga(data) {
  try {
    const { month, year = 2021 } = data?.payload;
    const requestUrl = `${API_URL}/CoachAccount/GetChartData`;
    const response = yield call(request, requestUrl, {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount = readFromStorage('isMockedAccount');
    yield put(setMonthStatisticsAction(isMockedAccount ? stats.monthStatistics : response));
  } catch (err) {
    console.warn('Failed to fetch month statistics', err);
  }
}

export function* getMonthBalanceSaga(data) {
  try {
    const { month, year } = data?.payload;
    const requestUrl = `${API_URL}/CoachAccount/GetBalanceSummarized`;
    const response = yield call(request, requestUrl, {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount = readFromStorage('isMockedAccount');
    yield put(setMonthBalanceAction(isMockedAccount ? stats.monthBalance : response));
  } catch (err) {
    console.warn('Failed to fetch month balance', err);
  }
}
export function* getMonthMinutesSaga(data) {
  try {
    const { month, year = 2021 } = data?.payload;
    const requestUrl = `${API_URL}/CoachAccount/GetMinutesSummarized`;
    const response = yield call(request, requestUrl, {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount = readFromStorage('isMockedAccount');
    yield put(setMonthMinutesAction(isMockedAccount ? stats.monthMinutes : response));
  } catch (err) {
    console.warn('Failed to fetch month minutes', err);
  }
}
export function* getCoachRankingSaga(data) {
  try {
    const { month, year = 2021 } = data?.payload;
    const requestUrl = `${API_URL}/CoachAccount/GetCurrentRanking`;
    const response = yield call(request, requestUrl, {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount = readFromStorage('isMockedAccount');
    const myData = readFromStorage('userDataFetched');
    stats.ranking[2].name = fullName(myData);
    yield put(setCoachRankingsAction(isMockedAccount ? stats.ranking : response));
  } catch (err) {
    console.warn('Failed to fetch ranking', err);
  }
}

export default function* statisticsSaga() {
  yield takeLatest(GET_MONTH_STATISTICS, getMonthStatisticsSaga);
  yield takeLatest(GET_MONTH_BALANCE, getMonthBalanceSaga);
  yield takeLatest(GET_MONTH_MINUTES, getMonthMinutesSaga);
  yield takeLatest(GET_COACH_RANKINGS, getCoachRankingSaga);
}

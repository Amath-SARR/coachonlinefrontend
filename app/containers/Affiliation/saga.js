// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  CHANGE_COACH_LINK,
  CHANGE_LINK,
  CHANGE_LINK_OPTIONS,
  GENERATE_COACH_LINK,
  GENERATE_LINK,
  GET_AFFILIATES,
  GET_AFFILIATES_FILE,
  GET_COACH_LINK,
  GET_COUPONS,
  GET_EARNINGS,
  GET_EARNINGS_PERIOD,
  GET_LINK,
  GET_LINK_OPTIONS,
  GET_PAYOUTS,
  GET_PERIODIC_EARNINGS,
  GET_RANKINGS,
  WITHDRAW_AFFILIATION_EARNINGS,
} from './constants';
import { API_URL, APPLICATION_URL } from '../../config/env';
import request from '../../utils/request';
import { defaultHeaders } from '../../utils/requestWrapper';
import { handleErrorAction, setLoadingAction, showErrorAction } from '../HomePage/actions';
import {
  getEarningsForPeriodAction,
  setAffiliatesAction,
  setCoachLinkAction,
  setCouponsAction,
  setEarningsAction,
  setEarningsForPeriodAction,
  setLinkAction,
  setLinkOptionsAction,
  setPeriodicEarningsAction,
  setRankingsAction,
} from './actions';
import { getFirstDayOfMonth, getFirstDayOfWeek } from '../../utils/localize';
import { readFromStorage } from '../../utils/storage';
import downloadResponseBlob from '../../utils/downloadResponseBlob';

export function* generateLinkSaga({ payload }) {
  const requestURL = `${API_URL}/Affiliate/GenerateAffiliateLink`;
  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
    });
    // yield put(setEarningsAction(response));
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    payload?.onFinish && payload.onFinish();
  }
}

export function* getLinkSaga({ payload }) {
  const requestURL = `${API_URL}/Affiliate/GetMyAffiliateLink`;
  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setLinkAction(response));
  } catch (err) {
    // yield put(showErrorAction(err));
  } finally {
    payload?.onFinish && payload.onFinish();
  }
}

export function* getLinkOptionsSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { userId, link } = body;
  let method = 'GET';
  let requestUrl = `${API_URL}/Affiliate/user/${userId}/link/${link}/options`;
  try {
    const response = yield call(request, requestUrl, {
      method,
    });
    yield put(setLinkOptionsAction(response));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* coachLinkSaga({ payload, type }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { userId, link } = body;
  let method = 'GET';
  let requestUrl = `${API_URL}/Affiliate/users/${userId}/coachlink`;
  switch (type) {
    case GET_COACH_LINK:
      break;
    case GENERATE_COACH_LINK:
      method = 'POST';
      break;
    case CHANGE_COACH_LINK:
      method = 'PATCH';
      requestUrl = `${API_URL}/Affiliate/coachlink/${link}`;
      break;
  }
  try {
    const response = yield call(request, requestUrl, {
      method,
    });
    yield put(setCoachLinkAction(response));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export function* changeLinkSaga({ payload }) {
  const { link } = payload.body || {};
  const { onFinish = () => null } = payload.actions || {};
  const requestURL = `${API_URL}/Affiliate/Link/${link}`;
  try {
    const response = yield call(request, requestURL, {
      method: 'PATCH',
    });
    toast.success('Le lien a été modifié avec succès');
    // yield put(setEarningsAction(response));
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    onFinish();
  }
}

export function* changeLinkOptionsSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { userId, link, limitedPageView, couponId, withTrialPlans } = body;
  const returnUrl = limitedPageView ? `${APPLICATION_URL}auth/register/student` : null;
  let method = 'PUT';
  let requestUrl = `${API_URL}/Affiliate/users/${userId}/link/${link}`;
  try {
    const response = yield call(request, requestUrl, {
      method,
      body: JSON.stringify({
        limitedPageView,
        couponId,
        withTrialPlans,
        returnUrl,
      }),
    });
    yield put(setLinkOptionsAction(response));
    onSuccess(response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export function* getEarningsSaga() {
  const requestURL = `${API_URL}/Affiliate/GetEarnedMoneyGeneral`;
  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount = readFromStorage('isMockedAccount');
    yield put(setEarningsAction(isMockedAccount ? stats.totalEarnings : response));
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* getEarningsForPeriodSaga({ payload }) {
  const { startDate, endDate } = payload;
  const requestURL = `${API_URL}/Affiliate/GetEarnedMoneyForPeriod`;
  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        startDate,
        endDate,
      }),
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount = readFromStorage('isMockedAccount');
    return isMockedAccount ? stats.totalEarnings : response;
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* getEarningsForSelectedPeriod(data) {
  try {
    const earnings = yield getEarningsForPeriodSaga(data);
    yield put(setEarningsForPeriodAction(earnings));
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* getPeriodicEarningsSaga() {
  try {
    const currentWeekEarnings = yield getEarningsForPeriodSaga({
      payload: {
        startDate: getFirstDayOfWeek().toISOString(),
        endDate: new Date().toISOString(),
      },
    });
    const currentMonthEarnings = yield getEarningsForPeriodSaga({
      payload: {
        startDate: getFirstDayOfMonth().toISOString(),
        endDate: new Date().toISOString(),
      },
    });
    yield put(
      setPeriodicEarningsAction({
        currentWeekEarnings,
        currentMonthEarnings,
      }),
    );
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* getAffiliatesSaga({ payload }) {
  const requestURL = `${API_URL}/Affiliate/GetMyAffiliates`;
  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    const stats = JSON.parse(JSON.stringify(require('./mock-data.json')));
    const isMockedAccount = readFromStorage('isMockedAccount');
    yield put(setAffiliatesAction(isMockedAccount ? stats.affiliates : response));
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    payload?.onFinish && payload.onFinish();
  }
}

export function* getRankingsSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { type, topOnly } = body;
  try {
    const requestUrl = `${API_URL}/Affiliate/ranking/${type}${topOnly ? '/top' : ''}`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setRankingsAction({ type, list: response }));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* getCouponsSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { userId } = body;
  try {
    const requestUrl = `${API_URL}/Affiliate/users/${userId}/coupons`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setCouponsAction(response));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* getPayoutsSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { userId } = body;
  try {
    const requestUrl = `${API_URL}/Affiliate/withdrawals/user/${userId}`;
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
export function* getAffiliatesFileSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { userId } = body;
  try {
    yield put(setLoadingAction(true));
    const requestUrl = `${API_URL}/Affiliate/users/${userId}/affiliates/extract`;
    const response = yield call(request, requestUrl, {
      method: 'POST',
    });
    yield downloadResponseBlob(response);
    onSuccess(response);
  } catch (err) {
    yield put(showErrorAction(err));
    onError(err);
  } finally {
    onFetchEnd();
    yield put(setLoadingAction(false));
  }
}

export function* withdrawAffiliationEarningsSaga({ payload }) {
  const requestURL = `${API_URL}/Affiliate/WithdrawMoney`;
  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
    });
    toast.success('Vous avez retiré vos gains avec succès');
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    payload?.onFinish && payload.onFinish();
  }
}

export default function* affiliationSaga() {
  yield takeLatest(GENERATE_LINK, generateLinkSaga);
  yield takeLatest(GET_LINK, getLinkSaga);
  yield takeLatest(GET_LINK_OPTIONS, getLinkOptionsSaga);
  yield takeLatest(GENERATE_COACH_LINK, coachLinkSaga);
  yield takeLatest(GET_COACH_LINK, coachLinkSaga);
  yield takeLatest(CHANGE_COACH_LINK, coachLinkSaga);
  yield takeLatest(CHANGE_LINK, changeLinkSaga);
  yield takeLatest(CHANGE_LINK_OPTIONS, changeLinkOptionsSaga);
  yield takeLatest(GET_EARNINGS, getEarningsSaga);
  yield takeLatest(GET_PERIODIC_EARNINGS, getPeriodicEarningsSaga);
  yield takeLatest(GET_EARNINGS_PERIOD, getEarningsForSelectedPeriod);
  yield takeLatest(GET_AFFILIATES, getAffiliatesSaga);
  yield takeLatest(GET_RANKINGS, getRankingsSaga);
  yield takeLatest(GET_COUPONS, getCouponsSaga);
  yield takeLatest(WITHDRAW_AFFILIATION_EARNINGS, withdrawAffiliationEarningsSaga);
  yield takeLatest(GET_AFFILIATES_FILE, getAffiliatesFileSaga);
  yield takeLatest(GET_PAYOUTS, getPayoutsSaga);
}

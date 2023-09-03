// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  APPLY_STUDENT_SUBSCRIPTION,
  DELETE_PAYMENT_METHOD,
  GET_CANCEL_SUBSCRIPTION_QUESTIONNAIRE,
  GET_INVOICES,
  GET_PAYMENT_INFO,
  GET_PAYMENT_METHODS,
  GET_STUDENT_ACTIVE_SUBSCRIPTION_PLAN,
  GET_STUDENT_CARD_INFO,
  GET_STUDENT_CURRENT_SUBSCRIPTION_PLAN,
  GET_SUBSCRIPTION_TYPES,
  POST_STUDENT_ADD_STUDENT_CARD,
  POST_STUDENT_CANCEL_SUBSCRIPTION,
  POST_STUDENT_CREATE_PAYMENT_INTENT,
  POST_STUDENT_CREATE_SETUP_INTENT,
  SET_STUDENT_DEFAULT_PAYMENT_METHOD,
} from './constants';
import { API_URL } from '../../config/env';
import request from '../../utils/request';
import {
  createPaymentIntentSuccess,
  getCardInfoAction,
  getPaymentMethodsAction,
  getSubscriptionTypesSuccess,
  selectSubscriptionAction,
  setActiveSubscriptionAction,
  setCancelSubscriptionQuestionnaireAction,
  setCardInfoAction,
  setCurrentSubscriptionAction,
  setInvoicesAction,
  setPaymentMethodsAction,
  setSetupIntentSecretAction,
} from './actions';
import { readFromStorage } from '../../utils/storage';
import { updateAvatarError, updateAvatarSuccess } from '../Auth/actions';
import history from '../../utils/history';
import triggerLoadingRequest, { defaultHeaders } from '../../utils/requestWrapper';
import { searchSaga } from '../HomePage/saga';
import { getUserBasicDataSaga } from '../Auth/saga';
import { setLoadingAction, handleErrorAction } from '../HomePage/actions';

export function* getSubscriptionTypesSaga({ payload }) {
  const { body } = payload || {};
  const authToken = readFromStorage('authToken');
  const requestURL = `${API_URL}/Subscription/GetAvailableSubscriptionTypes${
    authToken ? `?authToken=${authToken}` : body.affToken ? `?affToken=${body.affToken}` : ''
  }`;
  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    console.log(response);
    yield put(getSubscriptionTypesSuccess(response));
    return response;
  } catch (err) {
    // yield put(getCategoriesError(err));
  }
}

export function* uploadStudentCard(data) {
  const authToken = readFromStorage('authToken');
  const requestURL = `${API_URL}/Subscription/UploadStudentCard`;
  yield call(request, requestURL, {
    method: 'POST',
    body: JSON.stringify({
      authToken,
      subscriptionPlanId: data.payload.subscriptionId,
      studentCardBase64Imgs: data.payload.data,
    }),
    // mode: 'no-cors',
  });
  const cardInfo = yield getCardInfoSaga();
  const userHasPaymentMethodSet = cardInfo?.card?.validTo;

  history.push(userHasPaymentMethodSet ? '/' : 'profileDetails');
  toast.success(
    "Votre carte a été enregistrée avec succès pour la vérification. Vous serez informé dès que l'administrateur l'aura vérifiée.",
  );
}
export function* createSetupIntentSaga() {
  const authToken = readFromStorage('authToken');
  const requestURL = `${API_URL}/Subscription/CreateSetupIntent`;
  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({ authToken }),
    });
    yield put(setSetupIntentSecretAction(response));
  } catch (err) {
    // yield put(updateAvatarError(err));
  }
}
export function* setDefaultPaymentSourceSaga(data) {
  const authToken = readFromStorage('authToken');
  const requestURL = `${API_URL}/Subscription/SetCustomerDefaultSource`;
  yield call(request, requestURL, {
    method: 'POST',
    body: JSON.stringify({
      authToken,
      payMethodId: data.payload.setupIntent?.payment_method,
    }),
  });
  yield getUserBasicDataSaga();
  yield getCardInfoSaga();
  yield put(getPaymentMethodsAction());
}

export function* cancelSubscriptionSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { answerId } = body;

  const authToken = readFromStorage('authToken');
  const requestURL = `${API_URL}/Subscription/CancelSubscription`;
  yield call(request, requestURL, {
    method: 'POST',
    body: JSON.stringify({
      authToken,
      userCancelSubResponse: answerId,
    }),
  });
  yield getUserBasicDataSaga();
  yield getCurrentSubscriptionSaga();
  yield getActiveSubscriptionSaga();
  toast.success(`Abonnement annulé`);
}

export function* selectSubscriptionPlanSaga(data) {
  try {
    const authToken = readFromStorage('authToken');
    const requestURL = `${API_URL}/Subscription/SelectSubscriptionPlan`;
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({ authToken, subscriptionId: data.payload?.id }),
    });
    yield getUserBasicDataSaga();
  } catch (e) {
    console.log(e.response);
  }
}
export function* createSubscriptionSaga(data) {
  try {
    const authToken = readFromStorage('authToken');
    const requestURL = `${API_URL}/Subscription/CreateUserSubscription`;
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
      }),
    });
    const subscriptions = yield getSubscriptionTypesSaga({});
    const chosenSubscription = subscriptions?.filter(
      (sub) => sub.id === data.payload.id || sub.id === data.payload.subscriptionId,
    )?.[0];
    chosenSubscription?.billingOptionStr === 'STUDENT'
      ? history.push('/subscription/studentCardVerification')
      : history.push('/');
    toast.success(`Merci, votre abonnement a été validé avec succès`);
    return response;
  } catch (e) {
    if (e?.response?.CodeString === 'DataNotValid') {
      if (e?.response?.Error?.includes('Student') || e?.response?.CodeString?.includes('card')) {
        toast.success("Veuillez fournir une carte d'étudiant pour utiliser ce type d'abonnement");
        return history.push('/subscription/studentCardVerification');
      }
      toast.error(
        "Veuillez fournir un prénom et un second nom pour poursuivre l'achat de l'abonnement.",
      );
      history.push('/studentProfile');
    }
  }
}
export function* changeSubscriptionPlanSaga(data) {
  try {
    yield put(setLoadingAction(true));
    const authToken = readFromStorage('authToken');
    const requestURL = `${API_URL}/Subscription/ChangeSubscriptionPlan`;
    const body = {
      authToken,
      newSubscriptionPlanId: data.payload?.id,
    };
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const cardInfo = yield getCardInfoSaga();
    const subscriptions = yield getSubscriptionTypesSaga({});
    const userHasPaymentMethodSet = cardInfo?.card?.validTo;
    const chosenSubscription = subscriptions?.filter(
      (sub) => sub.id === Number(data.payload.id) || sub.id === Number(data.payload.subscriptionId),
    )?.[0];
    console.log('CHOSEN SUBSCRIPTION', chosenSubscription, subscriptions, data.payload);
    if (chosenSubscription?.billingOptionStr === 'STUDENT') {
      history.push('/subscription/studentCardVerification');
      toast.success(
        `La demande de modification de l'abonnement a été envoyée. L'abonnement deviendra actif après que l'administrateur aura vérifié votre carte d'étudiant.`,
      );
    } else {
      history.push(userHasPaymentMethodSet ? '/' : '/subscription/profileDetails');
      toast.success(
        `L'abonnement a été modifié avec succès et sera actif après la prochaine date de facturation.`,
      );
    }
    yield getCurrentSubscriptionSaga();
  } catch (err) {
    console.log(err.response);
    // if (err?.response?.CodeString === 'DataNotValid') {
    //   if (
    //     err?.response?.Error?.includes('Student') ||
    //     err?.response?.CodeString?.includes('card')
    //   ) {
    //     toast.success(
    //       'Please provide a student card to use this type of subscription',
    //     );
    //     return history.push('studentVerification');
    //   }
    //   toast.error(
    //     'Please provide a first name and second name to continue with subscription purchase',
    //   );
    //   history.push('/studentProfile');
    // }
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
    data.payload.onFinish && data.payload.onFinish();
  }
}
export function* applySubscriptionSaga(data) {
  if (data.payload.userHasPreviousSubscriptions) {
    yield triggerLoadingRequest(changeSubscriptionPlanSaga, data);
  } else {
    yield triggerLoadingRequest(function* () {
      yield selectSubscriptionPlanSaga(data);
      yield createSubscriptionSaga(data);
    }, data);
  }
}

export function* getInvoicesSaga({ payload }) {
  try {
    const requestURL = `${API_URL}/Subscription/GetInvoiceDetails?authToken=${readFromStorage(
      'authToken',
    )}`;
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setInvoicesAction(response));
  } catch (e) {
    console.warn(e);
  } finally {
    payload.finally && payload.finally();
  }
}

export function* getCurrentSubscriptionSaga() {
  const requestURL = `${API_URL}/Subscription/GetUserCurrentSubscriptionPlan?authToken=${readFromStorage(
    'authToken',
  )}`;
  const response = yield call(request, requestURL, {
    method: 'GET',
  });
  yield put(setCurrentSubscriptionAction(response));
}
export function* getActiveSubscriptionSaga() {
  const requestURL = `${API_URL}/Subscription/GetUserActiveSubscriptionPlan?authToken=${readFromStorage(
    'authToken',
  )}`;
  const response = yield call(request, requestURL, {
    method: 'GET',
  });
  yield put(setActiveSubscriptionAction(response));
}
export function* getCardInfoSaga() {
  try {
    const requestURL = `${API_URL}/Subscription/GetUserDefaultCardInfo?authToken=${readFromStorage(
      'authToken',
    )}`;
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setCardInfoAction(response));
    return response;
  } catch (e) {
    yield put(setCardInfoAction(null));
  }
}

export function* getPaymentMethodsSaga({ payload }) {
  const { actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  try {
    const requestURL = `${API_URL}/Profile/Paymethods`;
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setPaymentMethodsAction(response));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export function* deletePaymentMethodSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { methodId } = body;
  try {
    yield put(setLoadingAction(true));
    const requestURL = `${API_URL}/Profile/Paymethods/${methodId}`;
    const response = yield call(request, requestURL, {
      method: 'DELETE',
    });
    yield put(getPaymentMethodsAction());
    yield put(getCardInfoAction());
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    yield put(setLoadingAction(false));
    onFetchEnd();
  }
}

export function* getPaymentInfoSaga() {
  yield getActiveSubscriptionSaga();
  yield getCurrentSubscriptionSaga();
  yield getCardInfoSaga();
}

export function* getCancelSubscriptionQuestionnaireSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { type } = body;
  try {
    yield put(setLoadingAction(true));
    const requestURL = `${API_URL}/Questionnaire/Form/${type}`;
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setCancelSubscriptionQuestionnaireAction(response));
    onSuccess(response);
  } catch (err) {
    onError(err);
  } finally {
    yield put(setLoadingAction(false));
    onFetchEnd();
  }
}

export default function* subscriptionSaga() {
  yield takeLatest(GET_SUBSCRIPTION_TYPES, getSubscriptionTypesSaga);
  yield takeLatest(POST_STUDENT_ADD_STUDENT_CARD, (data) =>
    triggerLoadingRequest(uploadStudentCard, data),
  );
  yield takeLatest(POST_STUDENT_CREATE_SETUP_INTENT, createSetupIntentSaga);
  yield takeLatest(SET_STUDENT_DEFAULT_PAYMENT_METHOD, (data) =>
    triggerLoadingRequest(setDefaultPaymentSourceSaga, data),
  );
  yield takeLatest(APPLY_STUDENT_SUBSCRIPTION, changeSubscriptionPlanSaga);
  yield takeLatest(GET_INVOICES, getInvoicesSaga);
  yield takeLatest(POST_STUDENT_CANCEL_SUBSCRIPTION, (data) =>
    triggerLoadingRequest(cancelSubscriptionSaga, data),
  );
  yield takeLatest(GET_STUDENT_CURRENT_SUBSCRIPTION_PLAN, getCurrentSubscriptionSaga);
  yield takeLatest(GET_STUDENT_ACTIVE_SUBSCRIPTION_PLAN, getActiveSubscriptionSaga);
  yield takeLatest(GET_STUDENT_CARD_INFO, getCardInfoSaga);
  yield takeLatest(GET_PAYMENT_METHODS, getPaymentMethodsSaga);
  yield takeLatest(GET_PAYMENT_INFO, getPaymentInfoSaga);
  yield takeLatest(DELETE_PAYMENT_METHOD, deletePaymentMethodSaga);
  yield takeLatest(GET_CANCEL_SUBSCRIPTION_QUESTIONNAIRE, getCancelSubscriptionQuestionnaireSaga);
}

import { takeLatest, call, put } from 'redux-saga/effects';

// Individual exports for testing
import { toast } from 'react-toastify';
import { API_URL, BASE_URL } from '../../config/env';
import request from '../../utils/request';
import {
  createAccountSuccess,
  getStripeConnectedAccountLinkAction,
  getStudentBasicDataSuccess,
  getUserBasicDataSuccess,
  getUserCategoriesSuccess,
  logIntoAccountSuccess,
  setAffiliateHostAction,
  setPaypalAccountInfoAction,
  setStripeConnectedAccountLinkAction,
  updateAvatarSuccess,
  updatePasswordSuccess,
  updateUserDataSuccess,
} from './actions';
import {
  ANSWER_TO_QUESTIONNAIRE,
  BALANCE_WITHDRAW,
  CONFIRM_NEW_PASSWORD,
  CREATE_ACCOUNT,
  CREATE_ACCOUNT_GOOGLE,
  CREATE_STRIPE_ACCOUNT,
  DELETE_ACCOUNT,
  GET_AFFILIATE_HOST,
  GET_FIRST_STEP_STRIPE_VERIFICATION,
  GET_GOOGLE_TOKEN,
  GET_PAYPAL_ACCOUNT_INFO,
  GET_SECOND_STEP_STRIPE_VERIFICATION,
  GET_STRIPE_CONNECTED_ACCOUNT_LINK,
  GET_USER_BASIC_DATA,
  GET_USER_CATEGORIES,
  LOGIN_ACCOUNT,
  LOGIN_ACCOUNT_SUCCESS,
  LOGIN_GOOGLE,
  LOGOUT,
  PAYPAL_WITHDRAW,
  RESEND_EMAIL_VERIFICATION,
  SEND_PASSWORD_RESET,
  UPDATE_AVATAR,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_USER_BASIC_DATA,
  UPDATE_USER_COMPANY_DATA,
  USER_ATTACH_CATEGORY,
  USER_DETACH_CATEGORY,
  VERIFY_PAYPAL_ACCOUNT,
} from './constants';
import history from '../../utils/history';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import triggerLoadingRequest, { defaultHeaders } from '../../utils/requestWrapper';
import {
  setActiveSubscriptionAction,
  setCardInfoAction,
  setCurrentSubscriptionAction,
} from '../Subscription/actions';
import {
  setLoadingAction,
  setLoadingOverlayAction,
  handleErrorAction,
  showErrorAction,
} from '../HomePage/actions';
import { getPaymentInfoSaga } from '../Subscription/saga';
import { setRankingsAction } from '../Affiliation/actions';

export function* createAccountSaga(data) {
  const path = data.payload.isCoach ? 'CreateAccount' : 'RegisterStudentAccount';
  const requestURL = `${API_URL}/Authentication/${path}`;
  const { onSuccess = () => null } = data?.payload || {};
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        emailAddress: data.payload.email?.toLowerCase(),
        password: data.payload.password,
        repeatedPassword: data.payload.confirm_password,
        firstName: data.payload.firstName,
        lastName: data.payload.lastName,
        phoneNo: data.payload.phoneNo,
        affiliateLink: data.payload.affiliateLink,
      }),
    });
    yield put(createAccountSuccess(response));
    yield put(logIntoAccountSuccess(response));
    onSuccess(response);
    // history.replace('/auth/confirmEmail');
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* createAccountGoogleSaga({ payload }) {
  console.log('Google create account payload', payload);
  const requestURL = `${API_URL}/Authentication/google/register`;
  const { tokenId, role, professionId, yearOfBirth, gender, libraryId, affiliateLink } =
    payload.data || {};
  const {
    onSuccess = () => null,
    onError = () => null,
    onFinish = () => null,
  } = payload.actions || {};
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        idToken: tokenId,
        userRole: role,
        professionId,
        yearOfBirth,
        gender,
        libraryId,
        affiliateLink,
      }),
    });
    yield put(createAccountSuccess(response));
    yield put(logIntoAccountSuccess(response));
    onSuccess(response);
  } catch (err) {
    onError();
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
    onFinish();
  }
}

export function* loginGoogleSaga({ payload }) {
  const requestURL = `${API_URL}/Authentication/google/login`;
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        idToken: payload.tokenId,
        deviceInfo: window.navigator.userAgent,
        ipAddress: 'string',
        placeInfo: 'string',
      }),
    });
    yield put(logIntoAccountSuccess(response));
  } catch (err) {
    if (err?.response?.Code === 12) {
      return history.replace('/auth/confirmEmail');
    }
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* loginAccountSuccessSaga({ payload }) {
  try {
    yield put(setLoadingOverlayAction(true));
    writeToStorage('authToken', payload.authToken);
    const selectedSubscription = readFromStorage('selectedSubscription');
    const isStudent = payload?.userInfo?.userRole === 'STUDENT';
    const freeSubscriptionSelected = selectedSubscription?.billingOptionStr === 'FREE';
    const hasSubscription = payload?.userInfo?.subscriptionActive;
    const userData = yield getUserBasicDataSaga();
    const stats = JSON.parse(JSON.stringify(require('../Statistics/mock-data.json')));
    stats.fakeAccountsEmails.includes(payload?.userInfo?.email) &&
      writeToStorage('isMockedAccount', true);
    const trialIsActive = userData?.trialActive;
    yield getPaymentInfoSaga();
    const shouldSuggestSubscriptionPurchase =
      isStudent && !hasSubscription && !freeSubscriptionSelected;
    history.replace(shouldSuggestSubscriptionPurchase ? `/subscription/subscriptionChoice` : '/');
  } catch (e) {
    handleErrorAction(e);
  } finally {
    yield put(setLoadingOverlayAction(false));
  }
}

export function* loginAccountSaga(data) {
  const requestURL = `${API_URL}/Authentication/GetAuthToken`;
  try {
    yield put(setLoadingAction(true));
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        email: data.payload.email?.toLowerCase(),
        password: data.payload.password,
        deviceInfo: window.navigator.userAgent,
        ipAddress: 'string',
        placeInfo: 'string',
      }),
    });
    yield put(logIntoAccountSuccess(response));
  } catch (err) {
    if (err?.response?.Code === 12) {
      return history.replace('/auth/confirmEmail');
    }
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* getUserBasicDataSaga() {
  const authToken = readFromStorage('authToken');
  const isCoach = readFromStorage('userInfo')?.userRole === 'COACH';

  const requestURL = isCoach
    ? `${API_URL}/Authentication/GetUserBasicData`
    : `${API_URL}/Profile/GetUserProfileData?authToken=${authToken}`;
  const headers = { ...defaultHeaders() };
  const args = isCoach
    ? {
      method: 'POST',
      headers,
      body: JSON.stringify({
          authToken,
      }),
    }
    : {
      method: 'GET',
      headers,
    };

  try {
    const response = yield call(request, requestURL, args);
    isCoach
      ? yield put(getUserBasicDataSuccess(response))
      : yield put(getStudentBasicDataSuccess(response));
    return response;
  } catch (err) {
    if (err.message === 'Unauthorized') {
      history.replace('/auth/login');
    }
    yield put(handleErrorAction(err));
  }
}

export function* updateUserDataSaga(data) {
  const authToken = readFromStorage('authToken');
  const isCoach = readFromStorage('userInfo')?.userRole === 'COACH';

  const requestURL = isCoach
    ? `${API_URL}/Authentication/UpdateUserData`
    : `${API_URL}/Profile/UpdateUserProfile`;

  const body = isCoach
    ? {
      authToken,
      name: data.payload.firstName,
      surname: data.payload.lastName,
      yearOfBirth: data.payload.birthDate,
      city: data.payload.city,
      gender: data.payload.gender?.value,
      bio: data.payload.bio,
      profilePhotoUrl: 'string',
      country: data.payload.country?.value,
      postalCode: data.payload.postalCode,
      address: data.payload.address,
      phoneNo: data.payload.phoneNo,
      userCategory: data.payload.category?.value,
    }
    : {
      authToken,
      name: data.payload.firstName,
      surname: data.payload.lastName,
      yearOfBirth: data.payload.birthDate,
      city: data.payload.city,
      gender: data.payload.gender?.value,
      country: data.payload.country?.value,
      postalCode: data.payload.postalCode,
      address: data.payload.address,
      phoneNo: data.payload.phoneNo,
      bio: data.payload.bio,
    };

  const response = yield call(request, requestURL, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  console.log('IS COACH', data.payload?.redirectTo);
  isCoach ? yield put(updateUserDataSuccess(response)) : yield getUserBasicDataSaga();
  data.payload?.redirectTo && history.push(data.payload?.redirectTo);
  toast.success('Les modifications ont été enregistrées correctement');
}

export function* updateCompanyDataSaga(data) {
  const requestURL = `${API_URL}/Authentication/UpdateCompanyInfo`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        ...data?.payload,
      }),
    });
    toast.success('Les données ont été mises à jour avec succès');
    yield getUserBasicDataSaga();
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* updatePasswordSaga(data) {
  const requestURL = `${API_URL}/Authentication/ChangePassword`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        oldPassword: data.payload.oldPassword,
        password: data.payload.newPassword,
        passwordRepeat: data.payload.newPassword,
      }),
    });
    toast.success('Le mot de passe a changé !');
    yield put(updatePasswordSuccess(response));
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* updateEmailSaga({ payload }) {
  const requestURL = `${API_URL}/Profile/UpdateUserEmail`;
  const authToken = readFromStorage('authToken');
  const { email } = payload;
  const response = yield call(request, requestURL, {
    method: 'POST',
    body: JSON.stringify({
      authToken,
      email,
    }),
  });
  toast.success(
    'Pour modifier votre e-mail, confirmez la nouvelle adresse e-mail en cliquant sur le lien dans le message qui vous a été envoyé!',
  );
}

export function* updateAvatarSaga(data) {
  const authToken = readFromStorage('authToken');
  const isCoach = readFromStorage('userInfo')?.userRole === 'COACH';

  const requestURL = isCoach
    ? `${API_URL}/Authentication/UpdateProfileAvatar`
    : `${API_URL}/Profile/UpdateProfileAvatar`;

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify({
        authToken,
        photoBase64: data.payload.data,
        removeAvatar: data.payload.remove,
      }),
    });
    yield put(updateAvatarSuccess(response));
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    const { onFinish } = data?.payload || {};
    onFinish && onFinish();
  }
}

export function* sendPasswordResetSaga(data) {
  const requestURL = `${API_URL}/Authentication/ResetPassword`;

  try {
    yield put(setLoadingAction(true));
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        emailAddress: data.payload.email,
      }),
    });
    toast.success('La réinitialisation du mot de passe a été envoyée!');
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* confirmNewPasswordSaga(data) {
  const requestURL = `${API_URL}/Authentication/ConfirmNewPassword`;

  try {
    yield put(setLoadingAction(true));
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        emailAddress: data.payload.email,
        password: data.payload.password,
        repeatedPassword: data.payload.password,
        resetPasswordToken: data.payload.token,
      }),
    });
    toast.success('Le mot de passe a été changé!');
    history.replace('/auth/login');
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* resendEmailVerificationSaga({ payload }) {
  const requestURL = `${API_URL}/Authentication/ResendEmailVerification`;

  try {
    yield put(setLoadingAction(true));
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        emailAddress: payload.email,
      }),
    });
    toast.success("L'e-mail de vérification a été envoyé à votre adresse e-mail");
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* getUserCategoriesSaga() {
  const requestURL = `${API_URL}/Authentication/GetUserCategories`;

  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(getUserCategoriesSuccess(response));
  } catch (err) {
    // yield put(getUserBasicDataError(err));
  }
}

export function* deleteAccountSaga({ payload }) {
  const requestURL = `${API_URL}/Authentication/DeleteAccount`;

  yield call(request, requestURL, {
    method: 'DELETE',
    body: JSON.stringify({
      authToken: readFromStorage('authToken'),
    }),
  });
  payload.onSuccess && payload.onSuccess();
}

export function* attachUserCategorySaga(data) {
  const requestURL = `${API_URL}/Courses/AssingCategoryToUser`;
  const authToken = readFromStorage('authToken');
  console.log('DATA', data);
  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        categoryId: data.payload.categoryId,
      }),
    });
  } catch (err) {
    // yield put(getUserBasicDataError(err));
  }
}

export function* detachUserCategorySaga(data) {
  const requestURL = `${API_URL}/Courses/DetachCategoryFromUser`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        categoryId: data.payload.categoryId,
      }),
    });
  } catch (err) {
    // yield put(getUserBasicDataError(err));
  }
}

// STRIPE
export function* createStripeAccountSaga(country) {
  const requestURL = `${API_URL}/Authentication/CreateStripeAccount`;
  const authToken = readFromStorage('authToken');

  try {
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({ authToken, countryCode: country.payload.value }),
    });
    toast.success('Votre compte stripe a été créé');
    yield getUserBasicDataSaga();
  } catch (err) {
    toast.error('Erreur lors de la création du compte stripe. Veuillez réessayer !');
  }
}

export function* getFirstStepStripeVerificationUrlSaga() {
  const requestURL = `${API_URL}/Authentication/FirstStageVerification`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({ authToken }),
    });
    toast.success('Vous allez être redirigé vers stripe');
    window.location.replace(response.url);
  } catch (err) {
    console.log(err);
    toast.error(
      "Erreur lors de la tentative de redirection vers stripe. S'il vous plaît, essayez à nouveau !",
    );
  }
}

export function* getSecondStepStripeVerificationUrlSaga() {
  const requestURL = `${API_URL}/Authentication/SecondStageVerification`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({ authToken }),
    });
    toast.success('Vous allez être redirigé vers stripe');
    window.location.replace(response.url);
  } catch (err) {
    console.log(err);
    toast.error(
      "Erreur lors de la tentative de redirection vers stripe. S'il vous plaît, essayez à nouveau !",
    );
  }
}

export function* getStripeConnectedAccountLinkSaga({ payload }) {
  const requestURL = `${API_URL}/Profile/stripe/connectedaccount`;
  const { onSuccess = () => null } = payload?.actions || {};
  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setStripeConnectedAccountLinkAction(response));
    onSuccess();
  } catch (err) {
    console.log(err);
    // yield put(handleErrorAction(err));
  }
}

export function* balanceWithdrawSaga() {
  const requestURL = `${API_URL}/CoachAccount/WidthrawPayment`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({ authToken }),
    });
    toast.success('Vous avez retiré vos gains avec succès');
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* getPaypalAccountInfoSaga() {
  const requestURL = `${API_URL}/Paypal/GetPayPalAccountInfo`;
  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setPaypalAccountInfoAction(response));
  } catch (err) {
    const excludedErrors = ['NotExist'];
    if (!excludedErrors.includes(err.response?.CodeString)) {
      yield put(handleErrorAction(err));
    }
  }
}

export function* verifyPaypalAccountSaga({ payload }) {
  const requestURL = `${API_URL}/PayPal/VerifyAccount`;
  try {
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({ payPalAccessToken: payload }),
    });
    toast.success('Le compte Paypal a été vérifié avec succès');
    yield getPaypalAccountInfoSaga();
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* paypalWithdrawSaga({ payload }) {
  const { actions = {} } = payload || {};
  const { onSuccess = () => null } = actions;
  const requestURL = `${API_URL}/PayPal/WithdrawPaymentByPaypal`;
  try {
    yield call(request, requestURL, {
      method: 'POST',
    });
    toast.success(
      'Merci pour votre demande de virement, vous serez crédité après vérification de coachs online, veuillez attendre maximum 48 h',
    );
    onSuccess();
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}
export function* getAffiliateHostSaga({ payload }) {
  const requestURL = `${API_URL}/Authentication/GetAffiliateHostInfo/${payload}`;
  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setAffiliateHostAction(response));
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* logoutSaga() {
  try {
    yield put(setActiveSubscriptionAction(null));
    yield put(setCurrentSubscriptionAction(null));
    yield put(setCardInfoAction(null));
    yield put(setAffiliateHostAction(null));
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* getGoogleTokenSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { redirectUrl, actionType } = body;
  try {
    const requestUrl = `${API_URL}/Authentication/google/challange?redirectUrl=${redirectUrl}&callType=${actionType}`;
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
export function* answerToQuestionnaireSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  const { questionId, responseId, additionalAnswer } = body;
  try {
    const requestUrl = `${API_URL}/Questionnaire/form/${questionId}/answer`;
    const response = yield call(request, requestUrl, {
      method: 'PATCH',
      body: JSON.stringify({ responseId, additional: additionalAnswer }),
    });
    onSuccess(response);
  } catch (err) {
    onError(err);
    yield put(showErrorAction(err));
  } finally {
    onFetchEnd();
  }
}
export default function* authSaga() {
  yield takeLatest(CREATE_ACCOUNT, createAccountSaga);
  yield takeLatest(LOGIN_ACCOUNT, loginAccountSaga);
  yield takeLatest(LOGIN_ACCOUNT_SUCCESS, loginAccountSuccessSaga);
  yield takeLatest(CREATE_ACCOUNT_GOOGLE, createAccountGoogleSaga);
  yield takeLatest(LOGIN_GOOGLE, loginGoogleSaga);
  yield takeLatest(GET_USER_BASIC_DATA, getUserBasicDataSaga);
  yield takeLatest(UPDATE_USER_BASIC_DATA, (data) =>
    triggerLoadingRequest(updateUserDataSaga, data),
  );
  yield takeLatest(UPDATE_USER_COMPANY_DATA, updateCompanyDataSaga);
  yield takeLatest(UPDATE_PASSWORD, updatePasswordSaga);
  yield takeLatest(UPDATE_EMAIL, (data) => triggerLoadingRequest(updateEmailSaga, data));
  yield takeLatest(UPDATE_AVATAR, updateAvatarSaga);
  yield takeLatest(SEND_PASSWORD_RESET, sendPasswordResetSaga);
  yield takeLatest(CONFIRM_NEW_PASSWORD, confirmNewPasswordSaga);
  yield takeLatest(RESEND_EMAIL_VERIFICATION, resendEmailVerificationSaga);
  yield takeLatest(GET_USER_CATEGORIES, getUserCategoriesSaga);
  yield takeLatest(USER_ATTACH_CATEGORY, attachUserCategorySaga);
  yield takeLatest(USER_DETACH_CATEGORY, detachUserCategorySaga);
  yield takeLatest(CREATE_STRIPE_ACCOUNT, createStripeAccountSaga);
  yield takeLatest(GET_FIRST_STEP_STRIPE_VERIFICATION, getFirstStepStripeVerificationUrlSaga);
  yield takeLatest(GET_SECOND_STEP_STRIPE_VERIFICATION, getSecondStepStripeVerificationUrlSaga);
  yield takeLatest(GET_STRIPE_CONNECTED_ACCOUNT_LINK, getStripeConnectedAccountLinkSaga);
  yield takeLatest(BALANCE_WITHDRAW, balanceWithdrawSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(DELETE_ACCOUNT, (data) => triggerLoadingRequest(deleteAccountSaga, data));
  yield takeLatest(GET_PAYPAL_ACCOUNT_INFO, getPaypalAccountInfoSaga);
  yield takeLatest(VERIFY_PAYPAL_ACCOUNT, verifyPaypalAccountSaga);
  yield takeLatest(PAYPAL_WITHDRAW, paypalWithdrawSaga);
  yield takeLatest(GET_AFFILIATE_HOST, getAffiliateHostSaga);
  yield takeLatest(GET_GOOGLE_TOKEN, getGoogleTokenSaga);
  yield takeLatest(ANSWER_TO_QUESTIONNAIRE, answerToQuestionnaireSaga);
}

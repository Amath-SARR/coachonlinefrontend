/*
 *
 * Auth actions
 *
 */

import {
  ANSWER_TO_QUESTIONNAIRE,
  BALANCE_WITHDRAW,
  CONFIRM_NEW_PASSWORD,
  CREATE_ACCOUNT,
  CREATE_ACCOUNT_ERROR,
  CREATE_ACCOUNT_GOOGLE,
  CREATE_ACCOUNT_SUCCESS,
  CREATE_STRIPE_ACCOUNT,
  DELETE_ACCOUNT,
  GET_AFFILIATE_HOST,
  GET_FIRST_STEP_STRIPE_VERIFICATION,
  GET_GOOGLE_TOKEN,
  GET_PAYPAL_ACCOUNT_INFO,
  GET_SECOND_STEP_STRIPE_VERIFICATION,
  GET_STRIPE_CONNECTED_ACCOUNT_LINK,
  GET_STUDENT_BASIC_DATA_SUCCESS,
  GET_USER_BASIC_DATA,
  GET_USER_BASIC_DATA_ERROR,
  GET_USER_BASIC_DATA_SUCCESS,
  GET_USER_CATEGORIES,
  GET_USER_CATEGORIES_SUCCESS,
  LOGIN_ACCOUNT,
  LOGIN_ACCOUNT_ERROR,
  LOGIN_ACCOUNT_SUCCESS,
  LOGIN_GOOGLE,
  LOGOUT,
  PAYPAL_WITHDRAW,
  RESEND_EMAIL_VERIFICATION,
  SEND_PASSWORD_RESET,
  SET_AFFILIATE_HOST,
  SET_PAYPAL_ACCOUNT_INFO,
  SET_QUESTIONNAIRE,
  SET_STRIPE_CONNECTED_ACCOUNT_LINK,
  SET_USER_INFO,
  UPDATE_AVATAR,
  UPDATE_AVATAR_ERROR,
  UPDATE_AVATAR_SUCCESS,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_ERROR,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_USER_BASIC_DATA,
  UPDATE_USER_BASIC_DATA_ERROR,
  UPDATE_USER_BASIC_DATA_SUCCESS,
  UPDATE_USER_COMPANY_DATA,
  USER_ATTACH_CATEGORY,
  USER_DETACH_CATEGORY,
  VERIFY_PAYPAL_ACCOUNT,
} from './constants';

export function createAccountAction(data) {
  return {
    type: CREATE_ACCOUNT,
    payload: data,
  };
}

export function createAccountSuccess(data) {
  return {
    type: CREATE_ACCOUNT_SUCCESS,
    payload: data,
  };
}

export function createAccountError(data) {
  return {
    type: CREATE_ACCOUNT_ERROR,
    payload: data,
  };
}

export function logIntoAccountAction(data) {
  return {
    type: LOGIN_ACCOUNT,
    payload: data,
  };
}

export function logIntoAccountSuccess(data) {
  return {
    type: LOGIN_ACCOUNT_SUCCESS,
    payload: data,
  };
}
export function setUserInfoAction(data) {
  return {
    type: SET_USER_INFO,
    payload: data,
  };
}
export function resendEmailVerificationAction(data) {
  return {
    type: RESEND_EMAIL_VERIFICATION,
    payload: data,
  };
}

export function logIntoAccountError() {
  return {
    type: LOGIN_ACCOUNT_ERROR,
  };
}

export function createAccountGoogleAction(data) {
  return {
    type: CREATE_ACCOUNT_GOOGLE,
    payload: data,
  };
}

export function getGoogleTokenAction(data) {
  return {
    type: GET_GOOGLE_TOKEN,
    payload: data,
  };
}

export function loginGoogleAction(data) {
  return {
    type: LOGIN_GOOGLE,
    payload: data,
  };
}

export function logoutAction() {
  return {
    type: LOGOUT,
  };
}

export function getUserBasicDataAction(data) {
  return {
    type: GET_USER_BASIC_DATA,
    payload: data,
  };
}

export function getUserBasicDataSuccess(data) {
  return {
    type: GET_USER_BASIC_DATA_SUCCESS,
    payload: data,
  };
}

export function getStudentBasicDataSuccess(data) {
  return {
    type: GET_STUDENT_BASIC_DATA_SUCCESS,
    payload: data,
  };
}

export function getUserBasicDataError(data) {
  return {
    type: GET_USER_BASIC_DATA_ERROR,
    payload: data,
  };
}

export function updateUserDataAction(data) {
  return {
    type: UPDATE_USER_BASIC_DATA,
    payload: data,
  };
}

export function updateUserDataSuccess(data) {
  return {
    type: UPDATE_USER_BASIC_DATA_SUCCESS,
    payload: data,
  };
}

export function updateUserDataError(data) {
  return {
    type: UPDATE_USER_BASIC_DATA_ERROR,
    payload: data,
  };
}

export function updateCompanyDataAction(data) {
  return {
    type: UPDATE_USER_COMPANY_DATA,
    payload: data,
  };
}

export function updatePasswordAction(data) {
  return {
    type: UPDATE_PASSWORD,
    payload: data,
  };
}

export function updateEmailAction({ email }) {
  return {
    type: UPDATE_EMAIL,
    payload: { email },
  };
}

export function updatePasswordSuccess(data) {
  return {
    type: UPDATE_PASSWORD_SUCCESS,
    payload: data,
  };
}

export function updatePasswordError(data) {
  return {
    type: UPDATE_PASSWORD_ERROR,
    payload: data,
  };
}

export function updateAvatarAction(data) {
  return {
    type: UPDATE_AVATAR,
    payload: data,
  };
}

export function updateAvatarSuccess(data) {
  return {
    type: UPDATE_AVATAR_SUCCESS,
    payload: data,
  };
}

export function updateAvatarError(data) {
  return {
    type: UPDATE_AVATAR_ERROR,
    payload: data,
  };
}

export function sendPasswordResetAction(data) {
  return {
    type: SEND_PASSWORD_RESET,
    payload: data,
  };
}

export function confirmNewPasswordAction(data) {
  return {
    type: CONFIRM_NEW_PASSWORD,
    payload: data,
  };
}

export function getUserCategoriesAction() {
  return {
    type: GET_USER_CATEGORIES,
  };
}

export function getUserCategoriesSuccess(data) {
  return {
    type: GET_USER_CATEGORIES_SUCCESS,
    payload: data,
  };
}

export function attachUserCategoryAction(data) {
  return {
    type: USER_ATTACH_CATEGORY,
    payload: data,
  };
}

export function detachUserCategoryAction(data) {
  return {
    type: USER_DETACH_CATEGORY,
    payload: data,
  };
}

export function deleteAccountAction({ onSuccess }) {
  return {
    type: DELETE_ACCOUNT,
    payload: { onSuccess },
  };
}

// STRIPE
export function createStripeAccountAction(country) {
  return {
    type: CREATE_STRIPE_ACCOUNT,
    payload: country,
  };
}

export function getFirstStepStripeVerificationUrlAction() {
  return {
    type: GET_FIRST_STEP_STRIPE_VERIFICATION,
  };
}

export function getSecondStepStripeVerificationUrlAction() {
  return {
    type: GET_SECOND_STEP_STRIPE_VERIFICATION,
  };
}
export function balanceWithdrawAction() {
  return {
    type: BALANCE_WITHDRAW,
  };
}
export function getStripeConnectedAccountLinkAction(data) {
  return {
    type: GET_STRIPE_CONNECTED_ACCOUNT_LINK,
    payload: data,
  };
}
export function setStripeConnectedAccountLinkAction(data) {
  return {
    type: SET_STRIPE_CONNECTED_ACCOUNT_LINK,
    payload: data,
  };
}
// Paypal
export function getPaypalAccountInfoAction() {
  return {
    type: GET_PAYPAL_ACCOUNT_INFO,
  };
}
export function setPaypalAccountInfoAction(data) {
  return {
    type: SET_PAYPAL_ACCOUNT_INFO,
    payload: data,
  };
}
export function verifyPaypalAccountAction(token) {
  return {
    type: VERIFY_PAYPAL_ACCOUNT,
    payload: token,
  };
}
export function paypalWithdrawAction(data) {
  return {
    type: PAYPAL_WITHDRAW,
    payload: data,
  };
}

export function getAffiliateHostAction(token) {
  return {
    type: GET_AFFILIATE_HOST,
    payload: token,
  };
}
export function setAffiliateHostAction(data) {
  return {
    type: SET_AFFILIATE_HOST,
    payload: data,
  };
}
export function setQuestionnaireAction(data) {
  return {
    type: SET_QUESTIONNAIRE,
    payload: data,
  };
}
export function answerToQuestionnaireAction(data) {
  return {
    type: ANSWER_TO_QUESTIONNAIRE,
    payload: data,
  };
}

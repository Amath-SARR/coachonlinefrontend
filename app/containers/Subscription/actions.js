/*
 *
 * Subscription actions
 *
 */

import {
  ANSWER_CANCEL_SUBSCRIPTION_QUESTIONNAIRE,
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
  GET_SUBSCRIPTION_TYPES_SUCCESS,
  POST_STUDENT_ADD_STUDENT_CARD,
  POST_STUDENT_CANCEL_SUBSCRIPTION,
  POST_STUDENT_CREATE_SETUP_INTENT,
  SET_CANCEL_SUBSCRIPTION_QUESTIONNAIRE,
  SET_INVOICES,
  SET_PAYMENT_METHODS,
  SET_STUDENT_ACTIVE_SUBSCRIPTION_PLAN,
  SET_STUDENT_CARD_INFO,
  SET_STUDENT_CURRENT_SUBSCRIPTION_PLAN,
  SET_STUDENT_DEFAULT_PAYMENT_METHOD,
  SET_STUDENT_SETUP_INTENT_SECRET,
  STUDENT_SELECT_SUBSCRIPTION,
} from './constants';

export function getSubscriptionTypesAction(data) {
  return {
    type: GET_SUBSCRIPTION_TYPES,
    payload: data,
  };
}
export function getSubscriptionTypesSuccess(data) {
  return {
    type: GET_SUBSCRIPTION_TYPES_SUCCESS,
    payload: data,
  };
}

export function getCardInfoAction(data) {
  return {
    type: GET_STUDENT_CARD_INFO,
    payload: data,
  };
}

export function setCardInfoAction(data) {
  return {
    type: SET_STUDENT_CARD_INFO,
    payload: data,
  };
}

export function getPaymentMethodsAction(data) {
  return {
    type: GET_PAYMENT_METHODS,
    payload: data,
  };
}

export function setPaymentMethodsAction(data) {
  return {
    type: SET_PAYMENT_METHODS,
    payload: data,
  };
}

export function getPaymentInfoAction() {
  return {
    type: GET_PAYMENT_INFO,
  };
}

export function getActiveSubscriptionAction(data) {
  return {
    type: GET_STUDENT_ACTIVE_SUBSCRIPTION_PLAN,
    payload: data,
  };
}

export function setActiveSubscriptionAction(data) {
  return {
    type: SET_STUDENT_ACTIVE_SUBSCRIPTION_PLAN,
    payload: data,
  };
}

export function getCurrentSubscriptionAction(data) {
  return {
    type: GET_STUDENT_CURRENT_SUBSCRIPTION_PLAN,
    payload: data,
  };
}

export function setCurrentSubscriptionAction(data) {
  return {
    type: SET_STUDENT_CURRENT_SUBSCRIPTION_PLAN,
    payload: data,
  };
}

export function cancelSubscriptionAction(data) {
  return {
    type: POST_STUDENT_CANCEL_SUBSCRIPTION,
    payload: data,
  };
}

export function selectSubscriptionAction(data) {
  return {
    type: STUDENT_SELECT_SUBSCRIPTION,
    payload: data,
  };
}
export function applySubscriptionAction(data) {
  return {
    type: APPLY_STUDENT_SUBSCRIPTION,
    payload: data,
  };
}
export function uploadStudentCardAction(data) {
  return {
    type: POST_STUDENT_ADD_STUDENT_CARD,
    payload: data,
  };
}
export function createSetupIntentAction() {
  return {
    type: POST_STUDENT_CREATE_SETUP_INTENT,
  };
}
export function setSetupIntentSecretAction(data) {
  return {
    type: SET_STUDENT_SETUP_INTENT_SECRET,
    payload: data,
  };
}
export function setDefaultPaymentMethodAction(data) {
  return {
    type: SET_STUDENT_DEFAULT_PAYMENT_METHOD,
    payload: data,
  };
}
export function getInvoicesAction(data) {
  return {
    type: GET_INVOICES,
    payload: data,
  };
}
export function setInvoicesAction(data) {
  return {
    type: SET_INVOICES,
    payload: data,
  };
}
export function deletePaymentMethodAction(data) {
  return {
    type: DELETE_PAYMENT_METHOD,
    payload: data,
  };
}
export function getCancelSubscriptionQuestionnaireAction(data) {
  return {
    type: GET_CANCEL_SUBSCRIPTION_QUESTIONNAIRE,
    payload: data,
  };
}
export function setCancelSubscriptionQuestionnaireAction(data) {
  return {
    type: SET_CANCEL_SUBSCRIPTION_QUESTIONNAIRE,
    payload: data,
  };
}
export function answerCancelSubscriptionQuestionnaireAction(data) {
  return {
    type: ANSWER_CANCEL_SUBSCRIPTION_QUESTIONNAIRE,
    payload: data,
  };
}

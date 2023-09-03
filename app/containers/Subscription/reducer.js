/*
 *
 * Subscription reducer
 *
 */
import produce from 'immer';
import {
  GET_SUBSCRIPTION_TYPES_SUCCESS,
  SET_CANCEL_SUBSCRIPTION_QUESTIONNAIRE,
  SET_INVOICES,
  SET_PAYMENT_METHODS,
  SET_STUDENT_ACTIVE_SUBSCRIPTION_PLAN,
  SET_STUDENT_CARD_INFO,
  SET_STUDENT_CURRENT_SUBSCRIPTION_PLAN,
  SET_STUDENT_SETUP_INTENT_SECRET,
  STUDENT_SELECT_SUBSCRIPTION,
} from './constants';
import { readFromStorage, writeToStorage } from '../../utils/storage';

export const initialState = {
  availableSubscriptions: readFromStorage('availableSubscriptions') || [],
  selected: readFromStorage('selectedSubscription') || {},
  setupClientSecret: readFromStorage('setupClientSecret') || '',
  invoices: readFromStorage('invoices') || [],
  activeSubscription: readFromStorage('activeSubscription') || null,
  currentSubscription: readFromStorage('currentSubscription') || null,
  cardInfo: readFromStorage('cardInfo') || null,
  paymentMethods: readFromStorage('paymentMethods') || [],
  questionnaire: null,
};

/* eslint-disable default-case, no-param-reassign */
const subscriptionReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_SUBSCRIPTION_TYPES_SUCCESS:
        draft.availableSubscriptions = action.payload || [];
        if (!state.selected?.id) {
          const yearlySubscriptions = action.payload.filter(
            (subscription) => subscription.price.periodType === 'year',
          );
          const yearlyTrial = yearlySubscriptions.filter(
            (subscription) => subscription.price?.trialDays > 0,
          );
          draft.selected = yearlyTrial?.[0] || yearlySubscriptions?.[0];
        }
        writeToStorage('availableSubscriptions', action.payload || []);
        break;
      case STUDENT_SELECT_SUBSCRIPTION:
        draft.selected = action.payload || {};
        writeToStorage('selectedSubscription', action.payload || {});
        break;
      case SET_STUDENT_SETUP_INTENT_SECRET:
        draft.setupClientSecret = action.payload?.clientSecret;
        writeToStorage('setupIntentSecret', action.payload);
        break;
      case SET_STUDENT_CARD_INFO:
        draft.cardInfo = action.payload;
        writeToStorage('cardInfo', action.payload);
        break;
      case SET_STUDENT_CURRENT_SUBSCRIPTION_PLAN:
        draft.currentSubscription = action.payload;
        writeToStorage('currentSubscription', action.payload);
        break;
      case SET_STUDENT_ACTIVE_SUBSCRIPTION_PLAN:
        draft.activeSubscription = action.payload;
        break;
      case SET_INVOICES:
        draft.invoices = action.payload?.invoices;
        writeToStorage('invoices', action.payload?.invoices);
        break;
      case SET_PAYMENT_METHODS:
        draft.paymentMethods = action.payload;
        writeToStorage('paymentMethods', action.payload);
        break;
      case SET_CANCEL_SUBSCRIPTION_QUESTIONNAIRE:
        draft.questionnaire = action.payload;
        break;
    }
  });

export default subscriptionReducer;

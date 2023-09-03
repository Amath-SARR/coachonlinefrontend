/*
 *
 * Auth reducer
 *
 */
import produce from 'immer';
import { toast } from 'react-toastify';
import {
  CREATE_ACCOUNT_ERROR,
  CREATE_ACCOUNT_SUCCESS,
  GET_STUDENT_BASIC_DATA_SUCCESS,
  GET_USER_BASIC_DATA_SUCCESS,
  GET_USER_CATEGORIES,
  GET_USER_CATEGORIES_SUCCESS,
  LOGIN_ACCOUNT_ERROR,
  LOGIN_ACCOUNT_SUCCESS,
  LOGOUT,
  SET_AFFILIATE_HOST,
  SET_PAYPAL_ACCOUNT_INFO,
  SET_QUESTIONNAIRE,
  SET_STRIPE_CONNECTED_ACCOUNT_LINK,
  SET_USER_INFO,
  UPDATE_USER_BASIC_DATA_SUCCESS,
} from './constants';
import { readFromStorage, writeToStorage } from '../../utils/storage';

export const initialState = {
  accountCreated: false,
  authToken: readFromStorage('authToken') || '',
  userInfo: readFromStorage('userInfo') || {
    authToken: '',
    email: '',
    name: '',
    stripeAccountId: '',
    stripeVerificationStatus: 0,
    subscriptionActive: false,
    userRole: 'STUDENT',
  },
  userDataFetched: readFromStorage('userDataFetched') || {
    bio: '',
    city: '',
    companyInfo: null,
    gender: '',
    name: '',
    stripeVerificationStatus: 0,
    profilePhotoUrl: '',
    surname: '',
    userCategory: '',
    yearOfBirth: 0,
  },
  studentData: readFromStorage('studentData') || {
    address: '',
    bio: '',
    city: '',
    country: '',
    name: '',
    postalCode: '',
    profilePhotoUrl: '',
    stripeCustomerId: '',
    subscription: {
      card: {
        brand: null,
        country: null,
        last4Digits: null,
        validTo: null,
      },
      currency: null,
      nextBillingTime: null,
      paymentMethodId: null,
      period: null,
      price: 0,
      selectedPlanId: 0,
      subscriptionId: null,
      subscriptionName: null,
    },
    surname: '',
    yearOfBirth: 0,
  },
  loading: true,
  categories: [],
  paypalAccount: readFromStorage('paypalAccount') || null,
  stripeConnectedAccountLink: readFromStorage('stripeConnectedAccountLink') || null,
  affiliateHost: null,
  questionnaire: null,
};

/* eslint-disable default-case, no-param-reassign */
const authReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CREATE_ACCOUNT_SUCCESS:
        draft.accountCreated = true;
        break;
      case CREATE_ACCOUNT_ERROR:
        draft.accountCreated = false;
        toast.error(action.payload);
        break;
      case LOGIN_ACCOUNT_ERROR:
        toast.error('Erreur de connexion');
        break;
      case SET_USER_INFO:
      case LOGIN_ACCOUNT_SUCCESS:
        draft.authToken = action.payload.authToken;
        draft.userInfo = action.payload.userInfo;
        writeToStorage('userInfo', action.payload.userInfo);
        writeToStorage('authToken', action.payload.authToken);
        break;
      case LOGOUT:
        draft.authToken = null;
        draft.userInfo = {};
        draft.studentData = {};
        draft.userDataFetched = {};
        draft.paypalAccount = null;
        draft.stripeConnectedAccountLink = null;
        writeToStorage('isMockedAccount', false);
        writeToStorage('stripeConnectedAccountLink', null);
        writeToStorage('userInfo', null);
        writeToStorage('authToken', null);
        writeToStorage('paymentIntentSecret', null);
        writeToStorage('userDataFetched', null);
        writeToStorage('studentData', null);
        writeToStorage('paypalAccount', null);
        writeToStorage('invoices', null);
        break;
      case GET_USER_BASIC_DATA_SUCCESS:
        draft.userDataFetched = action.payload;
        writeToStorage('userDataFetched', action.payload);
        draft.loading = false;
        break;
      case GET_STUDENT_BASIC_DATA_SUCCESS:
        draft.studentData = action.payload;
        writeToStorage('studentData', action.payload);
        draft.loading = false;
        break;
      case UPDATE_USER_BASIC_DATA_SUCCESS:
        toast.success('Les données ont été mises à jour avec succès');
        break;
      case GET_USER_CATEGORIES_SUCCESS:
        draft.categories = action.payload.items;
        break;
      case SET_PAYPAL_ACCOUNT_INFO:
        draft.paypalAccount = action.payload;
        writeToStorage('paypalAccount', action.payload);
        break;
      case SET_STRIPE_CONNECTED_ACCOUNT_LINK:
        draft.stripeConnectedAccountLink = action.payload;
        writeToStorage('stripeConnectedAccountLink', action.payload);
        break;
      case SET_AFFILIATE_HOST:
        console.log('Affiliate hose', action.payload);
        draft.affiliateHost = action.payload;
        break;
      case SET_QUESTIONNAIRE:
        draft.questionnaire = action.payload;
        break;
    }
  });

export default authReducer;

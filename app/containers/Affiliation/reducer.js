/*
 *
 * Affiliation reducer
 *
 */
import produce from 'immer';
import {
  SET_AFFILIATES,
  SET_COACH_LINK,
  SET_COUPONS,
  SET_EARNINGS,
  SET_EARNINGS_PERIOD,
  SET_LINK,
  SET_LINK_OPTIONS,
  SET_PERIODIC_EARNINGS,
  SET_RANKINGS,
} from './constants';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import { LOGOUT } from '../Auth/constants';
import { RankingTypes } from './reducer.types';

export const initialState = {
  link: readFromStorage('affiliationLink') || null,
  linkOptions: readFromStorage('affiliationLinkOptions') || null,
  coachLink: readFromStorage('affiliationCoachLink') || null,
  totalEarnings: readFromStorage('affiliationEarnings') || null,
  currentMonthEarnings: readFromStorage('affiliationCurrentMonthEarnings') || null,
  currentWeekEarnings: readFromStorage('affiliationCurrentWeekEarnings') || null,
  selectedPeriodEarnings: readFromStorage('affiliationSelectedPeriodEarnings') || null,
  affiliates: readFromStorage('affiliationAffiliates') || null,
  rankings: readFromStorage('affiliationRankings') || [],
  coupons: [],
};

/* eslint-disable default-case, no-param-reassign */
const affiliationReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LINK:
        draft.link = action.payload.link;
        writeToStorage('affiliationLink', action.payload.link);
        break;
      case SET_LINK_OPTIONS:
        draft.linkOptions = action.payload;
        writeToStorage('affiliationLinkOptions', action.payload);
        break;
      case SET_COACH_LINK:
        draft.coachLink = action.payload.link;
        writeToStorage('affiliationCoachLink', action.payload.link);
        break;
      case SET_EARNINGS:
        writeToStorage('affiliationEarnings', action.payload);
        draft.totalEarnings = action.payload;
        break;
      case SET_EARNINGS_PERIOD:
        writeToStorage('affiliationSelectedPeriodEarnings', action.payload);
        draft.selectedPeriodEarnings = action.payload;
        break;
      case SET_PERIODIC_EARNINGS:
        console.log('Received periodic eearnings', action.payload);
        writeToStorage('affiliationCurrentMonthEarnings', action.payload.currentMonthEarnings);
        writeToStorage('affiliationCurrentWeekEarnings', action.payload.currentWeekEarnings);
        draft.currentMonthEarnings = action.payload.currentMonthEarnings;
        draft.currentWeekEarnings = action.payload.currentWeekEarnings;
        break;
      case SET_AFFILIATES:
        // const sortedFromNewest = action.payload?.sort((a, b) => (a.joinDate > b.joinDate ? -1 : 1));
        const yearlySub = action.payload
          ?.filter((user) => user.chosenPlan === 'Abonnement annuel' && user.isDirect)
          ?.sort((a, b) => (a.joinDate > b.joinDate ? -1 : 1));
        const monthlySub = action.payload
          ?.filter(
            (user) => user.chosenPlan === 'Abonnement mensuel sans engagement' && user.isDirect,
          )
          ?.sort((a, b) => (a.joinDate > b.joinDate ? -1 : 1));
        const studentMonthlySub = action.payload
          ?.filter(
            (user) =>
              user.chosenPlan === 'Abonnement annuel uniquement pour les étudiants' &&
              user.isDirect,
          )
          ?.sort((a, b) => (a.joinDate > b.joinDate ? -1 : 1));
        const noSub = action.payload
          ?.filter((user) => !user.chosenPlan && user.isDirect)
          ?.sort((a, b) => (a.joinDate > b.joinDate ? -1 : 1));
        const fullList = [...yearlySub, ...monthlySub, ...studentMonthlySub, ...noSub];
        writeToStorage('affiliationAffiliates', fullList);
        draft.affiliates = fullList;
        break;
      case SET_RANKINGS:
        const rankingTypeIndex = action.payload.type;
        const rankings = [...state.rankings];
        rankings[rankingTypeIndex] = action.payload.list;
        draft.rankings = rankings;
        writeToStorage('affiliationRankings', rankings);
        break;
      case SET_COUPONS:
        draft.coupons = action.payload;
        break;
      case LOGOUT:
        draft.link = null;
        draft.totalEarnings = null;
        draft.affiliates = null;
        draft.currentMonthEarnings = null;
        draft.currentWeekEarnings = null;
        draft.selectedPeriodEarnings = null;
        writeToStorage('affiliationLink', null);
        writeToStorage('affiliationEarnings', null);
        writeToStorage('affiliationCurrentMonthEarnings', null);
        writeToStorage('affiliationCurrentWeekEarnings', null);
        writeToStorage('affiliationAffiliates', null);
    }
  });

export default affiliationReducer;

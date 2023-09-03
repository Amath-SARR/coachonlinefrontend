/*
 *
 * Affiliation actions
 *
 */

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
  SET_AFFILIATES,
  SET_COACH_LINK,
  SET_COUPONS,
  SET_EARNINGS,
  SET_EARNINGS_PERIOD,
  SET_LINK,
  SET_LINK_OPTIONS,
  SET_PERIODIC_EARNINGS,
  SET_RANKINGS,
  WITHDRAW_AFFILIATION_EARNINGS,
} from './constants';

export function generateLinkAction(data) {
  return {
    type: GENERATE_LINK,
    payload: data,
  };
}
export function generateCoachLinkAction(data) {
  return {
    type: GENERATE_COACH_LINK,
    payload: data,
  };
}
export function getLinkAction(data) {
  return {
    type: GET_LINK,
    payload: data,
  };
}
export function setLinkAction(data) {
  return {
    type: SET_LINK,
    payload: data,
  };
}
export function getLinkOptionsAction(data) {
  return {
    type: GET_LINK_OPTIONS,
    payload: data,
  };
}
export function setLinkOptionsAction(data) {
  return {
    type: SET_LINK_OPTIONS,
    payload: data,
  };
}
export function getCoachLinkAction(data) {
  return {
    type: GET_COACH_LINK,
    payload: data,
  };
}
export function setCoachLinkAction(data) {
  return {
    type: SET_COACH_LINK,
    payload: data,
  };
}
export function changeLinkAction(data) {
  return {
    type: CHANGE_LINK,
    payload: data,
  };
}
export function changeLinkOptionsAction(data) {
  return {
    type: CHANGE_LINK_OPTIONS,
    payload: data,
  };
}
export function changeCoachLinkAction(data) {
  return {
    type: CHANGE_COACH_LINK,
    payload: data,
  };
}
export function getEarningsAction() {
  return {
    type: GET_EARNINGS,
  };
}
export function setEarningsAction(data) {
  return {
    type: SET_EARNINGS,
    payload: data,
  };
}
export function getPeriodicEarningsAction(data) {
  return {
    type: GET_PERIODIC_EARNINGS,
    payload: data,
  };
}
export function setPeriodicEarningsAction(data) {
  return {
    type: SET_PERIODIC_EARNINGS,
    payload: data,
  };
}
export function getEarningsForPeriodAction(data) {
  return {
    type: GET_EARNINGS_PERIOD,
    payload: data,
  };
}
export function setEarningsForPeriodAction(data) {
  return {
    type: SET_EARNINGS_PERIOD,
    payload: data,
  };
}
export function getAffiliatesAction(data) {
  return {
    type: GET_AFFILIATES,
    payload: data,
  };
}
export function setAffiliatesAction(data) {
  return {
    type: SET_AFFILIATES,
    payload: data,
  };
}

export function withdrawAffiliationEarningsAction(data) {
  return {
    type: WITHDRAW_AFFILIATION_EARNINGS,
    payload: data,
  };
}
export function getRankingsAction(data) {
  return {
    type: GET_RANKINGS,
    payload: data,
  };
}
export function setRankingsAction(data) {
  return {
    type: SET_RANKINGS,
    payload: data,
  };
}

export function getCouponsAction(data) {
  return {
    type: GET_COUPONS,
    payload: data,
  };
}
export function setCouponsAction(data) {
  return {
    type: SET_COUPONS,
    payload: data,
  };
}
export function getAffiliatesFileAction(data) {
  return {
    type: GET_AFFILIATES_FILE,
    payload: data,
  };
}
export function getPayoutsAction(data) {
  return {
    type: GET_PAYOUTS,
    payload: data,
  };
}

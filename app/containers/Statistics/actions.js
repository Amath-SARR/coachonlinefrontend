/*
 *
 * Statistics actions
 *
 */

import {
  GET_COACH_RANKINGS,
  GET_MONTH_BALANCE,
  GET_MONTH_MINUTES,
  GET_MONTH_STATISTICS, SET_COACH_RANKINGS, SET_MONTH_BALANCE,
  SET_MONTH_MINUTES,
  SET_MONTH_STATISTICS
} from './constants';

export function getMonthStatisticsAction({month, year}) {
  return {
    type: GET_MONTH_STATISTICS,
    payload: {month, year},
  };
}
export function setMonthStatisticsAction(data) {
  return {
    type: SET_MONTH_STATISTICS,
    payload: data,
  };
}
export function getMonthMinutesAction({month, year}) {
  return {
    type: GET_MONTH_MINUTES,
    payload: {month, year},
  };
}
export function setMonthMinutesAction(data) {
  return {
    type: SET_MONTH_MINUTES,
    payload: data,
  };
}
export function getMonthBalanceAction({month, year}) {
  return {
    type: GET_MONTH_BALANCE,
    payload: {month, year},
  };
}
export function setMonthBalanceAction(data) {
  return {
    type: SET_MONTH_BALANCE,
    payload: data,
  };
}
export function getCoachRankingsAction({month, year}) {
  return {
    type: GET_COACH_RANKINGS,
    payload: {month, year},
  };
}
export function setCoachRankingsAction(data) {
  return {
    type: SET_COACH_RANKINGS,
    payload: data,
  };
}

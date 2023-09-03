/*
 *
 * Libraries actions
 *
 */

import {
  GetInstitutionActionData,
  GetLibraryConnectionStatisticsActionData,
  GetLibraryStatisticsActionData,
  GetProfessionsActionData,
  LogInActionData,
  LogInSuccessActionData,
  RegisterForInstitutionActionData,
  SetInstitutionActionData,
  UpdateLibraryActionData,
} from './actions.types';
import {
  GENERATE_XLSX,
  GET_CONNECTION_STATISTICS,
  GET_INSTITUTION_DATA,
  GET_PROFESSIONS,
  GET_STATISTICS,
  GET_STATISTICS_CHART,
  LOG_IN,
  LOG_IN_SUCCESS,
  REGISTER_FOR_INSTITUTION,
  SET_CONNECTION_STATISTICS,
  SET_INSTITUTION_DATA,
  SET_PROFESSIONS,
  SET_STATISTICS,
  SET_STATISTICS_CHART,
  SET_STATISTICS_RANGE,
  UPDATE_PROFILE_DATA,
} from './constants';
import { GetProfileActionData, SetProfileActionData } from './actions.types';
import { GET_PROFILE_DATA, SET_PROFILE_DATA } from './constants';
import { InstitutionProfession, LibraryStatistics } from './reducer.types';

export function logInAction(data: LogInActionData) {
  return {
    type: LOG_IN,
    payload: data,
  };
}
export function logInSuccessAction(data: LogInSuccessActionData) {
  return {
    type: LOG_IN_SUCCESS,
    payload: data,
  };
}
export function getProfileAction(data: GetProfileActionData) {
  return {
    type: GET_PROFILE_DATA,
    payload: data,
  };
}
export function setProfileAction(data: SetProfileActionData) {
  return {
    type: SET_PROFILE_DATA,
    payload: data,
  };
}
export function updateProfileAction(data: UpdateLibraryActionData) {
  return {
    type: UPDATE_PROFILE_DATA,
    payload: data,
  };
}
export function registerForInstitutionAction(data: RegisterForInstitutionActionData) {
  return {
    type: REGISTER_FOR_INSTITUTION,
    payload: data,
  };
}
export function getProfessionsAction(data?: GetProfessionsActionData) {
  return {
    type: GET_PROFESSIONS,
    payload: data,
  };
}
export function setProfessionsAction(data: InstitutionProfession[]) {
  return {
    type: SET_PROFESSIONS,
    payload: data,
  };
}
export function getInstitutionAction(data: GetInstitutionActionData) {
  return {
    type: GET_INSTITUTION_DATA,
    payload: data,
  };
}
export function setInstitutionAction(data: SetInstitutionActionData) {
  return {
    type: SET_INSTITUTION_DATA,
    payload: data,
  };
}
export function getLibraryStatisticsAction(data: GetLibraryStatisticsActionData) {
  return {
    type: GET_STATISTICS,
    payload: data,
  };
}
export function getLibraryConnectionStatisticsAction(
  data: GetLibraryConnectionStatisticsActionData,
) {
  return {
    type: GET_CONNECTION_STATISTICS,
    payload: data,
  };
}
export function setLibraryConnectionStatisticsAction(
  data: GetLibraryConnectionStatisticsActionData,
) {
  return {
    type: SET_CONNECTION_STATISTICS,
    payload: data,
  };
}
export function generateXLSXAction(data: GetLibraryConnectionStatisticsActionData) {
  return {
    type: GENERATE_XLSX,
    payload: data,
  };
}
export function setLibraryStatisticsAction(data: LibraryStatistics) {
  return {
    type: SET_STATISTICS,
    payload: data,
  };
}
export function getLibraryStatisticsChartAction(data: GetLibraryStatisticsActionData) {
  return {
    type: GET_STATISTICS_CHART,
    payload: data,
  };
}
export function setLibraryStatisticsChartAction(data: LibraryStatistics) {
  return {
    type: SET_STATISTICS_CHART,
    payload: data,
  };
}
export function setLibraryStatisticsRangeAction(data: LibraryStatistics) {
  return {
    type: SET_STATISTICS_RANGE,
    payload: data,
  };
}

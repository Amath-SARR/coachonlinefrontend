/*
 *
 * Libraries reducer
 *
 */
import produce from 'immer';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import {
  LOG_IN_SUCCESS,
  SET_INSTITUTION_DATA,
  SET_PROFESSIONS,
  SET_PROFILE_DATA,
  SET_STATISTICS,
  SET_STATISTICS_CHART,
  SET_STATISTICS_RANGE,
} from './constants';
import { LOGOUT } from '../Auth/constants';

export const initialState = {
  libraryAuthToken: readFromStorage('libraryAuthToken') || null,
  accountData: readFromStorage('libraryAccountData') || null,
  profileData: readFromStorage('libraryProfileData') || null,
  professions: readFromStorage('libraryProfessions') || null,
  institutionData: readFromStorage('libraryInstitutionData') || null,
  statistics: readFromStorage('libraryStatistics') || null,
  statisticsChart: readFromStorage('libraryStatisticsChart') || null,
  statisticsRange: null,
};

/* eslint-disable default-case, no-param-reassign */
const librariesReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_SUCCESS:
        draft.accountData = action.payload;
        draft.libraryAuthToken = action.payload.authToken;
        writeToStorage('libraryAccountData', action.payload);
        writeToStorage('libraryAuthToken', action.payload.authToken);
        break;
      case SET_PROFILE_DATA:
        draft.profileData = action.payload;
        writeToStorage('libraryProfileData', action.payload);
        break;
      case SET_PROFESSIONS:
        draft.professions = action.payload;
        writeToStorage('libraryProfessions', action.payload);
        break;
      case SET_INSTITUTION_DATA:
        draft.institutionData = action.payload;
        writeToStorage('libraryInstitutionData', action.payload);
        break;
      case SET_STATISTICS:
        draft.statistics = action.payload;
        writeToStorage('libraryStatistics', action.payload);
        break;
      case SET_STATISTICS_CHART:
        draft.statisticsChart = action.payload;
        writeToStorage('libraryStatisticsChart', action.payload);
        break;
      case SET_STATISTICS_RANGE:
        draft.statisticsRange = action.payload;
        break;
      case LOGOUT:
        draft.accountData = null;
        draft.libraryAuthToken = null;
        draft.profileData = null;
        draft.institutionData = null;
        draft.statistics = null;
        draft.statisticsRange = null;
        writeToStorage('libraryStatistics', null);
        writeToStorage('libraryInstitutionData', null);
        writeToStorage('libraryProfileData', null);
        writeToStorage('libraryAccountData', null);
        writeToStorage('libraryAuthToken', null);
    }
  });

export default librariesReducer;

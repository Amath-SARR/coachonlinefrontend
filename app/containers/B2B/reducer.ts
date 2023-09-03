/*
 *
 * B2B reducer
 *
 */
import produce from 'immer';
import { LOG_IN_SUCCESS, SET_LIBRARIES, SET_PROFILE_DATA } from './constants';
import { B2BState } from './reducer.types';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import { LOGOUT } from '../Auth/constants';

export const initialState: B2BState = {
  b2bAuthToken: readFromStorage('B2BAuthToken') || null,
  accountData: readFromStorage('B2BAccountData') || null,
  profileData: readFromStorage('B2BProfileData') || null,
  libraries: readFromStorage('B2BLibraries') || null,
};

/* eslint-disable default-case, no-param-reassign */
const b2BReducer = (state = initialState, action: { type: string; payload: any }) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_SUCCESS:
        draft.accountData = action.payload;
        draft.b2bAuthToken = action.payload.authToken;
        writeToStorage('B2BAccountData', action.payload);
        writeToStorage('B2BAuthToken', action.payload.authToken);
        break;
      case SET_PROFILE_DATA:
        draft.profileData = action.payload;
        writeToStorage('B2BProfileData', action.payload);
        break;
      case SET_LIBRARIES:
        draft.libraries = action.payload;
        writeToStorage('B2BLibraries', action.payload);
        break;
      case LOGOUT:
        draft.accountData = null;
        draft.b2bAuthToken = null;
        draft.profileData = null;
        writeToStorage('B2BAccountData', null);
        writeToStorage('B2BAuthToken', null);
        writeToStorage('B2BProfileData', null);

        break;
    }
  });

export default b2BReducer;

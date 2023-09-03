/*
 *
 * B2B actions
 *
 */

import {
  CANCEL_LIBRARY_SUBSCRIPTION,
  CHANGE_LIBRARY_LINK,
  CHANGE_LIBRARY_SUBSCRIPTION,
  CREATE_LIBRARY,
  GENERATE_LIBRARY_LINK,
  GET_LIBRARIES,
  GET_LIBRARY,
  GET_PROFILE_DATA,
  LOG_IN,
  LOG_IN_SUCCESS,
  SET_LIBRARIES,
  SET_LIBRARY,
  SET_PROFILE_DATA,
  UPDATE_PROFILE_DATA,
} from './constants';
import {
  CancelLibrarySubscriptionActionData,
  ChangeLibraryLinkActionData,
  ChangeLibrarySubscriptionActionData,
  CreateLibraryActionData,
  GetLibrariesActionData,
  GetLibraryByIdActionData,
  GetProfileActionData,
  LogInActionData,
  LogInSuccessActionData,
  SetLibraryActionData,
  SetProfileActionData,
  UpdateB2BActionData,
} from './actions.types';
import { B2BLibrary } from './reducer.types';

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
export function updateProfileAction(data: UpdateB2BActionData) {
  return {
    type: UPDATE_PROFILE_DATA,
    payload: data,
  };
}
export function getLibrariesAction(data: GetLibrariesActionData) {
  return {
    type: GET_LIBRARIES,
    payload: data,
  };
}
export function setLibrariesAction(data: B2BLibrary[]) {
  return {
    type: SET_LIBRARIES,
    payload: data,
  };
}
export function getLibraryAction(data: GetLibraryByIdActionData) {
  return {
    type: GET_LIBRARY,
    payload: data,
  };
}
export function setLibraryAction(data: SetLibraryActionData | null) {
  return {
    type: SET_LIBRARY,
    payload: data,
  };
}
export function createLibraryAction(data: CreateLibraryActionData) {
  return {
    type: CREATE_LIBRARY,
    payload: data,
  };
}
export function changeLibrarySubscriptionAction(data: ChangeLibrarySubscriptionActionData) {
  return {
    type: CHANGE_LIBRARY_SUBSCRIPTION,
    payload: data,
  };
}
export function cancelLibrarySubscriptionAction(data: CancelLibrarySubscriptionActionData) {
  return {
    type: CANCEL_LIBRARY_SUBSCRIPTION,
    payload: data,
  };
}
export function changeLibraryLinkAction(data: ChangeLibraryLinkActionData) {
  return {
    type: GENERATE_LIBRARY_LINK,
    payload: data,
  };
}

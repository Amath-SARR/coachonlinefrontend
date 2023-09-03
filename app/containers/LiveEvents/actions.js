/*
 *
 * LiveEvents actions
 *
 */

import {
  CREATE_LIVE_EVENT,
  GET_CREATED_EVENTS,
  GET_CREATED_LIVE_EVENT,
  PUBLISH_LIVE_EVENT,
  SET_CREATED_EVENTS,
  SET_CREATED_LIVE_EVENT,
  SET_CURRENT_TAB,
  SET_EVENT_ID,
  UPDATE_LIVE_EVENT,
} from './constants';

export function setCurrentTabAction(index) {
  return {
    type: SET_CURRENT_TAB,
    payload: index,
  };
}
export function getCreatedLiveEventsAction() {
  return {
    type: GET_CREATED_EVENTS,
  };
}
export function setCreatedLiveEventsAction(data) {
  return {
    type: SET_CREATED_EVENTS,
    payload: data,
  };
}
export function createLiveEventAction(location) {
  return {
    type: CREATE_LIVE_EVENT,
    payload: location,
  };
}
export function getCreatedLiveEventAction({ id, location, onSuccess }) {
  return {
    type: GET_CREATED_LIVE_EVENT,
    payload: { id, location, onSuccess },
  };
}
export function setCreatedLiveEventAction(data) {
  return {
    type: SET_CREATED_LIVE_EVENT,
    payload: data,
  };
}
export function updateCreatedLiveEventAction(data) {
  return {
    type: UPDATE_LIVE_EVENT,
    payload: data,
  };
}
export function publishLiveEventAction(data) {
  return {
    type: PUBLISH_LIVE_EVENT,
    payload: data,
  };
}

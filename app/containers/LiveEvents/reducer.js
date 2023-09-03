/*
 *
 * LiveEvents reducer
 *
 */
import produce from 'immer';
import {
  SET_CREATED_EVENTS,
  SET_CREATED_LIVE_EVENT,
  SET_CURRENT_TAB,
} from './constants';
import { readFromStorage, writeToStorage } from '../../utils/storage';

export const initialState = {
  currentTab: readFromStorage('currentTab') || 0,
  createdLiveEvents: readFromStorage('createdLiveEvents') || [],
  selectedEvent: null,
  /**
   * attachments: []
   categories: []
   coach: {id: 17, emailAddress: "bohdan+coach@itsharkz.com", firstName: "Jan Kołcz", surname: "Dzban",…}
   coachId: 17
   coverPictrueUrl: "images/"
   currency: null
   description: null
   endDate: "0001-01-01T00:00:00"
   eventId: 3
   eventParticipants: []
   name: null
   participantAssigned: 0
   personQty: 0
   price: 0
   startDate: "0001-01-01T00:00:00"
   status: 0
   */
};

/* eslint-disable default-case, no-param-reassign */
const liveEventsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_CURRENT_TAB:
        draft.currentTab = action.payload;
        writeToStorage('currentTab', action.payload);
        break;
      case SET_CREATED_EVENTS:
        draft.createdLiveEvents = action.payload;
        writeToStorage('createdLiveEvents', action.payload);
        break;
      case SET_CREATED_LIVE_EVENT:
        draft.selectedEvent = action.payload;
        break;
    }
  });

export default liveEventsReducer;

/*
 *
 * CoursePage reducer
 *
 */
import produce from 'immer';
import { toast } from 'react-toastify';
import { DEFAULT_ACTION, SET_EPISODE_ERROR, SET_EPISODE } from './constants';

export const initialState = {
  currentEpisode: {
    // attachments: [],
    // courseId: 2
    // created: 1619816841
    // description: "Episode description"
    // id: 4
    // mediaId: "a269c9d670af4b5c8ac3186f1d1ed04b.mp4"
    // ordinalNumber: 1
    // title: "Titre Épisode
  },
  episodeError: null,
};

/* eslint-disable default-case, no-param-reassign */
const coursePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_EPISODE:
        console.log(action.payload);
        draft.currentEpisode = action.payload;
        break;
      case SET_EPISODE_ERROR:
        console.log('EPISODE ERROR', action.payload);
        draft.episodeError = action.payload;
    }
  });

export default coursePageReducer;

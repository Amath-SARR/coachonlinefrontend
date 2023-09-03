import { createSlice } from '@reduxjs/toolkit';
import isSagaAction from '../../utils/isSagaAction';

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

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    getEpisode() {},
    setEpisode(state, action) {
      console.log('Reducer', state, action);
      if (isSagaAction(action)) {
        state.currentEpisode = action.payload;
      }
    },
    setEpisodeError(state, action) {
      state.episodeError = action.payload;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer: courseReducer } = courseSlice;
// Extract and export each action creator by name
export const { getEpisode, setEpisode, setEpisodeError } = actions;
// Export the reducer, either as a default or named export
export default courseReducer;

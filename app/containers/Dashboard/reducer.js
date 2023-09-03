/*
 *
 * Dashboard reducer
 *
 */
import produce from 'immer';
import {
  ADD_ATTACHMENT_TO_EPISODE_SUCCESS,
  ADD_EPISODE_SUCCESS,
  EDIT_EPISODES,
  FETCH_COURSE_TO_EDIT,
  GET_CATEGORIES_SUCCESS,
  GET_CURRENT_COURSES_SUCCESS,
  REMOVE_ATTACHMENT_FROM_EPISODE_SUCCESS,
  REMOVE_COURSE_SUCCESS,
  REMOVE_EPISODE_SUCCESS,
  SAVE_COURSE_SUCCESS,
  SET_EPISODE,
  SET_LAST_ADDED_EPISODE_ID,
  UPLOAD_COURSE_PHOTO_SUCCESS,
  UPLOAD_COURSE_PHOTO,
  SET_COURSE,
  SET_PROMO_EPISODES,
  EDIT_PROMO_EPISODES,
} from './constants';
// import { DEFAULT_ACTION } from './constants';

export const initialState = {
  currentCourses: [],
  currentCourseId: '',
  promoEpisodes: [],
  episodes: [],
  courseData: {},
  categories: [],
  loading: false,
  lastAddedEpisodeId: 0,
  authorizedEpisodes: {
    // [id]: {
    //   // attachments: [],
    //   // courseId: 2
    //   // created: 1619816841
    //   // description: "Episode description"
    //   // id: 4
    //   // mediaId: "a269c9d670af4b5c8ac3186f1d1ed04b.mp4"
    //   // ordinalNumber: 1
    //   // title: "Titre Épisode
    // }
  },
};

/* eslint-disable default-case, no-param-reassign */
const dashboardReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_CURRENT_COURSES_SUCCESS:
        draft.currentCourses = action.payload || [];
        break;
      case SAVE_COURSE_SUCCESS:
        draft.currentCourseId = action.payload.courseId;
        break;
      case ADD_EPISODE_SUCCESS:
        draft.episodes.push({
          id: action.payload.episodeId,
          name: `Episode ${action.payload.episodeId}`,
          description: '',
          attachments: [],
        });
        draft.lastAddedEpisodeId = action.payload.episodeId;
        break;
      case SET_PROMO_EPISODES:
        draft.promoEpisodes.push({
          id: action.payload.episodeId,
          name: `Episode ${action.payload.episodeId}`,
          description: '',
          attachments: [],
        });
        draft.lastAddedEpisodeId = action.payload.episodeId;
        break;
      case SET_LAST_ADDED_EPISODE_ID:
        draft.lastAddedEpisodeId = action.payload.episodeId;
        break;
      case EDIT_EPISODES:
        draft.episodes = action.payload;
        break;
      case EDIT_PROMO_EPISODES:
        draft.promoEpisodes = action.payload;
        break;
      case FETCH_COURSE_TO_EDIT:
        draft.currentCourseId = action.payload.id;
        draft.courseData = action.payload || {};
        draft.episodes =
          action.payload.episodes
            ?.filter(ep => !ep.isPromo)
            ?.sort((a, b) => a.ordinalNumber - b.ordinalNumber) || [];
        draft.promoEpisodes =
          action.payload.episodes?.filter(ep => ep.isPromo) || [];
        break;
      case SET_COURSE:
        draft.currentCourseId = action.payload.id;
        draft.courseData = action.payload || {};
        draft.episodes =
          action.payload.episodes
            ?.filter(ep => !ep.isPromo)
            ?.sort((a, b) => a.ordinalNumber - b.ordinalNumber) || [];
        draft.promoEpisodes =
          action.payload.episodes?.filter(ep => ep.isPromo) || [];
        break;
      case UPLOAD_COURSE_PHOTO:
        draft.loading = true;
        break;
      case UPLOAD_COURSE_PHOTO_SUCCESS:
        draft.loading = false;
        draft.courseData.photoUrl = action.payload.photoPath;
        break;
      case ADD_ATTACHMENT_TO_EPISODE_SUCCESS:
        draft.episodes.forEach(episode => {
          if (episode.id === action.payload.episodeId) {
            episode.attachments = action.payload.attachments.attachments;
          }
        });
        break;
      case REMOVE_ATTACHMENT_FROM_EPISODE_SUCCESS:
        draft.episodes.forEach(episode => {
          if (episode.id === action.payload.episodeId) {
            episode.attachments.forEach((attachment, index) => {
              if (attachment.id === action.payload.attachmentId) {
                episode.attachments.splice(index, 1);
              }
            });
          }
        });
        break;
      case REMOVE_EPISODE_SUCCESS:
        draft.episodes = draft.episodes
          .filter(ep => ep.id !== action.payload.episodeId)
          ?.sort((a, b) => a.ordinalNumber - b.ordinalNumber);
        draft.promoEpisodes = draft.promoEpisodes.filter(
          ep => ep.id !== action.payload.episodeId,
        );
        break;
      case REMOVE_COURSE_SUCCESS:
        draft.currentCourseId = '';
        draft.episodes = [];
        draft.courseData = {};
        break;
      case GET_CATEGORIES_SUCCESS:
        draft.categories = action.payload.items || [];
        break;
      case SET_EPISODE:
        console.log(action.payload);
        if (action.payload?.id) {
          delete state.authorizedEpisodes[(action.payload?.id)];
          draft.authorizedEpisodes = {
            ...state.authorizedEpisodes,
            [action.payload?.id]: action.payload,
          };
        }
        break;
    }
  });

export default dashboardReducer;

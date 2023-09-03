/*
 *
 * HomePage reducer
 *
 */
import produce from 'immer';
import { toast } from 'react-toastify';
import {
  SEARCH_ERROR,
  SEARCH_SUCCESS,
  SET_HOME_PAGE_STATE,
  SET_HOME_PAGE_FILTER,
  SET_SELECTED_COURSE,
  SHOW_ERROR,
  SET_LOADING,
  SET_SELECTED_COACH,
  SET_CAROUSEL_COURSES,
  SET_WATCHED_COURSES,
  SET_COURSE_WATCHED_EPISODES,
  SET_SELECTED_CATEGORY,
  SET_SUGGESTED_COURSES,
  SET_PLATFORM_STATISTICS,
  SET_LAST_ADDED_COURSES,
  SET_LOADING_OVERLAY,
  SET_NUMBER_OF_LIKES,
  SET_TRENDING_COURSES,
  SET_EXEMPLE_COURSES,
  SET_SELECTED_COACH_DOCUMENT,
  SET_SELECTED_COURSE_INFO
} from './constants';
import { readFromStorage, writeToStorage } from '../../utils/storage';

export const initialState = {
  layoutState: 'default',
  filterValue: '',
  selectedCategory: {},
  selectedCourse: {},
  selectedCourseInfos: {},
  selectedCoach: {},
  selectedCoachDocuments: {},
  courses: [],
  coaches: [],
  categories: [],
  isLoading: false,
  loadingOverlayShown: false,
  carouselCourses: readFromStorage('carouselCourses') || [],
  suggestedCourses: readFromStorage('suggestedCourses') || [],
  trendingCourses: readFromStorage('trendingCourses') || [],
  lastAddedCourses: readFromStorage('lastAddedCourses') || [],
  watchedCourses: [],
  watchedEpisodes: null,
  platformStatistics: readFromStorage('platformStatistics') || null,
  exempleCourses: [],
};

/* eslint-disable default-case, no-param-reassign */
const homePageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_HOME_PAGE_FILTER:
        draft.filterValue = action.payload;
        break;
      case SET_HOME_PAGE_STATE:
        draft.layoutState = action.payload;
        break;
      case SET_SELECTED_CATEGORY:
        draft.selectedCategory = action.payload;
        break;
      case SET_SELECTED_COURSE:
        draft.selectedCourse = action.payload;
        draft.selectedCourse.episodes = [
          ...(action.payload?.episodes?.filter((ep) => ep.isPromo) || []),
          ...(action.payload?.episodes
            ?.filter((ep) => !ep.isPromo)
            ?.sort((a, b) => a.ordinalNumber - b.ordinalNumber) || []),
        ];
        break;
      case SET_NUMBER_OF_LIKES:
        draft.selectedCourse = {
          ...(state.selectedCourse || {}),
          likesCnt: action.payload?.likesCnt || 0,
        };
        break;
      case SET_SELECTED_COACH:
        draft.selectedCoach = action.payload;
        break;
      case SET_SELECTED_COACH_DOCUMENT:
        draft.selectedCoachDocuments = action.payload;
        break;
      case SET_SELECTED_COURSE_INFO:
          draft.selectedCourseInfos = action.payload;
          break;
      case SEARCH_SUCCESS:
        draft.courses = action.payload?.courses || [];
        draft.coaches = action.payload?.coaches || [];
        draft.categories = action.payload?.categories || [];
        break;
      case SET_SUGGESTED_COURSES:
        draft.suggestedCourses = action.payload || [];
        writeToStorage('suggestedCourses', action.payload);
        break;
      case SET_TRENDING_COURSES:
        draft.trendingCourses = action.payload || [];
        writeToStorage('trendingCourses', action.payload);
        break;
      case SET_LAST_ADDED_COURSES:
        draft.lastAddedCourses = action.payload || [];
        writeToStorage('lastAddedCourses', action.payload);
        break;
      case SET_WATCHED_COURSES:
        draft.watchedCourses = action.payload || [];
        break;
      case SET_COURSE_WATCHED_EPISODES:
        draft.watchedEpisodes = action.payload || [];
        break;
      case SET_CAROUSEL_COURSES:
        draft.carouselCourses = action.payload || [];
        writeToStorage('carouselCourses', action.payload);
        break;

      case SET_PLATFORM_STATISTICS:
        draft.platformStatistics = action.payload || null;
        writeToStorage('platformStatistics', action.payload);
        break;

      case SHOW_ERROR:
        console.log('ERROR', action.payload);
        if (action.payload?.response?.errors) {
          let errStr = '';
          Object.keys(action.payload.response.errors)?.forEach((key) => {
            action.payload.response.errors[key]?.forEach((err) => (errStr += `${errStr} ${err}`));
          });
          return toast.error(errStr);
        }
        if (action.payload?.message !== 'Unauthorized' && !action.hideError) {
          toast.error(
            action.payload?.response?.Error ||
              action.payload?.message ||
              action.payload?.Error ||
              'Un problème est survenu',
          );
        }
        break;
      case SET_LOADING:
        draft.isLoading = action.payload;
        writeToStorage('isLoading', action.payload);
        break;
      case SET_LOADING_OVERLAY:
        draft.loadingOverlayShown = action.payload;
        break;
      case SET_EXEMPLE_COURSES:
        draft.exempleCourses = action.payload;
        break;
    }
  });

export default homePageReducer;

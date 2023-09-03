/*
 *
 * HomePage actions
 *
 */

import {
  SEARCH,
  SEARCH_SUCCESS,
  SET_SELECTED_COURSE,
  SET_HOME_PAGE_FILTER,
  SET_HOME_PAGE_STATE,
  GET_COURSE,
  SHOW_ERROR,
  SET_LOADING,
  SET_SELECTED_COACH,
  GET_CAROUSEL_COURSES,
  SET_CAROUSEL_COURSES,
  GET_WATCHED_COURSES,
  SET_WATCHED_COURSES,
  GET_COURSE_WATCHED_EPISODES,
  SET_COURSE_WATCHED_EPISODES,
  SET_SELECTED_CATEGORY,
  GET_SUGGESTED_COURSES,
  SET_SUGGESTED_COURSES,
  GET_COACH,
  GET_PLATFORM_STATISTICS,
  SET_PLATFORM_STATISTICS,
  SEARCH_CATEGORY,
  GET_LAST_ADDED_COURSES,
  SET_LAST_ADDED_COURSES,
  SET_LOADING_OVERLAY,
  RESPONSE_ERROR,
  SET_NUMBER_OF_LIKES,
  SET_TRENDING_COURSES,
  GET_TRENDING_COURSES,
  SET_EXEMPLE_COURSES,
  GET_EXEMPLE_COURSES,
  GET_COACH_DOCUMENT,
  SET_SELECTED_COACH_DOCUMENT,
  GET_COURSE_INFO,
  SET_SELECTED_COURSE_INFO,
} from './constants';

export function setHomePageFilterAction(data) {
  return {
    type: SET_HOME_PAGE_FILTER,
    payload: data,
  };
}
export function setHomePageLayoutStateAction(data) {
  return {
    type: SET_HOME_PAGE_STATE,
    payload: data,
  };
}
export function setSelectedCategoryAction(data) {
  return {
    type: SET_SELECTED_CATEGORY,
    payload: data,
  };
}
export function getCourseAction(id) {
  return {
    type: GET_COURSE,
    payload: id,
  };
}
export function getCoachAction(id) {
  return {
    type: GET_COACH,
    payload: id,
  };
}
export function getCoachDocumentAction(id) {
  return {
    type: GET_COACH_DOCUMENT,
    payload: id,
  };
}
export function getCourseInfoAction(id) {
  return {
    type: GET_COURSE_INFO,
    payload: id,
  };
}
export function setSelectedCourseAction(data) {
  return {
    type: SET_SELECTED_COURSE,
    payload: data,
  };
}
export function setSelectedCoachAction(data) {
  return {
    type: SET_SELECTED_COACH,
    payload: data,
  };
}
export function setSelectedCoachDocumentAction(data) {
  return {
    type: SET_SELECTED_COACH_DOCUMENT,
    payload: data,
  };
}
export function setSelectedCourseInfoAction(data) {
  return {
    type: SET_SELECTED_COURSE_INFO,
    payload: data,
  };
}
export function searchAction(data) {
  return {
    type: SEARCH,
    payload: data,
  };
}
export function searchCategoryAction(data) {
  return {
    type: SEARCH_CATEGORY,
    payload: data,
  };
}
export function searchSuccess(data) {
  return {
    type: SEARCH_SUCCESS,
    payload: data,
  };
}
export function getSuggestedCoursesAction() {
  return {
    type: GET_SUGGESTED_COURSES,
  };
}
export function setSuggestedCoursesAction(data) {
  return {
    type: SET_SUGGESTED_COURSES,
    payload: data,
  };
}
export function getTrendingCoursesAction(data) {
  return {
    type: GET_TRENDING_COURSES,
    payload: data,
  };
}
export function setTrendingCoursesAction(data) {
  return {
    type: SET_TRENDING_COURSES,
    payload: data,
  };
}
export function getLastAddedCoursesAction() {
  return {
    type: GET_LAST_ADDED_COURSES,
  };
}
export function setLastAddedCoursesAction(data) {
  return {
    type: SET_LAST_ADDED_COURSES,
    payload: data,
  };
}
export function getWatchedCoursesAction() {
  return {
    type: GET_WATCHED_COURSES,
  };
}
export function setWatchedCoursesAction(data) {
  return {
    type: SET_WATCHED_COURSES,
    payload: data,
  };
}

export function getCourseWatchedEpisodesAction(id) {
  return {
    type: GET_COURSE_WATCHED_EPISODES,
    payload: id,
  };
}
export function setCourseWatchedEpisodesAction(data) {
  return {
    type: SET_COURSE_WATCHED_EPISODES,
    payload: data,
  };
}
export function getCarouselCoursesAction(data) {
  return {
    type: GET_CAROUSEL_COURSES,
    payload: data,
  };
}
export function setCarouselCoursesAction(data) {
  return {
    type: SET_CAROUSEL_COURSES,
    payload: data,
  };
}

export function getPlatformStatisticsAction(data) {
  return {
    type: GET_PLATFORM_STATISTICS,
    payload: data,
  };
}
export function setPlatformStatisticsAction(data) {
  return {
    type: SET_PLATFORM_STATISTICS,
    payload: data,
  };
}

export function handleErrorAction(err) {
  return {
    type: RESPONSE_ERROR,
    payload: err,
  };
}

export function showErrorAction(err, args = {}) {
  return {
    type: SHOW_ERROR,
    payload: args.hideError ? '' : err,
    hideError: args.hideError || false,
  };
}

export function setLoadingAction(isLoading) {
  return {
    type: SET_LOADING,
    payload: isLoading,
  };
}
export function setLoadingOverlayAction(isLoading) {
  return {
    type: SET_LOADING_OVERLAY,
    payload: isLoading,
  };
}

export function setNumberOfLikesAction(data) {
  return {
    type: SET_NUMBER_OF_LIKES,
    payload: data,
  };
}

export function getExempleCourses(data) {
  return {
    type: GET_EXEMPLE_COURSES,
    payload: data,
  };
}

export function setExempleCourses(data) {
  return {
    type: SET_EXEMPLE_COURSES,
    payload: data,
  };
}

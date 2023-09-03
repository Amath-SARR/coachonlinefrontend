/*
 *
 * Dashboard actions
 *
 */

import {
  ADD_ATTACHMENT_TO_EPISODE,
  ADD_ATTACHMENT_TO_EPISODE_ERROR,
  ADD_ATTACHMENT_TO_EPISODE_SUCCESS,
  ADD_EPISODE,
  ADD_EPISODE_ERROR,
  ADD_EPISODE_SUCCESS,
  EDIT_EPISODES,
  FETCH_COURSE_TO_EDIT,
  GET_CURRENT_COURSES,
  GET_CURRENT_COURSES_ERROR,
  GET_CURRENT_COURSES_SUCCESS,
  REMOVE_ATTACHMENT_FROM_EPISODE,
  REMOVE_ATTACHMENT_FROM_EPISODE_ERROR,
  REMOVE_ATTACHMENT_FROM_EPISODE_SUCCESS,
  REMOVE_COURSE,
  REMOVE_COURSE_ERROR,
  REMOVE_COURSE_SUCCESS,
  REMOVE_EPISODE,
  REMOVE_EPISODE_ERROR,
  REMOVE_EPISODE_SUCCESS,
  REMOVE_MEDIA_FROM_EPISODE,
  REMOVE_MEDIA_FROM_EPISODE_ERROR,
  REMOVE_MEDIA_FROM_EPISODE_SUCCESS,
  SAVE_COURSE,
  SAVE_COURSE_ERROR,
  SAVE_COURSE_SUCCESS,
  UPLOAD_COURSE_PHOTO,
  UPLOAD_COURSE_PHOTO_ERROR,
  UPLOAD_COURSE_PHOTO_SUCCESS,
  GET_CATEGORIES,
  GET_CATEGORIES_ERROR,
  GET_CATEGORIES_SUCCESS,
  SUBMIT_COURSE,
  SUBMIT_COURSE_SUCCESS,
  SUBMIT_COURSE_ERROR,
  SET_LAST_ADDED_EPISODE_ID,
  GET_EPISODE,
  SET_EPISODE,
  GET_COURSE,
  SET_COURSE,
  ADD_PROMO_EPISODE,
  SET_PROMO_EPISODES,
  EDIT_PROMO_EPISODES,
  SUGGEST_CATEGORY,
} from './constants';

export function getCurrentCoursesAction() {
  return {
    type: GET_CURRENT_COURSES,
  };
}

export function getCurrentCoursesSuccess(data) {
  return {
    type: GET_CURRENT_COURSES_SUCCESS,
    payload: data,
  };
}

export function getCurrentCoursesError() {
  return {
    type: GET_CURRENT_COURSES_ERROR,
  };
}

export function saveCourseAction(data) {
  return {
    type: SAVE_COURSE,
    payload: data,
  };
}

export function saveCourseSuccess(data) {
  return {
    type: SAVE_COURSE_SUCCESS,
    payload: data,
  };
}

export function saveCourseError(data) {
  return {
    type: SAVE_COURSE_ERROR,
    payload: data,
  };
}

export function submitCourseAction(data) {
  return {
    type: SUBMIT_COURSE,
    payload: data,
  };
}

export function submitCourseSuccess(data) {
  return {
    type: SUBMIT_COURSE_SUCCESS,
    payload: data,
  };
}

export function submitCourseError(data) {
  return {
    type: SUBMIT_COURSE_ERROR,
    payload: data,
  };
}

export function addPromoEpisodeAction(data) {
  return {
    type: ADD_PROMO_EPISODE,
    payload: data,
  };
}

export function setPromoEpisodesAction(data) {
  return {
    type: SET_PROMO_EPISODES,
    payload: data,
  };
}

export function editPromoEpisodesAction(data) {
  return {
    type: EDIT_PROMO_EPISODES,
    payload: data,
  };
}

export function addEpisodeAction(data) {
  return {
    type: ADD_EPISODE,
    payload: data,
  };
}

export function addEpisodeSuccess(data) {
  return {
    type: ADD_EPISODE_SUCCESS,
    payload: data,
  };
}

export function addEpisodeError(data) {
  return {
    type: ADD_EPISODE_ERROR,
    payload: data,
  };
}

export function setLastAddedEpisodeIdAction(data) {
  return {
    type: SET_LAST_ADDED_EPISODE_ID,
    payload: data,
  };
}

export function editEpisodesAction(data) {
  return {
    type: EDIT_EPISODES,
    payload: data,
  };
}

export function getCourseAction(data) {
  return {
    type: GET_COURSE,
    payload: data,
  };
}
export function setCourseAction(course) {
  return {
    type: SET_COURSE,
    payload: course,
  };
}
export function fetchCourseToEditAction(course) {
  return {
    type: FETCH_COURSE_TO_EDIT,
    payload: course,
  };
}

export function UploadCoursePhotoAction(data) {
  return {
    type: UPLOAD_COURSE_PHOTO,
    payload: data,
  };
}

export function UploadCoursePhotoSuccess(base64) {
  return {
    type: UPLOAD_COURSE_PHOTO_SUCCESS,
    payload: base64,
  };
}

export function UploadCoursePhotoError(base64) {
  return {
    type: UPLOAD_COURSE_PHOTO_ERROR,
    payload: base64,
  };
}

export function addAttachmentToEpisodeAction(data) {
  return {
    type: ADD_ATTACHMENT_TO_EPISODE,
    payload: data,
  };
}

export function addAttachmentToEpisodeSuccess(data) {
  return {
    type: ADD_ATTACHMENT_TO_EPISODE_SUCCESS,
    payload: data,
  };
}

export function addAttachmentToEpisodeError(data) {
  return {
    type: ADD_ATTACHMENT_TO_EPISODE_ERROR,
    payload: data,
  };
}

export function removeAttachmentFromEpisodeAction(data) {
  return {
    type: REMOVE_ATTACHMENT_FROM_EPISODE,
    payload: data,
  };
}

export function removeAttachmentFromEpisodeSuccess(data) {
  return {
    type: REMOVE_ATTACHMENT_FROM_EPISODE_SUCCESS,
    payload: data,
  };
}

export function removeAttachmentFromEpisodeActionError(data) {
  return {
    type: REMOVE_ATTACHMENT_FROM_EPISODE_ERROR,
    payload: data,
  };
}

export function removeEpisodeAction(data) {
  return {
    type: REMOVE_EPISODE,
    payload: data,
  };
}

export function removeEpisodeSuccess(data) {
  return {
    type: REMOVE_EPISODE_SUCCESS,
    payload: data,
  };
}

export function removeEpisodeError(data) {
  return {
    type: REMOVE_EPISODE_ERROR,
    payload: data,
  };
}

export function removeCourseAction(data) {
  return {
    type: REMOVE_COURSE,
    payload: data,
  };
}

export function removeCourseSuccess(data) {
  return {
    type: REMOVE_COURSE_SUCCESS,
    payload: data,
  };
}

export function removeCourseError(data) {
  return {
    type: REMOVE_COURSE_ERROR,
    payload: data,
  };
}

export function removeMediaFromEpisodeAction(data) {
  return {
    type: REMOVE_MEDIA_FROM_EPISODE,
    payload: data,
  };
}

export function removeMediaFromEpisodeSuccess(data) {
  return {
    type: REMOVE_MEDIA_FROM_EPISODE_SUCCESS,
    payload: data,
  };
}

export function removeMediaFromEpisodeError(data) {
  return {
    type: REMOVE_MEDIA_FROM_EPISODE_ERROR,
    payload: data,
  };
}

export function getCategoriesAction() {
  return {
    type: GET_CATEGORIES,
  };
}

export function getCategoriesSuccess(data) {
  return {
    type: GET_CATEGORIES_SUCCESS,
    payload: data,
  };
}

export function getCategoriesError() {
  return {
    type: GET_CATEGORIES_ERROR,
  };
}
export function suggestCategoryAction(data) {
  return {
    type: SUGGEST_CATEGORY,
    payload: data,
  };
}
export function getEpisodeAction(episodeId) {
  return {
    type: GET_EPISODE,
    payload: episodeId,
  };
}
export function setEpisodeAction(episode) {
  return {
    type: SET_EPISODE,
    payload: episode,
  };
}

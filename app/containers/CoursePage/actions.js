/*
 *
 * CoursePage actions
 *
 */

import {
  GET_EPISODE,
  SET_EPISODE_ERROR,
  SET_EPISODE,
  TOGGLE_LIKE,
  CREATE_COMMENT,
  GET_COMMENTS,
  REPLY_TO_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
} from './constants';

export function getEpisodeAction(data) {
  return {
    type: GET_EPISODE,
    payload: data,
  };
}
export function setEpisodeAction(episode) {
  return {
    type: SET_EPISODE,
    payload: episode,
  };
}
export function setEpisodeErrorAction(err) {
  return {
    type: SET_EPISODE_ERROR,
    payload: err,
  };
}
export function toggleLikeAction(data) {
  return {
    type: TOGGLE_LIKE,
    payload: data,
  };
}
export function createCommentAction(data) {
  return {
    type: CREATE_COMMENT,
    payload: data,
  };
}
export function getCommentsAction(data) {
  return {
    type: GET_COMMENTS,
    payload: data,
  };
}
export function replyToCommentAction(data) {
  return {
    type: REPLY_TO_COMMENT,
    payload: data,
  };
}
export function editCommentAction(data) {
  return {
    type: EDIT_COMMENT,
    payload: data,
  };
}
export function deleteCommentAction(data) {
  return {
    type: DELETE_COMMENT,
    payload: data,
  };
}

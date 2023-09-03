import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/env';
import request from '../../utils/request';
import {
  ADD_ATTACHMENT_TO_EPISODE,
  ADD_EPISODE,
  ADD_PROMO_EPISODE,
  GET_CATEGORIES,
  GET_COURSE,
  GET_CURRENT_COURSES,
  GET_EPISODE,
  REMOVE_ATTACHMENT_FROM_EPISODE,
  REMOVE_COURSE,
  REMOVE_EPISODE,
  REMOVE_MEDIA_FROM_EPISODE,
  SAVE_COURSE,
  SUBMIT_COURSE,
  SUGGEST_CATEGORY,
  UPLOAD_COURSE_PHOTO,
} from './constants';
import {
  addAttachmentToEpisodeError,
  addAttachmentToEpisodeSuccess,
  addEpisodeError,
  addEpisodeSuccess,
  addPromoEpisodeAction,
  fetchCourseToEditAction,
  getCategoriesError,
  getCategoriesSuccess,
  getCourseAction,
  getCurrentCoursesError,
  getCurrentCoursesSuccess,
  removeAttachmentFromEpisodeActionError,
  removeAttachmentFromEpisodeSuccess,
  removeCourseError,
  removeCourseSuccess,
  removeEpisodeError,
  removeEpisodeSuccess,
  removeMediaFromEpisodeError,
  removeMediaFromEpisodeSuccess,
  saveCourseError,
  saveCourseSuccess,
  setCourseAction,
  setEpisodeAction,
  setPromoEpisodesAction,
  submitCourseAction,
  submitCourseError,
  submitCourseSuccess,
  UploadCoursePhotoError,
  UploadCoursePhotoSuccess,
} from './actions';
import history from '../../utils/history';
import { readFromStorage } from '../../utils/storage';
import { defaultHeaders } from '../../utils/requestWrapper';
import { setLoadingAction, handleErrorAction } from '../HomePage/actions';
import { setEpisodeErrorAction } from '../CoursePage/actions';

export function* getCurrentCoursesSaga() {
  const requestURL = `${API_URL}/Courses/GetCoursesForUser`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
      }),
    });
    yield put(getCurrentCoursesSuccess(response));
    return response;
  } catch (err) {
    yield put(getCurrentCoursesError(err));
  }
}

export function* editEpisodeSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/UpdateEpisodeInCourse`;
  const authToken = readFromStorage('authToken');

  try {
    if (!payload.episode.title || !payload.episode.description) {
      const error = new Error('Complétez le nom et la description de chaque épisode');
      throw error;
    }
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        courseId: payload.courseId,
        episodeId: payload.episode.id,
        title: payload.episode.title,
        description: payload.episode.description,
        ordinalNumber: payload.index,
      }),
    });
    // yield put(addEpisodeSuccess(response))
  } catch (err) {
    yield put(handleErrorAction(err));
    throw err;
  }
}

export function* saveCourseSaga({ payload }) {
  const authToken = readFromStorage('authToken');
  yield put(setLoadingAction(true));

  let requestURL = '';
  let data = {};
  const category = payload.data?.subCategory?.value
    ? payload.data?.subCategory?.value
    : payload.data?.category?.value;
  if (payload.currentCourseId) {
    requestURL = `${API_URL}/Courses/UpdateCourse`;
    data = JSON.stringify({
      authToken,
      courseId: payload.currentCourseId,
      name: payload.data.name || 'Draft',
      category,
      description: payload.data.description || 'Draft description',
      photoUrl: payload.data.photoUrl || '',
      certificationQCM: payload.data.certificationQCM || '',
      prerequisite: payload.data.prerequisite || '',
      publicTargets: payload.data.publicTargets || '',
      objectives: payload.data.objectives || '',
    });
  } else {
    requestURL = `${API_URL}/Courses/CreateCourse`;
    data = JSON.stringify({
      authToken,
      name: payload.data.name || 'Draft',
      category,
      description: payload.data.description || 'Draft description',
      photoUrl: payload.photoUrl || '',
    });
  }

  try {
    if (payload.currentCourseId) {
      const episodes = [...payload.episodes];
      for (let i = 0; i < payload.episodes.length; i++) {
        yield editEpisodeSaga({
          payload: {
            episode: episodes[i],
            courseId: payload.currentCourseId,
            index: i,
          },
        });
      }
    }

    const response = yield call(request, requestURL, {
      method: 'POST',
      body: data,
    });
    if (payload.currentCourseId) {
      yield put(getCourseAction({ courseId: payload.currentCourseId }));
      typeof payload?.onFinish === 'function' && payload.onFinish();
      return toast.success('Les modifications ont été enregistrées correctement');
    }
    yield put(saveCourseSuccess(response));
    const courses = yield getCurrentCoursesSaga();
    yield put(
      fetchCourseToEditAction(courses.filter((course) => course?.id === response.courseId)?.[0]),
    );
    history.push(`/addCourse/${response.courseId}`);
  } catch (err) {
    yield put(handleErrorAction(err));
  } finally {
    yield put(setLoadingAction(false));
  }
}

export function* getCourseSaga({ payload }) {
  const { courseId, redirectTo } = payload;
  const requestURL = `${API_URL}/Info/Course/${courseId}`;
  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    yield put(setCourseAction(response));
    history.push(redirectTo || `/addCourse/${response?.id}`);
  } catch (err) {
    yield put(handleErrorAction(err));
    history.push('/');
  }
}

export function* submitCourseSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/SubmitToVerification`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        courseId: payload.courseId,
      }),
    });
    yield put(submitCourseSuccess(response));
    yield getCurrentCoursesSaga();
    history.replace('/dashboard');
  } catch (err) {
    yield put(submitCourseError(err));
    yield put(handleErrorAction(err));
  }
}

export function* addPromoEpisodeSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/AddPromoEpisodeToCourse`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        courseId: payload.courseId,
        title: payload.title,
        description: payload.description,
      }),
    });
    yield put(setPromoEpisodesAction(response));
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* addEpisodeSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/AddEpisodeToCourse`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        courseId: payload.courseId,
        title: payload.title,
        description: payload.description,
      }),
    });
    yield put(addEpisodeSuccess(response));
  } catch (err) {
    yield put(addEpisodeError(err));
  }
}

export function* uploadCoursePhotoSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/UploadPhoto`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        base64Photo: payload?.base64,
      }),
    });
    yield put(UploadCoursePhotoSuccess(response));
    payload?.onSuccess && payload.onSuccess(response);
  } catch (err) {
    yield put(UploadCoursePhotoError(err));
  } finally {
    payload?.onFinish && payload.onFinish();
  }
}

export function* addAttachmentToEpisodeSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/AddAttachmentToEpisode`;
  const authToken = readFromStorage('authToken');

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        attachmentName: payload.name,
        attachmentBase64: payload.data,
        courseId: payload.courseId,
        episodeId: payload.episodeId,
        attachmentExtension: payload.extension,
      }),
    });
    yield put(
      addAttachmentToEpisodeSuccess({
        attachments: response,
        episodeId: payload.episodeId,
      }),
    );
  } catch (err) {
    yield put(addAttachmentToEpisodeError(err));
  } finally {
    payload.onFinish && payload.onFinish();
  }
}

export function* removeAttachmentFromEpisodeSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/RemoveAttachmentFromEpisode`;
  const authToken = readFromStorage('authToken');

  try {
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        courseId: payload.courseId,
        episodeId: payload.episodeId,
        attachmentId: payload.attachmentId,
      }),
    });
    yield put(
      removeAttachmentFromEpisodeSuccess({
        attachmentId: payload.attachmentId,
        episodeId: payload.episodeId,
      }),
    );
  } catch (err) {
    yield put(removeAttachmentFromEpisodeActionError(err));
  }
}

export function* removeEpisodeSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/RemoveEpisodeFromCourse`;
  const authToken = readFromStorage('authToken');

  try {
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        courseId: payload.courseId,
        episodeId: payload.episodeId,
      }),
    });
    yield put(removeEpisodeSuccess({ episodeId: payload.episodeId }));
  } catch (err) {
    yield put(removeEpisodeError(err));
  }
}

export function* removeCourseSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/RemoveCourse`;
  const authToken = readFromStorage('authToken');

  try {
    yield put(setLoadingAction(true));
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        courseId: payload.courseId,
      }),
    });
    history.push('/dashboard');
    toast.success('Le cours a été supprimé avec succès');
    yield put(removeCourseSuccess());
  } catch (err) {
    yield put(setLoadingAction(false));
    yield put(removeCourseError(err));
  }
}

export function* removeMediaFromEpisodeSaga({ payload }) {
  const requestURL = `${API_URL}/Courses/RemoveMediaFromEpisode`;
  const authToken = readFromStorage('authToken');

  try {
    yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify({
        authToken,
        courseId: payload.courseId,
        episodeId: payload.episodeId,
      }),
    });
    yield put(removeMediaFromEpisodeSuccess());
    toast.success('Les modifications ont été enregistrées correctement');
  } catch (err) {
    yield put(removeMediaFromEpisodeError(err));
  }
}

// export function* getCategoriesSaga() {
//   const requestURL = `${API_URL}/Courses/GetCategories`;

//   try {
//     const response = yield call(request, requestURL, {
//       method: 'GET',
//     });
//     yield put(getCategoriesSuccess(response));
//   } catch (err) {
//     yield put(getCategoriesError(err));
//   }
// }


export function* getCategoriesSaga() {
  const requestURL = `${API_URL}/Courses/GetCategoriesCompleted`;

  try {
    const response = yield call(request, requestURL, {
      method: 'GET',
    });
    // console.log("Categories completed : ", response);
    yield put(getCategoriesSuccess(response));
  } catch (err) {
    // console.log("Categories completed : ", err);
    yield put(getCategoriesError(err));
  }
}

export function* suggestCategorySaga({ payload }) {
  const requestURL = `${API_URL}/CoachAccount/SuggestNewCategory`;

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    yield put(getCategoriesSuccess(response));
    toast.success(
      "Merci ! Votre suggestion sera examinée par l'administrateur et vous serez informé par e-mail. Une fois accepté revenez sur votre cours pour l'ajouter avec la categorie souhaiter",
    );
  } catch (err) {
    yield put(handleErrorAction(err));
  }
}

export function* openEpisodeSaga({ payload }) {
  const { episodeId, onSuccess, onFetchEnd, onError } = payload;
  try {
    yield put(setEpisodeErrorAction(null));
    yield put(setLoadingAction(true));
    const authToken = readFromStorage('authToken');
    const requestUrl = `${API_URL}/Player/OpenEpisode?episodeId=${episodeId}`;
    if (!authToken) {
      return history.push('/auth/login');
    }
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setEpisodeAction(response));
    onSuccess && onSuccess(response);
  } catch (err) {
    const data = {
      codeString: err?.response?.CodeString || 'Undefined',
      error: err?.response?.Error || 'Sorry... media is not available at the moment',
    };
    yield put(setEpisodeErrorAction(data));
    onError && onError(data);
  } finally {
    yield put(setLoadingAction(false));
    onFetchEnd && onFetchEnd();
  }
}

export default function* dashboardSaga() {
  yield takeLatest(GET_CURRENT_COURSES, getCurrentCoursesSaga);
  yield takeLatest(SAVE_COURSE, saveCourseSaga);
  yield takeLatest(SUBMIT_COURSE, submitCourseSaga);
  yield takeLatest(GET_COURSE, getCourseSaga);
  yield takeLatest(ADD_PROMO_EPISODE, addPromoEpisodeSaga);
  yield takeLatest(ADD_EPISODE, addEpisodeSaga);
  yield takeLatest(UPLOAD_COURSE_PHOTO, uploadCoursePhotoSaga);
  yield takeLatest(ADD_ATTACHMENT_TO_EPISODE, addAttachmentToEpisodeSaga);
  yield takeLatest(REMOVE_ATTACHMENT_FROM_EPISODE, removeAttachmentFromEpisodeSaga);
  yield takeLatest(REMOVE_EPISODE, removeEpisodeSaga);
  yield takeLatest(REMOVE_COURSE, removeCourseSaga);
  yield takeLatest(REMOVE_MEDIA_FROM_EPISODE, removeMediaFromEpisodeSaga);
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(SUGGEST_CATEGORY, suggestCategorySaga);
  yield takeLatest(GET_EPISODE, openEpisodeSaga);
}

// Individual exports for testing
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  GET_CAROUSEL_COURSES,
  GET_COACH,
  GET_COACH_DOCUMENT,
  GET_COURSE,
  GET_COURSE_INFO,
  GET_COURSE_WATCHED_EPISODES,
  GET_LAST_ADDED_COURSES,
  GET_PLATFORM_STATISTICS,
  GET_SUGGESTED_COURSES,
  GET_TRENDING_COURSES,
  GET_WATCHED_COURSES,
  RESPONSE_ERROR,
  SEARCH,
  SEARCH_CATEGORY,
  SHOW_ERROR,
  GET_EXEMPLE_COURSES
} from './constants';
import { API_URL } from '../../config/env';
import request from '../../utils/request';
import {
  searchSuccess,
  setCarouselCoursesAction,
  setCourseWatchedEpisodesAction,
  setLastAddedCoursesAction,
  setNumberOfLikesAction,
  setPlatformStatisticsAction,
  setSelectedCoachAction,
  setSelectedCoachDocumentAction,
  setSelectedCourseInfoAction,
  setSelectedCourseAction,
  setSuggestedCoursesAction,
  setTrendingCoursesAction,
  setWatchedCoursesAction,
  showErrorAction,
  setExempleCourses
} from './actions';
import { readFromStorage } from '../../utils/storage';
import triggerLoadingRequest, { defaultHeaders } from '../../utils/requestWrapper';
import history from '../../utils/history';
import { toast } from 'react-toastify';
import { logoutAction } from '../Auth/actions';

export function* searchSaga(data) {
  const search = data?.payload?.value || '';
  const searchType = data?.payload?.type || '';
  const SEARCH_URL = API_URL;
  const searchURL = `${SEARCH_URL}/Search/Search${searchType}?search=${search}`; // search
  const response = yield call(request, searchURL, {
    method: 'GET',
  });
  yield put(searchSuccess(response));
  return response;
}

export function* getCarouselCoursesSaga() {
  const url = `${API_URL}/Player/GetFlaggedCourses`;
  const response = yield call(request, url, {
    method: 'GET',
  });
  yield put(setCarouselCoursesAction(response));
}
export function* getCoachSaga(data) {
  const coachId = data?.payload;
  const authToken = readFromStorage('authToken');
  const requestUrl = `${API_URL}/Info/Coach/${coachId}`;
  try {
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setSelectedCoachAction(response));
    // history.push(`/course?id=${response?.id}&name=${response?.name}`);
  } catch (err) {
    // history.push(authToken ? '/subscriptionChoice' : '/login');
  }
}

export function* getCoachDocumentSaga(data) {
  const coachId = data?.payload;
  const authToken = readFromStorage('authToken');
  const requestUrl = `${API_URL}/Info/CoachDocument/${coachId}`;
  try {
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    // console.log("laaaaaaaaaaaaaaa" ,response);
    yield put(setSelectedCoachDocumentAction(response));
  } catch (err) {
  }
}

export function* getCourseInfoSaga(data) {
  const coachId = data?.payload;
  const authToken = readFromStorage('authToken');
  const requestUrl = `${API_URL}/Info/CourseInfo/${coachId}`;
  try {
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setSelectedCourseInfoAction(response));
  } catch (err) {
  }
}

export function* getCourseSaga(data) {
  const courseId = data?.payload;
  const authToken = readFromStorage('authToken');
  const requestUrl = `${API_URL}/Player/OpenCourse?courseId=${courseId}`;
  // if (!authToken) {
  //   return history.push('/auth/login');
  // }
  try {
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setSelectedCourseAction(response));
    history.push(`/course?id=${response?.id}&name=${response?.name}`);
  } catch (err) {
    if (err.response?.CodeString === 'SubscriptionNotExist') {
      const userInfo = readFromStorage('userInfo');
      switch (userInfo?.userRole) {
        case 'STUDENT':
          history.push('/subscription/subscriptionChoice');
          break;
        case 'INSTITUTION_STUDENT':
          toast.warn(
            "La limite d'utilisateurs actifs pour votre bibliothèque a été temporairement atteinte. Veuillez essayer plus tard ou acheter un abonnement personnel",
          );
          break;
        case 'COACH':
          toast.warn(
            'Pour pouvoir regarder les cours des autres coachs, vous devez avoir au moins un cours publié !',
          );
          break;
        default:
          toast.warn("Pas d'abonnement actif trouvé");
          break;
      }
    }
  }
}
export function* getSuggestedCourseSaga() {
  try {
    const requestUrl = `${API_URL}/Player/GetSuggestedCourses`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setSuggestedCoursesAction(response));
  } catch (e) {
    // yield put(setWatchedCoursesAction([]));
  }
}
export function* getLastAddedCourseSaga() {
  try {
    const requestUrl = `${API_URL}/Player/GetLastAddedCourses`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setLastAddedCoursesAction(response));
  } catch (e) {
    // yield put(setWatchedCoursesAction([]));
  }
}
export function* getWatchedCourseSaga() {
  const authToken = readFromStorage('authToken');
  const studentData = readFromStorage('studentData');
  if (authToken) {
    try {
      const requestUrl = `${API_URL}/Player/GetLastOpenedCourses`;
      const response = yield call(request, requestUrl, {
        method: 'GET',
      });
      yield put(setWatchedCoursesAction(response));
    } catch (e) {
      yield put(setWatchedCoursesAction([]));
    }
  }
}
export function* getWatchedEpisodesSaga({ payload }) {
  const { courseId, hasSubscription = true } = payload;
  const authToken = readFromStorage('authToken');
  const { userRole } = readFromStorage('userInfo') || {};
  if (authToken && (hasSubscription || userRole === 'COACH')) {
    const requestUrl = `${API_URL}/Player/GetLastOpenedEpisodesInCourse?courseId=${courseId}`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setCourseWatchedEpisodesAction(response));
  } else {
    yield put(setCourseWatchedEpisodesAction([]));
  }
}

export function* getPlatformStatisticsSaga({ payload }) {
  try {
    const requestUrl = `${API_URL}/Search/GetPlatformBasicInfo`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    yield put(setPlatformStatisticsAction(response));
  } catch (e) {
    console.log(e);
  }
}

export function* handleResponseErrorSaga({ payload }) {
  const { response } = payload || {};
  const { Error, code, CodeString } = response || {};
  const errorMessage = (Error || '').toLowerCase();
  const authTokenNotExist =
    errorMessage.includes('auth') &&
    errorMessage.includes('token') &&
    errorMessage.includes('never') &&
    errorMessage.includes('existed');
  if (authTokenNotExist) {
    yield put(logoutAction());
    return;
  }
  yield put(showErrorAction(payload));
}

export function* getTrendingCoursesSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  try {
    const requestUrl = `${API_URL}/Player/GetMostTrendingCourses`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    onSuccess(response);
    yield put(setTrendingCoursesAction(response));
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}
export function* getExempleCoursesSaga({ payload }) {
  const { body = {}, actions = {} } = payload || {};
  const { onSuccess = () => null, onFetchEnd = () => null, onError = () => null } = actions;
  try {
    const requestUrl = `${API_URL}/Player/GetExempleCourses`;
    const response = yield call(request, requestUrl, {
      method: 'GET',
    });
    onSuccess(response);
    yield put(setExempleCourses(response));
  } catch (err) {
    onError(err);
  } finally {
    onFetchEnd();
  }
}

export default function* homePageSaga() {
  yield takeLatest(SEARCH, (data) => triggerLoadingRequest(searchSaga, data));
  // yield takeLatest(SEARCH_CATEGORY, (data) => triggerLoadingRequest(searchCategorySaga, data));
  yield takeLatest(GET_CAROUSEL_COURSES, (data) =>
    triggerLoadingRequest(getCarouselCoursesSaga, data),
  );
  yield takeLatest(GET_COURSE, (data) => triggerLoadingRequest(getCourseSaga, data));
  yield takeLatest(GET_COACH, (data) => triggerLoadingRequest(getCoachSaga, data));
  yield takeLatest(GET_COACH_DOCUMENT, (data) => triggerLoadingRequest(getCoachDocumentSaga, data));
  yield takeLatest(GET_SUGGESTED_COURSES, getSuggestedCourseSaga);
  yield takeLatest(GET_TRENDING_COURSES, getTrendingCoursesSaga);
  yield takeLatest(GET_LAST_ADDED_COURSES, getLastAddedCourseSaga);
  yield takeLatest(GET_WATCHED_COURSES, () =>
    triggerLoadingRequest(getWatchedCourseSaga, { hideError: true }),
  );
  yield takeLatest(GET_COURSE_WATCHED_EPISODES, getWatchedEpisodesSaga);
  yield takeLatest(GET_PLATFORM_STATISTICS, getPlatformStatisticsSaga);
  yield takeLatest(RESPONSE_ERROR, handleResponseErrorSaga);
  yield takeLatest(GET_EXEMPLE_COURSES, getTrendingCoursesSaga);

}

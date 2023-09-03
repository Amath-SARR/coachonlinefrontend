import { useInjectSaga } from '../../utils/injectSaga';
import b2BSaga from '../B2B/saga';
import librariesSaga from '../Libraries/saga';
import affiliationSaga from '../Affiliation/saga';
import liveEventsSaga from '../LiveEvents/saga';
import coursePageSaga from '../CoursePage/saga';
import authSaga from '../Auth/saga';
import dashboardSaga from '../Dashboard/saga';
import homePageSaga from '../HomePage/saga';
import subscriptionSaga from '../Subscription/saga';
import statisticsSaga from '../Statistics/saga';
import courseSaga from '../../store/course/course.saga';
import contractsSaga from '../../store/contracts/contracts.saga';
import faqSaga from '../../store/faq/faq.saga';

export default function () {
  useInjectSaga({ key: 'b2B', saga: b2BSaga });
  useInjectSaga({ key: 'libraries', saga: librariesSaga });
  useInjectSaga({ key: 'affiliation', saga: affiliationSaga });
  useInjectSaga({ key: 'liveEvents', saga: liveEventsSaga });
  useInjectSaga({ key: 'coursePage', saga: coursePageSaga });
  useInjectSaga({ key: 'course', saga: courseSaga });
  useInjectSaga({ key: 'auth', saga: authSaga });
  useInjectSaga({ key: 'dashboard', saga: dashboardSaga });
  useInjectSaga({ key: 'homePage', saga: homePageSaga });
  useInjectSaga({ key: 'subscription', saga: subscriptionSaga });
  useInjectSaga({ key: 'statistics', saga: statisticsSaga });
  useInjectSaga({ key: 'contracts', saga: contractsSaga });
  useInjectSaga({ key: 'faq', saga: faqSaga });
}

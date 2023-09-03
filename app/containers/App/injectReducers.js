import { useInjectReducer } from '../../utils/injectReducer';
import authReducer from '../Auth/reducer';
import dashboardReducer from '../Dashboard/reducer';
import homePageReducer from '../HomePage/reducer';
import subscriptionReducer from '../Subscription/reducer';
import statisticsReducer from '../Statistics/reducer';
import coursePageReducer from '../CoursePage/reducer';
import liveEventsReducer from '../LiveEvents/reducer';
import affiliationReducer from '../Affiliation/reducer';
import librariesReducer from '../Libraries/reducer';
import b2BReducer from '../B2B/reducer';
import courseReducer from '../../store/course/course.slice';
import contractsReducer from '../../store/contracts/contracts.slice';
import faqReducer from '../../store/faq/faq.slice';

export default function () {
  useInjectReducer({ key: 'auth', reducer: authReducer });
  useInjectReducer({ key: 'dashboard', reducer: dashboardReducer });
  useInjectReducer({ key: 'homePage', reducer: homePageReducer });
  useInjectReducer({ key: 'subscription', reducer: subscriptionReducer });
  useInjectReducer({ key: 'statistics', reducer: statisticsReducer });
  useInjectReducer({ key: 'coursePage', reducer: coursePageReducer });
  useInjectReducer({ key: 'course', reducer: courseReducer });
  useInjectReducer({ key: 'liveEvents', reducer: liveEventsReducer });
  useInjectReducer({ key: 'affiliation', reducer: affiliationReducer });
  useInjectReducer({ key: 'libraries', reducer: librariesReducer });
  useInjectReducer({ key: 'b2B', reducer: b2BReducer });
  useInjectReducer({ key: 'contracts', reducer: contractsReducer });
  useInjectReducer({ key: 'faq', reducer: faqReducer });
}

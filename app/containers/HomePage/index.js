/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import PageContainer from '../../components/PageContainer';
import makeSelectAuth from '../Auth/selectors';
import makeSelectHomePage from './selectors';
import {
  searchAction,
  getCourseAction,
  getCarouselCoursesAction,
  getWatchedCoursesAction,
  getSuggestedCoursesAction,
  setHomePageFilterAction,
  getLastAddedCoursesAction,
  getTrendingCoursesAction,
} from './actions';
import HorizontalSectionList from '../../components/HorizontalSectionList';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import HomepageCarousel from '../../components/HomepageCarousel';
import messages from './messages';
import CoachesSectionList from '../../components/CoachesSectionList/Loadable';
import PlatformStatistics from '../../components/PlatformStatistics';
import history, { replaceWithBackground } from '../../utils/history';
import useQuery from '../../hooks/useQuery';
import Banner from '../../components/Banner';
import styled from 'styled-components';
import SubscriptionsSelector from '../../components/SubscriptionsSelector/subscriptions-selector';
import { useLocation } from 'react-router-dom';
import IFrame from '../../components/IFrame/i-frame';
import HomePageAffiliationSection from '../../components/HomePageAffiliationSection/home-page-affiliation-section';
import CourseCard from '../../components/CourseCard/course-card';
import makeSelectSubscription from '../Subscription/selectors';
import { getUserBasicDataAction } from '../Auth/actions';
import { wixLinks } from '../../components/HomePageAffiliationSection/links';
import { AccessType } from '../Auth/reducer.types';
import TopCourses from '../../components/TopCourses/top-courses';
import CoachsCTA from '../../components/CoachsCTA/coachs-cta';
import StudentsCta from '../../components/StudentsCTA/students-cta';
import CategoryCard from '../../components/CategoryCard/category-card';
import EventCard from '../../components/EventCard/event-card';
import FaqAccordion from '../../components/FaqAccordion/faq-accordion';
import SubscriptionChoice from '../../components/SubscriptionChoice/subscription-choice';
import { colors } from '../../utils/colors';
import { Text } from '../../global-styles';

const Title = styled(Text)`
  font-size: 35px;
  margin-bottom: 10px;
  margin-top: 100px;
  margin-left: 20px;
  margin-right: 20px;
  text-align: center;
  @media screen and (max-width: 600px) {
    font-size: 22px;
  }
`;

const OutsidePageContainer = ({ auth, subscription }) =>
  !auth.authToken ? <HomePageAffiliationSection subscription={subscription} auth={auth} /> : null;

const SubscriptionContainer = ({ subscription, auth }) =>
  !auth.authToken ? <SubscriptionChoice subscription={subscription} auth={auth} /> : null;

function HomePage({
  auth,
  homePage,
  subscription,
  search,
  setSearchValue,
  setChosenCourse,
  getCarouselCourses,
  getUserBasicData,
  getWatchedCourses,
  getLastAddedCourses,
  getSuggestedCourses,
  getTrendingCourses,
}) {
  const query = useQuery();
  const location = useLocation();
  const affiliationToken = query.get('Join');
  const coachAffiliationToken = query.get('Ref');
  const formsRef = useRef();

  const asAccessToLike = () => {
    if (!userLoggedIn) return false;
    if (canLike != undefined && canLike != null) return canLike;
    return false;
  };
  useEffect(() => {
    if (history.location?.search.includes('email_confirmed')) {
      toast.success('Votre e-mail a été confirmé. Vous pouvez vous connecter maintenant');
    }
  }, []);

  useEffect(() => {
    getCarouselCourses();
    getSuggestedCourses();
    getLastAddedCourses();
    getTrendingCourses({});
    search();
    readFromStorage('authToken') && getUserBasicData();
    readFromStorage('authToken') && getWatchedCourses();
  }, []);

  useEffect(() => {
    !!affiliationToken && storeAffiliationToken(affiliationToken);
    !!coachAffiliationToken && storeCoachAffiliationToken(coachAffiliationToken);
  }, []);

  useEffect(() => {
    const sectionId = query.get('sectionId');
    if (sectionId) {
      scrollToSection(sectionId);
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const forms = document.querySelector(`#${sectionId}`);
    const y = forms?.getBoundingClientRect().top + window.pageYOffset + -100;
    return window.scrollTo({
      top: y,
      behavior: 'smooth',
      // block: 'start',
    });
  };

  const goToCourse = (course) => {
    const hasAccess =
      auth.userInfo?.userRole !== 'STUDENT' ||
      !!auth.studentData?.trialActive ||
      !!auth.studentData?.subscription?.selectedPlanId;

    if (auth.authToken && !hasAccess) {
      return replaceWithBackground({ path: '/subscription/subscriptionChoice', history, location });
    }
    if (!auth.authToken || !hasAccess) {
      const forms = document.querySelector('#homepage_subs');
      const y = forms?.getBoundingClientRect().top + window.pageYOffset + -100;
      return window.scrollTo({
        top: y,
        behavior: 'smooth',
        // block: 'start',
      });
    }
    setChosenCourse(course?.courseId || course?.id);
  };

  const onCategorySelect = (val, type) => {
    const encodedVal = encodeURIComponent(val);
    search({ value: encodedVal, type });
    setSearchValue(encodedVal);
    if (encodedVal) {
      setTimeout(() => history.push(`/search?value=${encodedVal}&type=${type}`), 400);
    }
  };

  const storeAffiliationToken = (token) => {
    writeToStorage('affiliationToken', token);
  };

  const storeCoachAffiliationToken = (token) => {
    writeToStorage('coachAffiliationToken', token);
  };

  const Carousel = () => {
    if (!auth.authToken) {
      return null;
    }
    return (
      homePage.layoutState === 'default' && (
        <HomepageCarousel
          courses={readFromStorage('carouselCourses')}
          onCourseClick={(course) => goToCourse(course)}
        />
      )
    );
  };

  const Top10Courses = () => {
    const top10 = homePage?.suggestedCourses?.slice(0, 10);
    console.log(homePage.suggestedCourses);
    return (
      <HorizontalSectionList
        title={"Top Cours aujourd'hui"}
        // withIndexes
        items={top10}
        keys={{ name: 'name', id: 'id', image: 'photoUrl' }}
        onItemClick={(course) => goToCourse(course)}
      />
    );
  };

  const TrendingCourses = () => (
    <HorizontalSectionList
      title={'Cours tendance'}
      items={homePage?.trendingCourses}
      keys={{ name: 'name', id: 'id', image: 'photoUrl' }}
      onItemClick={(course) => goToCourse(course)}
      //clickable={asAccessToLike()}
    />
  );

  const LastAddedCourses = () => (
    <HorizontalSectionList
      title={'Nouveautés'}
      items={homePage.lastAddedCourses}
      keys={{ name: 'name', id: 'id', image: 'photoUrl' }}
      onItemClick={(course) => goToCourse(course)}
    />
  );

  const renderContinueLearningSection = () =>
    !!readFromStorage('authToken') && (
      <HorizontalSectionList
        maxItems={4}
        title={<FormattedMessage {...messages.continueLearning} />}
        items={homePage.watchedCourses}
        keys={{ name: 'name', id: 'id', image: 'photoUrl' }}
        onItemClick={(course) => goToCourse(course)}
      />
    );

  const renderCategories = () => {
    if (!auth.authToken) {
      return null;
    }
    const itemsToRender = [];
    const getCourses = (category) => {
      const courses = [...(category.courses || [])];
      if (category?.childCategories?.length) {
        category?.childCategories?.forEach((subcategory) => {
          courses.push(...(subcategory.courses || []));
        });
      }
      return courses;
    };
    itemsToRender.push(
      <HorizontalSectionList
        key={213721372137}
        maxItems={4}
        title={<FormattedMessage {...messages.suggestedCourses} />}
        items={homePage?.suggestedCourses?.slice(10)}
        onItemClick={(course) => goToCourse(course)}
        keys={{ id: 'id', name: 'name', image: 'photoUrl' }}
      />,
    );
    homePage?.categories?.forEach((category) => {
      const parentCategory = (
        <HorizontalSectionList
          key={category.categoryId}
          onTitleClick={(title) => onCategorySelect(title, 'byCat')}
          maxItems={4}
          title={category.name}
          items={getCourses(category)}
          onItemClick={(course) => goToCourse(course)}
        />
      );
      itemsToRender.push(parentCategory);
    });
    return itemsToRender;
  };
  console.log(homePage.courses);
  return (
    <div>
      <Helmet>
        <title>Coachs-online.com</title>
        <meta name="description" content="Description of ProfilePage" />
      </Helmet>
      <PageContainer
        loaderShown={homePage.loadingOverlayShown}
        colorScheme="dark"
        renderOutsideWindowContainer={
          <OutsidePageContainer auth={auth} subscription={subscription} />
        }
        style={{
          windowContainer: { border: 'none', maxWidth: '1460px', padding: 0 },
        }}
        history={history}
      >
        <Carousel />
        <PlatformStatistics />
        <Top10Courses />
        {/* <CategoryCard /> */}
        {/* <EventCard /> */}
        {/* <TopCourses /> */}
        <TrendingCourses />
        <LastAddedCourses />
        {!auth.authToken && <StudentsCta />}
        {/* {!auth.authToken && <CoachsCTA />} */}

        {/* <SubscriptionsSelector /> */}
        {/* {!auth.authToken && (
          <IFrame
            src={!!affiliationToken ? wixLinks.homepageAffiliation.url : wixLinks.homepage.url}
          />
        )} */}
        {renderContinueLearningSection()}
        {renderCategories()}

        {/* {!!homePage.coaches?.length && (
          <CoachesSectionList
            id="coaches"
            coaches={homePage.coaches || []}
            title={<FormattedMessage {...messages.coaches} />}
          />
        )} */}
        {!auth.authToken && (
          <Title id={'homepage_form-ref'} ref={formsRef}>
            Rejoignez Coachs Online !{' '}
          </Title>
        )}
        <SubscriptionContainer auth={auth} subscription={subscription} />

        <FaqAccordion />
      </PageContainer>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  homePage: makeSelectHomePage(),
  subscription: makeSelectSubscription(),
});

function mapDispatchToProps(dispatch) {
  return {
    search: (value) => dispatch(searchAction(value)),
    setSearchValue: (value) => dispatch(setHomePageFilterAction(value)),
    getWatchedCourses: () => dispatch(getWatchedCoursesAction()),
    getTrendingCourses: (data) => dispatch(getTrendingCoursesAction(data)),
    getLastAddedCourses: () => dispatch(getLastAddedCoursesAction()),
    getSuggestedCourses: () => dispatch(getSuggestedCoursesAction()),
    getCarouselCourses: () => dispatch(getCarouselCoursesAction()),
    setChosenCourse: (id) => dispatch(getCourseAction(id)),
    getUserBasicData: () => dispatch(getUserBasicDataAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(HomePage);

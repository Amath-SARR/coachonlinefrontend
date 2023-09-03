/**
 *
 * Dashboard
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import makeSelectDashboard from './selectors';
import ListOfCurrentCourses from '../../components/ListOfCurrentCourses';
import {
  fetchCourseToEditAction,
  getCategoriesAction,
  getCurrentCoursesAction,
  saveCourseAction,
  suggestCategoryAction,
} from './actions';
import PageContainer from '../../components/PageContainer';
import makeSelectAuth from '../Auth/selectors';
import { getUserCategoriesAction } from '../Auth/actions';
import {
  getMonthBalanceAction,
  getMonthMinutesAction,
  getMonthStatisticsAction,
} from '../Statistics/actions';
import makeSelectStatistics from '../Statistics/selectors';
import CoachStatistics from '../../components/CoachStatistics';
import CreatedLiveEvents from '../../components/CreatedLiveEvents';
import makeSelectLiveEvents from '../LiveEvents/selectors';

export function Dashboard({
  history,
  getCurrentCourses,
  dashboard,
  statistics,
  fetchCourseToEdit,
  getCategories,
  getUserCategories,
  createCourse,
  getMonthStatistics,
  suggestCategory,
}) {
  useEffect(() => {
    getCurrentCourses();
    getCategories();
    getUserCategories();
    fetchCourseToEdit({});
  }, []);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Description of Dashboard" />
      </Helmet>
      <PageContainer withPanel history={history}>
        <CoachStatistics
          history={history}
          getMonthStatistics={getMonthStatistics}
          statistics={statistics}
        />
        <CreatedLiveEvents />
        <ListOfCurrentCourses
          data={dashboard.currentCourses}
          categories={dashboard.categories}
          createCourse={createCourse}
          fetchCourseToEdit={fetchCourseToEdit}
          suggestCategory={suggestCategory}
        />
      </PageContainer>
    </div>
  );
}

Dashboard.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
  auth: makeSelectAuth(),
  statistics: makeSelectStatistics(),
});

function mapDispatchToProps(dispatch) {
  return {
    getCurrentCourses: () => dispatch(getCurrentCoursesAction()),
    fetchCourseToEdit: (data) => dispatch(fetchCourseToEditAction(data)),
    getCategories: () => dispatch(getCategoriesAction()),
    getUserCategories: () => dispatch(getUserCategoriesAction()),
    createCourse: (data) => dispatch(saveCourseAction(data)),
    getMonthStatistics: (data) => dispatch(getMonthStatisticsAction(data)),
    suggestCategory: (data) => dispatch(suggestCategoryAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Dashboard);

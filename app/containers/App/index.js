/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import { ToastContainer } from 'react-toastify';
import makeSelectAuth from '../Auth/selectors';
import makeSelectDashboard from '../Dashboard/selectors';
import makeSelectHomePage from '../HomePage/selectors';
import makeSelectSubscription from '../Subscription/selectors';

import Dashboard from '../Dashboard/Loadable';
import AddCourse from '../AddCourse/Loadable';
import BillingPage from '../BillingPage/Loadable';
import RankingPage from '../RankingPage/Loadable';
import ProfilePage from '../Profile/ProfilePage/Loadable';

import 'react-toastify/dist/ReactToastify.css';
import StudentProfilePage from '../Profile/StudentProfilePage/Loadable';
import CoursePage from '../CoursePage/Loadable';
import CoachInfoPage from '../CoachInfoPage/Loadable';
import { Grommet } from 'grommet';
import CreateLiveEventPage from '../LiveEvents/CreateLiveEventPage/Loadable';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import SearchResultPage from '../SearchResultPage/Loadable';
import Subscription from '../Subscription/Loadable';

import B2B from '../B2B/Loadable';
import Libraries from '../Libraries/Loadable';
import ConnectionsTrackerSignalR from '../../components/ConnectionsTrackerSignalR';
import injectReducers from './injectReducers';
import injectSagas from './injectSagas';
import Auth from '../Auth/Loadable';
import LibraryRegisterPage from '../Auth/LibraryRegisterPage/Loadable';
import { Contracts, Faq } from '../Articles/index';
import CoachesPage from '../CoachesPage/Loadable';
import RouteParamsWatcher from '../../components/RouteParamsWatcher/route-params-watcher';
import WelcomeQuestionnaire from '../../components/WelcomeQuestionnaire/welcome-questionnaire';

function App() {
  injectReducers();
  injectSagas();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const background = location.state?.background;

  return (
    <Grommet plain>
      <Switch location={background || location}>
        {/* common */}
        <Route exact path="/" component={HomePage} />
        <Route path="/search" component={SearchResultPage} />
        <Route path="/coaches" component={CoachesPage} />
        <Route exact path="/course" component={CoursePage} />
        <Route exact path="/coach/:id" component={CoachInfoPage} />
        {/* auth */}
        <Route path={'/auth'} component={Auth} />
        <Route exact path={'/library/:libraryName'} component={LibraryRegisterPage} />
        {/* COACH */}
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/addCourse/:id" component={AddCourse} />
        <Route path="/billing" component={BillingPage} />
        <Route path="/ranking" component={RankingPage} />
        <Route path="/profile/:tabId?" component={ProfilePage} />
        <Route path="/live/:modalType/:id?" component={CreateLiveEventPage} />
        {/* subscription */}
        <Route path="/subscription" component={Subscription} />
        <Route path="/studentProfile/:tabId?" component={StudentProfilePage} />
        {/*B2B*/}
        <Route path="/b2b" component={B2B} />
        {/* libraries */}
        <Route path={['/libraries', '/library']} component={Libraries} />
        {/*articles*/}
        <Route path="/articles/faq" component={Faq} />
        <Route path="/articles/contracts/:contractId" component={Contracts} />
        {/*other*/}
        <Route component={NotFoundPage} />
      </Switch>
      {/* modals */}
      {background && (
        <>
          {/* auth */}
          <Route path={'/auth'} component={Auth} />
          <Route exact path={'/library/:libraryName'} component={LibraryRegisterPage} />
          {/* COACH */}
          <Route path="/live/:modalType/:id?" component={CreateLiveEventPage} />
          {/* subscription */}
          <Route path="/subscription" component={Subscription} />
          {/*B2B*/}
          <Route path="/b2b" component={B2B} />
          {/* libraries */}
          <Route path="/libraries" component={Libraries} />
        </>
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        style={{
          maxWidth: 660,
          fontSize: 20,
          fontWeight: 600,
          width: '100%',
          marginTop: '65px',
          textAlign: 'center',
          zIndex: 999999999999,
        }}
      />
      <RouteParamsWatcher />
      <ConnectionsTrackerSignalR />
      <WelcomeQuestionnaire />
    </Grommet>
  );
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  dashboard: makeSelectDashboard(),
  homePage: makeSelectHomePage(),
  subscription: makeSelectSubscription(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(App);

/**
 *
 * Libraries
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import makeSelectLibraries from './selectors';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage/Loadable';
import LibraryProfilePage from '../Profile/LibraryProfilePage/Loadable';

export function Libraries({ libraries }) {
  const location = useLocation();
  return (
    <Switch location={location}>
      <Route exact path={'/libraries/log-in'} component={LoginPage} />
      <Route
        exact
        path={['/libraries/:id/profile/:tabId?', '/library/profile/:tabId?']}
        component={LibraryProfilePage}
      />
      {libraries.libraryAuthToken && <Redirect to={'/library/profile/settings'} />}
    </Switch>
  );
}

const mapStateToProps = createStructuredSelector({
  libraries: makeSelectLibraries(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Libraries);

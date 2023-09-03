/**
 *
 * B2B
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import makeSelectB2B from './selectors';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage/Loadable';
import B2BProfilePage from '../Profile/B2BProfilePage/Loadable';

export function B2B({ b2B }) {
  const location = useLocation();
  const background = location.state?.background;
  return (
    <Switch location={location}>
      <Route path={'/b2b/log-in'} component={LoginPage} />
      <Route path={'/b2b/profile/:tabId?'} component={B2BProfilePage} />
      {b2B.b2bAuthToken ? (
        <Redirect to={'/b2b/profile/settings'} />
      ) : (
        <Redirect to={'/b2b/log-in'} />
      )}
    </Switch>
  );
}

const mapStateToProps = createStructuredSelector({
  b2B: makeSelectB2B(),
});

function mapDispatchToProps(dispatch: any) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(B2B);

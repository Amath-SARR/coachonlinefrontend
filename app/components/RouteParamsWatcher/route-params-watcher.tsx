/**
 *
 * RouteParamsWatcher
 *
 */

import React, { useEffect } from 'react';
import RouteParamsWatcherProps from './route-params-watcher.props';
import { DispatchType } from '../../types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import useQuery from '../../hooks/useQuery';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import { GoogleActionType, UserRole } from '../../containers/Auth/reducer.types';
import history from '../../utils/history';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

function RouteParamsWatcher(props: RouteParamsWatcherProps) {
  const query = useQuery();
  const location = useLocation();
  const affiliationToken = query.get('Join');
  const coachAffiliationToken = query.get('Ref');

  useEffect(() => {
    const gIdToken = query.get('gIdToken');
    const errorMsg = query.get('errorMsg');
    if (gIdToken) {
      onGoogleRedirect(gIdToken);
    }
    if (errorMsg) {
      handleErrorParam(errorMsg);
    }
  }, []);

  useEffect(() => {
    !!affiliationToken && storeAffiliationToken(affiliationToken);
    !!coachAffiliationToken && storeCoachAffiliationToken(coachAffiliationToken);
  }, []);

  const handleErrorParam = (errorMsg: string) => {
    toast.error(errorMsg);
    history.replace(location.pathname);
  };

  const onGoogleRedirect = (gIdToken: string) => {
    const registerData = readFromStorage('googleAuthData');
    if (registerData?.authType === GoogleActionType.login) {
      history.push(`/auth/login/?gIdToken=${gIdToken}`);
      return;
    }
    if (registerData?.authType === GoogleActionType.register) {
      history.push(
        `/auth/register/${
          registerData.role === UserRole.COACH ? 'coach' : 'student'
        }?gIdToken=${gIdToken}`,
      );
      return;
    }
  };

  const storeAffiliationToken = (token) => {
    writeToStorage('affiliationToken', token);
  };

  const storeCoachAffiliationToken = (token) => {
    writeToStorage('coachAffiliationToken', token);
  };

  return null;
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(RouteParamsWatcher);

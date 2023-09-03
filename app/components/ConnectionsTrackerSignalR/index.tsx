/**
 *
 * ConnectionsTrackerSignalR
 *
 */

import React, { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BASE_URL } from '../../config/env';
import { compose } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectAuth from '../../containers/Auth/selectors';
import { ActiveOnAnotherDeviceEventData, QuestionnaireEventData, UserStateInfo } from './types';
import { readFromStorage } from '../../utils/storage';
import { useLocation } from 'react-router-dom';
import { APPLICATION_URL } from '../../config/env';
import history from '../../utils/history';
import { toast } from 'react-toastify';
import { setQuestionnaireAction } from '../../containers/Auth/actions';

export const getUserData = (): UserStateInfo => ({
  authToken: readFromStorage('authToken'),
});

export const sendUserState = (courseOpened = false) => {
  const userData = { ...getUserData(), courseOpened };
  !!userData.authToken ? onUserConnected(userData) : onUserLoggedOut(userData);
};

export const onUserConnected = (data: UserStateInfo) => send('UserConnected', data);
export const onUserLoggedOut = (data: UserStateInfo) => send('UserLoggedOut', data);

export const send = async (methodName: string, data: UserStateInfo) => {
  try {
    console.log(`Sending event ${methodName}`, window.connectionTrackerHub);
    await window.connectionTrackerHub?.send(methodName, data);
    console.log(`Event ${methodName} sent with data `, data);
  } catch (e) {
    console.log(`Error while sending event ${methodName}.`);
    console.warn(e);
  }
};

function ConnectionsTrackerSignalR({ auth, setQuestionnaire }) {
  const location = useLocation();

  useEffect(() => {
    console.log('Hub connection', window.connectionTrackerHub);
    if (window.connectionTrackerHub?.state === 'Connected') {
      sendUserState();
    } else {
      startConnection();
    }
  }, [auth.authToken]);

  const startConnection = () => {
    window.connectionTrackerHub = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}signalr/users`)
      .withAutomaticReconnect()
      .build();
    // setHubConnection(connection);
    window.connectionTrackerHub
      .start()
      .then(() => {
        console.log('Connection started');
        setHubEvents();
      })
      .then(() => sendUserState())
      .catch((err) => console.log(`Error while starting connection: ${err}`));
  };

  const setHubEvents = () => {
    window.connectionTrackerHub?.on('FillFormRequest', (data) => {
      console.log('SignalR received: Fill form request', data);
      onQuestionnaireAppear(data);
    });
    window.connectionTrackerHub?.on('LimitReached', (data) => {
      console.log('SignalR received: Limit reached event', data);
    });
    window.connectionTrackerHub?.on('LoggedOut', (data) => {
      console.log('SignalR received: Logged out event', data);
    });
    window.connectionTrackerHub?.on(
      'ActiveOnAnotherDevice',
      (data: ActiveOnAnotherDeviceEventData) => {
        console.log('SignalR received: user activated another device', data);
        onAnotherDeviceActiveEventReceived(data);
      },
    );
    window.connectionTrackerHub?.on('CheckUserLocalization', () => {
      console.log('SignalR received:requesting current URL');
      const userData = {
        authToken: readFromStorage('authToken'),
        userUrl: window.location.href,
      };
      send('UserLocalization', userData);
    });
  };

  const onQuestionnaireAppear = (data: QuestionnaireEventData) => {
    setQuestionnaire(data);
  };

  const onAnotherDeviceActiveEventReceived = (data: ActiveOnAnotherDeviceEventData) => {
    history.push('/');
    toast.warn(
      "Il semble que vous ayez commencé à consulter les cours sur un autre appareil. Il n'est possible de jouer les cours que sur un seul appareil à la fois. Assurez-vous que personne d'autre n'a accès à votre compte",
    );
  };

  return null;
}

function mapDispatchToProps(dispatch: any) {
  return {
    dispatch,
    setQuestionnaire: (data: QuestionnaireEventData) => dispatch(setQuestionnaireAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ConnectionsTrackerSignalR);

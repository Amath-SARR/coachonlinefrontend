/**
 *
 * Auth
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import makeSelectAuth from './selectors';
import { colors } from '../../utils/colors';
import Button from '../../components/Button';
import InputSubmit from '../../components/InputSubmit';
import useWindowSize from '../../hooks/useWindowSize';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import history, { replaceFromBackground } from '../../utils/history';
import Modal from '../../components/Modal';
import LoginPage from './LoginPage/Loadable';
import RegisterPage from './RegisterPage/Loadable';
import ConfirmEmailPage from './ConfirmEmailPage/Loadable';
import ForgotPassword from './ForgotPassword/Loadable';
import LibraryRegisterPage from './LibraryRegisterPage/Loadable';
import { PageLoader } from '../../components/PageContainer';
import makeSelectHomePage from '../HomePage/selectors';

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  width: 100%;
  max-width: 300px;
  padding: 10px 0 50px 0;
`;
export const WideButton = styled(Button)`
  padding: 10px 30px;
  margin-bottom: 10px;
  text-align: center;
  width: 100%;
`;
export const ActionButton = styled(InputSubmit)`
  width: 100%;
  margin-bottom: 20px;
  color: ${colors.mainGreen};
`;

export const authModalStyles = (width) => ({
  overlay: {
    backgroundColor: `${colors.backgroundDarkBlue}`,
  },
  content: {
    inset: width < 693 ? '50% 50% auto 50%' : '50% 50% auto 50%',
    transform: width < 693 ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
    background: 'white',
    border: `2px solid ${colors.mainPink}`,
    borderRadius: 24,
    width: '100%',
    maxWidth: 675,
  },
  headerTitle: {
    // fontSize: '43px',
    fontWeight: 800,
  },
});

export function Auth({ homePage }) {
  const { width } = useWindowSize();
  const location = useLocation();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(true);
    console.log('Auth modal opened ', location);
  }, []);

  const closeModal = () => {
    setOpened(false);
    console.log('Auth location ', location);
    setTimeout(() => replaceFromBackground({ history, location }), 300);
  };
  const modalStyle = authModalStyles(width);
  return (
    <Modal
      ariaHideApp={false}
      isOpened={opened}
      style={modalStyle}
      onClose={closeModal}
      overlayClassName="transition"
      withHeader
      backButtonHidden
    >
      {homePage.loadingOverlayShown && <PageLoader />}
      <Switch location={location}>
        <Route exact path="/login">
          <Redirect to="/auth/login" />
        </Route>
        <Route path="/auth/login" component={LoginPage} />
        <Route exact path="/register">
          <Redirect to="/auth/register/student" />
        </Route>
        <Route exact path={'/auth/register/:accountType'} component={RegisterPage} />
        <Route exact path="/confirmEmail">
          <Redirect to="/auth/confirmEmail" />
        </Route>
        <Route path="/auth/confirmEmail" component={ConfirmEmailPage} />
        <Route exact path="/resetPassword">
          <Redirect to="/auth/resetPassword" />
        </Route>
        <Route path="/auth/resetPassword" component={ForgotPassword} />
      </Switch>
    </Modal>
  );
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Auth);

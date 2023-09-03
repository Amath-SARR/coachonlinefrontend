/**
 *
 * LoginPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import makeSelectAuth from '../selectors';
import { logInAction } from '../actions';
import Input from '../../../components/Input';
import messages from '../../../components/messages';
import Modal from '../../../components/Modal';
import useWindowSize from '../../../hooks/useWindowSize';
import history from '../../../utils/history';
import { ActionButton, authModalStyles, InnerWrapper } from '../../Auth/index';
import makeSelectB2B from '../selectors';
import { yupValidators } from '../../../utils/validate';

const registerSchema = yup.object().shape({
  login: yupValidators.notEmpty,
  password: yupValidators.notEmpty,
});

export function LoginPage({ logIn }) {
  const { width } = useWindowSize();
  const location = useLocation();
  const { register, handleSubmit, watch, errors } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    console.log('Im right here');
    setOpened(true);
  }, []);

  const closeModal = () => {
    setOpened(false);
    setTimeout(() => history.replace(location?.state?.background?.pathname || '/'), 200);
  };

  const navigate = (path) => {
    setOpened(false);
    history.replace(path, {
      background: location?.state?.background,
    });
  };

  const onSubmit = (data) =>
    logIn({ body: data, actions: { onSuccess: () => history.replace('/b2b/profile/settings') } });

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
      headerTitle={<FormattedMessage {...messages.welcome} />}
      headerDescription={<FormattedMessage {...messages.logInto} />}
    >
      <InnerWrapper>
        <div style={{ marginBottom: '40px', marginTop: '20px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              redesigned
              inputProps={{ ref: register, name: 'login' }}
              labelName={messages.login}
              error={errors.login?.message}
            />
            <Input
              redesigned
              inputProps={{ ref: register, name: 'password' }}
              labelName={messages.Password}
              type="password"
              error={errors.password?.message}
              secured
            />
            {/*<Label*/}
            {/*  labelName={messages.forgotPassword}*/}
            {/*  onClick={() => navigate('/auth/resetPassword')}*/}
            {/*/>*/}
            <ActionButton disableOnFetch outline value="Connexion" />
          </form>
        </div>

        {/*<Label labelName={messages.registerNewAccount} />*/}
        {/*<WideButton color="green" disableOnFetch onClick={() => navigate('/auth/register/student')}>*/}
        {/*  <FormattedMessage {...messages.registerAsStudent} />*/}
        {/*</WideButton>*/}
        {/*<WideButton*/}
        {/*  outline*/}
        {/*  color="green"*/}
        {/*  disableOnFetch*/}
        {/*  onClick={() => navigate('/auth/register/coach')}*/}
        {/*>*/}
        {/*  <FormattedMessage {...messages.registerAsCoach} />*/}
        {/*</WideButton>*/}
      </InnerWrapper>
    </Modal>
  );
}

LoginPage.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  b2B: makeSelectB2B(),
});

function mapDispatchToProps(dispatch) {
  return {
    logIn: (data) => dispatch(logInAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(LoginPage);

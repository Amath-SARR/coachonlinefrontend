/**
 *
 * ForgotPassword
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import Input from '../../../components/Input';
import InputSubmit from '../../../components/InputSubmit';
import { confirmNewPasswordAction, sendPasswordResetAction } from '../actions';
import makeSelectAuth from '../selectors';
import history from '../../../utils/history';
import messages from '../../../components/messages';
import Modal, { ModalHeaderDescription, ModalHeaderTitle } from '../../../components/Modal';
import { authModalStyles, InnerWrapper } from '../index';
import useWindowSize from '../../../hooks/useWindowSize';
import { colors } from '../../../utils/colors';
import { yupValidators } from '../../../utils/validate';

const emailSchema = yup.object().shape({
  email: yupValidators.email,
});

const resetPasswordSchema = yup.object().shape({
  email: yupValidators.email,
  password: yupValidators.password,
  passwordRepeat: yupValidators.confirm_password,
});

export function ForgotPassword({ sendPasswordReset, confirmNewPassword }) {
  const { width } = useWindowSize();
  const location = useLocation();
  const [token] = useState(history.location?.search.split('=')[1]);
  const [opened, setOpened] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(emailSchema),
  });
  const {
    register: registerChange,
    handleSubmit: handleSubmitChange,
    errors: errorsChange,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = (data) => sendPasswordReset(data);

  useEffect(() => {
    setOpened(true);
  }, []);

  const closeModal = () => {
    setOpened(false);
    setTimeout(() => history.replace(location?.state?.background?.pathname || '/'), 100);
  };

  const onSubmitChange = (data) => confirmNewPassword({ ...data, token });

  const modalStyle = authModalStyles(width);
  return (
    // <Modal
    //   ariaHideApp={false}
    //   isOpened={opened}
    //   style={modalStyle}
    //   onClose={closeModal}
    //   overlayClassName="transition"
    //   withHeader
    //   backButtonHidden
    //   headerTitle={<FormattedMessage {...messages.resetYourPassword} />}
    // >
    <InnerWrapper>
      <ModalHeaderTitle>
        <FormattedMessage {...messages.resetYourPassword} />
      </ModalHeaderTitle>
      {!token && (
        <div style={{ marginBottom: '40px', marginTop: '20px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              redesigned
              inputProps={{ ref: register, name: 'email' }}
              labelName={messages.Email}
              error={errors.email?.message}
              type="email"
            />
            <InputSubmit
              disableOnFetch
              color={colors.black}
              value="Réinitialiser"
              style={{ textAlign: 'center' }}
            />
          </form>
        </div>
      )}
      {token && (
        <div style={{ marginBottom: '100px', marginTop: '20px' }}>
          <form onSubmit={handleSubmitChange(onSubmitChange)}>
            <Input
              redesigned
              inputProps={{ ref: registerChange, name: 'email' }}
              labelName={messages.Email}
              error={errorsChange.email?.message}
              type="email"
            />
            <Input
              redesigned
              inputProps={{ ref: registerChange, name: 'password' }}
              labelName={messages.Password}
              error={errorsChange.password?.message}
              type="password"
              secured
            />
            <Input
              redesigned
              inputProps={{ ref: registerChange, name: 'passwordRepeat' }}
              labelName={messages.PasswordRepeat}
              error={errorsChange.passwordRepeat?.message}
              type="password"
              secured
            />
            <InputSubmit disableOnFetch value="Changer" style={{ textAlign: 'center' }} />
          </form>
        </div>
      )}
    </InnerWrapper>
  );
}

ForgotPassword.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    sendPasswordReset: (data) => dispatch(sendPasswordResetAction(data)),
    confirmNewPassword: (data) => dispatch(confirmNewPasswordAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ForgotPassword);

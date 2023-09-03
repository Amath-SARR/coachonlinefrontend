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
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import makeSelectAuth from '../selectors';
import { loginGoogleAction, logIntoAccountAction } from '../actions';
import messages from '../../../components/messages';
import { ModalHeaderDescription, ModalHeaderTitle } from '../../../components/Modal';
import useWindowSize from '../../../hooks/useWindowSize';
import history, { replaceFromBackground } from '../../../utils/history';
import Label from '../../../components/Label';
import { authModalStyles, InnerWrapper, WideButton } from '../index';
import { yupValidators } from '../../../utils/validate';
import LoginForm from '../../../components/LoginForm/login-form';

const registerSchema = yup.object().shape({
  email: yupValidators.email,
  password: yup
    .string()
    .min(5, 'Le mot de passe doit comporter au moins 5 caractères')
    .matches(/^\S+$/, "Aucun espace n'est autorisé")
    .required(),
});

export function LoginPage({ logIntoAccount, loginGoogle, auth }) {
  const { width } = useWindowSize();
  const location = useLocation();
  const { register, handleSubmit, watch, errors } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(true);
  }, []);

  useEffect(() => {
    if (history.location?.search.includes('email_confirmed')) {
      toast.success('Votre e-mail a été confirmé. Vous pouvez vous connecter maintenant');
    }
    !!auth.authToken && history.replace('/');
  }, []);

  const closeModal = () => {
    setOpened(false);
    console.log(location);
    setTimeout(() => replaceFromBackground({ history, location }), 200);
  };

  const navigate = (path) => {
    setOpened(false);
    history.replace(path, {
      background: location?.state?.background,
    });
  };

  const onSubmit = (data) => logIntoAccount(data);

  const responseGoogle = (data) => {
    loginGoogle({ tokenId: data?.tokenId });
  };

  const failureGoogle = (error) => {
    console.log(error);
    toast.error(`Google authorization is not available at the moment. Reason: ${error.details}`);
  };

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
    //   headerTitle={<FormattedMessage {...messages.welcome} />}
    //   headerDescription={<FormattedMessage {...messages.logInto} />}
    // >
    <InnerWrapper>
      {/*{!!auth.authToken && <Redirect to={'/'} />}*/}
      <ModalHeaderTitle>
        <FormattedMessage {...messages.welcome} />
      </ModalHeaderTitle>
      <ModalHeaderDescription>
        <FormattedMessage {...messages.logInto} />
      </ModalHeaderDescription>
      <LoginForm />

      <Label className={'dev-only'} labelName={messages.registerNewAccount} />
      <WideButton
        className={'dev-only'}
        color="green"
        disableOnFetch
        onClick={() => navigate('/auth/register/student')}
      >
        <FormattedMessage {...messages.registerAsStudent} />
      </WideButton>
      <WideButton
        className={'dev-only'}
        outline
        color="green"
        disableOnFetch
        onClick={() => navigate('/auth/register/coach')}
      >
        <FormattedMessage {...messages.registerAsCoach} />
      </WideButton>
    </InnerWrapper>
    // </Modal>
  );
}

LoginPage.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    logIntoAccount: (data) => dispatch(logIntoAccountAction(data)),
    loginGoogle: (data) => dispatch(loginGoogleAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(LoginPage);

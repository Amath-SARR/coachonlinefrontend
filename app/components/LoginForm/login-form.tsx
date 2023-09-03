/**
 *
 * LoginForm
 *
 */

import React, { memo, useEffect, useState } from 'react';
import LoginFormProps from './login-form.props';
import styled from 'styled-components';
import { DispatchType } from '../../types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import Input from '../Input';
import messages from '../messages';
import Label from '../Label';
import { ActionButton } from '../../containers/Auth';
import history from '../../utils/history';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { yupValidators } from '../../utils/validate';
import { loginGoogleAction, logIntoAccountAction } from '../../containers/Auth/actions';
import GoogleButton from '../GoogleButton/google-button';
import { GoogleActionType } from '../../containers/Auth/reducer.types';
import useQuery from '../../hooks/useQuery';
import { writeToStorage } from '../../utils/storage';

const Wrapper = styled.div``;

const registerSchema = yup.object().shape({
  email: yupValidators.email,
  password: yup
    .string()
    .min(5, 'Le mot de passe doit comporter au moins 5 caractères')
    .matches(/^\S+$/, "Aucun espace n'est autorisé")
    .required(),
});
function LoginForm(props: LoginFormProps) {
  const query = useQuery();
  const { logIntoAccount, loginGoogle } = props;
  const location = useLocation();
  const { register, handleSubmit, watch, errors } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const [opened, setOpened] = useState(false);
  const navigate = (path) => {
    setOpened(false);
    history.replace(path, {
      background: location?.state?.background,
    });
  };

  useEffect(() => {
    const gIdToken = query.get('gIdToken');
    if (gIdToken) {
      onGoogleResponse({
        gIdToken,
      });
    }
  }, []);

  const onSubmit = (data) => logIntoAccount(data);

  const onGoogleResponse = (data) => {
    loginGoogle({ tokenId: data?.gIdToken });
  };

  const responseGoogle = (data) => {
    console.log(data);
    loginGoogle({ tokenId: data?.tokenId });
  };

  const saveFormToLocalStorage = () => {
    writeToStorage('googleAuthData', {
      authType: GoogleActionType.login,
    });
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          redesigned
          inputProps={{ ref: register, name: 'email' }}
          labelName={messages.Email}
          error={errors.email?.message}
          type="email"
        />
        <Input
          redesigned
          inputProps={{ ref: register, name: 'password' }}
          labelName={messages.Password}
          type="password"
          error={errors.password?.message}
          secured
        />
        <Label
          labelName={messages.forgotPassword}
          onClick={() => navigate('/auth/resetPassword')}
        />
        <ActionButton disableOnFetch outline value="Connexion" />
      </form>
      <div style={{ marginBottom: 15 }}>
        <GoogleButton onClick={saveFormToLocalStorage} actionType={GoogleActionType.login} />
      </div>

      <Label label={'Avez-vous un compte b2b ?'} onClick={() => navigate('/b2b/log-in')} />
      <Label
        label={'Avez-vous un compte à la bibliothèque ?'}
        onClick={() => navigate('/libraries/log-in')}
      />
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    logIntoAccount: (data) => dispatch(logIntoAccountAction(data)),
    loginGoogle: (data) => dispatch(loginGoogleAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(LoginForm);

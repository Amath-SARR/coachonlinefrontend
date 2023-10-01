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
import './style.css';

const Wrapper = styled.div`margin-left:-80px; `;

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
          placeholder='Email'
        />
        <Input
          redesigned
          inputProps={{ ref: register, name: 'password' }}
          labelName={messages.Password}
          type="password"
          error={errors.password?.message}
          secured
          placeholder='Password'
        />
        <Label className="labelForgotPW"
          labelName={messages.forgotPassword}
          onClick={() => navigate('/auth/resetPassword')}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
        </svg>

        <ActionButton color="with" background="#FF0080" value="SE CONNECTER" />
      </form>
      <p style={{marginLeft:'150px'}}>ou</p>
      <div style={{ marginBottom: 15 }}>
        <GoogleButton onClick={saveFormToLocalStorage} actionType={GoogleActionType.login} />
      </div>
      {/* <Label
          labelName="S'inscrire"
          onClick={() => navigate('/auth/register/student')}
        /> */}

      {/* <Label label={'Avez-vous un compte ?'} onClick={() => navigate('/auth/register/student') } />
      <Label
        label={'Avez-vous un compte à la bibliothèque ?'}
        onClick={() => navigate('/libraries/log-in')}
      /> */}
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

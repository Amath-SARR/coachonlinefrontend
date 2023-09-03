/**
 *
 * CredentialsForm
 *
 */

import React, { createRef, useRef, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import makeSelectAuth from '../../containers/Auth/selectors';
import Input from '../Input';
import messages from '../messages';
import InputSubmit from '../InputSubmit';
import { updateEmailAction, updatePasswordAction } from '../../containers/Auth/actions';
import Button from '../Button';
import { Text } from '../../global-styles';
import { yupValidators } from '../../utils/validate';
import { colors } from '../../utils/colors';

const Wrapper = styled.div``;
const ChangeEmailButton = styled(Button)``;

const registerSchema = yup.object().shape({
  oldPassword: yupValidators.password,
  newPassword: yupValidators.password,
  newPasswordRepeat: yupValidators.confirm_password,
});

const registerEmailSchema = yup.object().shape({
  email: yupValidators.email,
});

function CredentialsForm({
  auth,
  updatePassword,
  updateEmail,
  colorScheme = 'light',
  redesigned = true,
}) {
  const [emailEditable, setEmailEditable] = useState(false);
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    errors: errorsPassword,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    errors: errorsEmail,
  } = useForm({
    resolver: yupResolver(registerEmailSchema),
  });

  const onSubmitPassword = (data) => updatePassword(data);

  const onSubmitEmail = (data) => {
    updateEmail(data);
    setEmailEditable(false);
  };

  const { email, socialLogin } =
    (auth.userInfo?.userRole === 'COACH' ? auth.userDataFetched : auth.studentData) || {};

  const Submit = (props) => {
    const { value, style, disableOnFetch, disabled, disableReason } = props;
    return (
      <>
        {!!disableReason && <Text>{disableReason}</Text>}
        <InputSubmit
          background={redesigned ? colors.mainGreen : colors.mainPink}
          color={redesigned ? colors.black : colors.white}
          disabled={disabled}
          value={value}
          style={style}
          disableOnFetch={disableOnFetch}
        />
      </>
    );
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
        <Input
          redesigned={redesigned}
          colorScheme={colorScheme}
          inputProps={{
            ref: registerPassword,
            name: 'oldPassword',
            defaultValue: '',
          }}
          labelName={messages.currentPassword}
          error={errorsPassword?.oldPassword?.message}
          type="password"
        />
        <Input
          redesigned={redesigned}
          colorScheme={colorScheme}
          inputProps={{
            ref: registerPassword,
            name: 'newPassword',
            defaultValue: '',
          }}
          labelName={messages.newPassword}
          error={errorsPassword?.newPassword?.message}
          type="password"
        />
        <Input
          redesigned={redesigned}
          colorScheme={colorScheme}
          inputProps={{
            ref: registerPassword,
            name: 'newPasswordRepeat',
            defaultValue: '',
          }}
          labelName={messages.newPasswordRepeat}
          error={errorsPassword?.newPasswordRepeat?.message}
          type="password"
        />
        <Submit
          disabled={socialLogin}
          disableReason={
            'Vous ne pouvez pas changer votre mot de passe parce que vous êtes connecté avec un service externe.'
          }
          value={'Changer mon mot de passe'}
          style={{ marginBottom: '10px', flex: 1 }}
        />
      </form>
      <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
        <Input
          redesigned={redesigned}
          colorScheme={colorScheme}
          inputProps={{
            ref: registerEmail,
            name: 'email',
            defaultValue: email,
            readOnly: !emailEditable,
            id: 'emailInput',
          }}
          labelName={messages.Email}
          error={errorsEmail?.email?.message}
          type="email"
        />
        {emailEditable ? (
          <Submit
            disabled={socialLogin}
            disableReason={
              'Vous ne pouvez pas modifier votre adresse électronique parce que vous êtes connecté à un service externe.'
            }
            value={'Confirmer'}
            disableOnFetch
            style={{ marginBottom: '10px', flex: 1 }}
          />
        ) : (
          <ChangeEmailButton
            color={redesigned ? 'green' : 'pink'}
            onClick={() => {
              setEmailEditable(true);
              document.querySelector('#emailInput')?.focus();
            }}
          >
            Modifier mon adresse email
          </ChangeEmailButton>
        )}
      </form>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updatePassword: (data) => dispatch(updatePasswordAction(data)),
    updateEmail: (data) => dispatch(updateEmailAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CredentialsForm);

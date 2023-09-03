/**
 *
 * CreateAccountForm
 *
 */

import React from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { CreateAccountFormProps } from './index.props';
import InputSubmit from '../InputSubmit';
import messages from '../messages';
import Input from '../Input';
import { yupValidators } from '../../utils/validate';

const Form = styled.form``;
const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  bottom: 50px;
`;

const registerSchema = (fields: string[]) => {
  const { email, password, confirm_password } = yupValidators;
  return yup.object().shape({
    email: fields.includes('email') ? email : yup.string(),
    password: fields.includes('password') ? password : yup.string(),
    repeatPassword: fields.includes('passwordRepeat') ? confirm_password : yup.string(),
    isCoach: yup.boolean(),
  });
};

function CreateAccountForm(props: CreateAccountFormProps) {
  const {
    fields = ['email', 'password', 'repeatPassword'],
    defaultValues = {},
    onSubmit,
    submitLabel,
    labels = {},
  } = props;
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(registerSchema(fields)),
  });
  const submit = (data: any) => {
    console.log('Submitting form', data);
    onSubmit(data);
  };
  return (
    <Form onSubmit={handleSubmit(submit)}>
      {fields.includes('email') && (
        <Input
          redesigned
          inputProps={{ ref: register, name: 'email', defaultValue: defaultValues?.email }}
          labelName={!labels.email && messages.Email}
          label={labels.email}
          error={errors.email?.message}
        />
      )}
      {fields.includes('login') && (
        <Input
          redesigned
          inputProps={{ ref: register, name: 'login', defaultValue: defaultValues?.login }}
          labelName={!labels.login && messages.login}
          label={labels.login}
          error={errors.login?.message}
        />
      )}
      {fields.includes('password') && (
        <Input
          redesigned
          inputProps={{ ref: register, name: 'password', defaultValue: defaultValues?.password }}
          labelName={!labels.password && messages.Password}
          label={labels.password}
          type="password"
          error={errors.password?.message}
          secured
        />
      )}
      {(fields.includes('repeatPassword') || fields.includes('repeat')) && (
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: fields.includes('repeat') ? 'repeat' : 'repeatPassword',
            defaultValue: defaultValues?.[fields.includes('repeat') ? 'repeat' : 'repeatPassword'],
          }}
          labelName={!labels.repeatPassword && messages.PasswordRepeat}
          label={labels.repeatPassword}
          type="password"
          error={errors[fields.includes('repeat') ? 'repeat' : 'repeatPassword']?.message}
          secured
        />
      )}
      {fields.includes('firstName') && (
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'firstName',
            defaultValue: defaultValues?.firstName,
          }}
          labelName={!labels.firstName && messages.firstName}
          label={labels.firstName}
          error={errors.name?.firstName}
        />
      )}
      {fields.includes('lastName') && (
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'lastName',
            defaultValue: defaultValues?.lastName,
          }}
          labelName={!labels.lastName && messages.Surname}
          label={labels.lastName}
          error={errors.name?.lastName}
        />
      )}
      {fields.includes('phoneNo') && (
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'phoneNo',
            defaultValue: defaultValues?.phoneNo,
          }}
          labelName={!labels.phoneNo && messages.phoneNo}
          label={labels.phoneNo}
          error={errors.phoneNo?.message}
        />
      )}
      <ButtonsWrapper>
        <InputSubmit value={submitLabel || "S'inscrire en tant que abonné"} />
      </ButtonsWrapper>
    </Form>
  );
}

export default CreateAccountForm;

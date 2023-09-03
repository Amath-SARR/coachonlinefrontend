/**
 *
 * RegisterForm
 *
 */

import React, { memo, useEffect, useState } from 'react';
import RegisterFormProps from './register-form.props';
import styled from 'styled-components';
import Input from '../Input';
import messages from '../messages';
import { Controller, useForm } from 'react-hook-form';
import SelectInput from '../SelectInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { yupValidators } from '../../utils/validate';
import * as yup from 'yup';
import { colors } from '../../utils/colors';
import { GoogleActionType, UserRole } from '../../containers/Auth/reducer.types';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import { toast } from 'react-toastify';
import InputSubmit from '../InputSubmit';
import { Text } from '../../global-styles';
import { createStructuredSelector } from 'reselect';
import makeSelectAuth from '../../containers/Auth/selectors';
import makeSelectLibraries from '../../containers/Libraries/selectors';
import {
  createAccountAction,
  createAccountGoogleAction,
  getAffiliateHostAction,
  loginGoogleAction,
  logIntoAccountSuccess,
} from '../../containers/Auth/actions';
import {
  getInstitutionAction,
  getProfessionsAction,
  registerForInstitutionAction,
} from '../../containers/Libraries/actions';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import CheckBox from '../CheckBox';
import { Link, useParams } from 'react-router-dom';
import { ContractsTypes } from '../../store/contracts/contracts.types';
import GoogleButton from '../GoogleButton/google-button';
import useQuery from '../../hooks/useQuery';
import states from './french-states.json';
import countries from './countries.json';

const Wrapper = styled.div`
  // background: white;
  // width: 100%;
`;
const CheckBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
`;
const PolicyLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
  color: ${(props) => (props.isCoach ? colors.mainPink : colors.lilac)};
`;
const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  bottom: 20px;
`;
const Subtitle = styled.p`
  font-size: 10px;
  color: ${colors.lilac};
  margin-bottom: 8px;
  margin-top: -5px;
`;

const registerSchema = (isLibrary) => {
  const { email, password, confirm_password, min2chars } = yupValidators;
  const yearOfBirthMessage = "L'année de naissance doit être un nombre compris entre 1920 et 2009.";
  const requiredMessage = 'Le champ doit être complété';
  return yup.object().shape({
    email,
    password,
    confirm_password,
    firstName: yup.string().required(requiredMessage),
    lastName: yup.string().required(requiredMessage),
    phoneNo: yup.string().required(requiredMessage),
    profession: isLibrary ? yup.mixed().required(requiredMessage) : yup.mixed(),
    gender: isLibrary ? yup.mixed().required(requiredMessage) : yup.mixed(),
    // country: isLibrary ? yup.mixed().required(requiredMessage) : yup.mixed(),
    region: isLibrary ? yup.mixed().required(requiredMessage) : yup.mixed(),
    city: isLibrary ? min2chars : yup.string(),
    yearOfBirth: isLibrary
      ? yup
          .number()
          .typeError(yearOfBirthMessage)
          .min(1920, yearOfBirthMessage)
          .max(2009, yearOfBirthMessage)
          .required(yearOfBirthMessage)
      : yup.number(),
    isCoach: yup.boolean(),
  });
};
function RegisterForm(props: RegisterFormProps) {
  const { accountType } = useParams();
  const query = useQuery();
  const {
    libraryState,
    createAccount,
    registerWithInstitution,
    libraries,
    submitLabel,
    accountType: accountTypeProp,
    createAccountGoogle,
    loginGoogle,
  } = props;
  const isCoach = (accountTypeProp || accountType) === 'coach';
  const { register, handleSubmit, errors, control, getValues } = useForm({
    resolver: yupResolver(registerSchema(libraryState)),
  });
  const [allAgreementsAccepted, setAllAgreementsAccepted] = useState(false);
  const [agreements, setAgreements] = useState({
    contract: !isCoach,
    salesConditions: false,
    termsOfUse: false,
    privacyPolicy: false,
    commercialOffers: false,
  });

  useEffect(() => {
    const gIdToken = query.get('gIdToken');
    if (gIdToken) {
      const registerData = readFromStorage('googleAuthData') || {};
      onGoogleResponse({
        ...registerData,
        gIdToken,
      });
    }
  }, []);

  const handleAgreementToggle = (key, value) => {
    const nextState = { ...agreements, [key]: value };
    setAgreements(nextState);
    let allAccepted = true;
    Object.keys(nextState).forEach((objectKey) => {
      if (!nextState[objectKey]) {
        allAccepted = false;
      }
    });
    setAllAgreementsAccepted(allAccepted);
  };

  const handleToggleAll = (value) => {
    setAllAgreementsAccepted(value);
    const changedAgreements = {};
    Object.keys(agreements).forEach((key) => {
      changedAgreements[key] = value;
    });
    if (!value) {
      changedAgreements.contract = !isCoach;
    }
    setAgreements(changedAgreements);
  };

  const onSubmit = (data) => {
    if (libraryState) {
      registerWithInstitution({
        body: {
          ...data,
          secret: data.password,
          repeatPassword: data.confirm_password,
          libraryId: libraries.institutionData.id,
        },
      });
      return;
    }
    createAccount({
      ...data,
      isCoach,

      affiliateLink: getAffiliationToken(isCoach),
      onSuccess: onRegisterSuccess,
    });
    console.log(data);
  };

  const onRegisterSuccess = (response) => {
    resetAffiliationToken();
    // loginSuccess(response);
    toast.success('Votre inscription a bien été prise en compte !');
  };

  const getAffiliationToken = (isCoach: boolean) => {
    if (isCoach) {
      const token = readFromStorage('coachAffiliationToken') || query.get('Ref');
      console.log('Coach affiliation token', token);
      return token;
    }
    const token = readFromStorage('affiliationToken') || query.get('Join');
    console.log('Student affiliation token', token);
    return token;
  };

  const resetAffiliationToken = () =>
    writeToStorage(isCoach ? 'coachAffiliationToken' : 'affiliationToken', null);

  const onGoogleResponse = (data) => {
    const { role, affiliateLink, gIdToken } = data;
    if (!data.error) {
      const payload = {
        tokenId: gIdToken,
        role,
        affiliateLink,
      };
      if (libraryState) {
        console.log(libraries);
        const { profession, gender, yearOfBirth } = getValues();
        payload.role = UserRole['INSTITUTION_STUDENT'];
        payload.libraryId = libraries.institutionData.id;
        payload.professionId = profession?.value;
        payload.gender = gender?.value;
        payload.yearOfBirth = yearOfBirth;
      }
      createAccountGoogle({
        data: payload,
        actions: {
          onSuccess: () => {
            loginGoogle({ tokenId: data?.gIdToken });
            resetAffiliationToken();
          },
        },
      });
    }
  };

  const saveFormToLocalStorage = () => {
    writeToStorage('googleAuthData', {
      authType: GoogleActionType.register,
      values: getValues(),
      role: UserRole[(accountTypeProp || accountType)?.toUpperCase()],
      affiliateLink: getAffiliationToken(isCoach),
    });
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          redesigned
          inputProps={{ ref: register, name: 'firstName' }}
          labelName={messages.firstName}
          error={errors.firstName?.message}
        />
        <Input
          redesigned
          inputProps={{ ref: register, name: 'lastName' }}
          label={'Nom'}
          error={errors.lastName?.message}
        />
        <Input
          redesigned
          inputProps={{ ref: register, name: 'phoneNo' }}
          labelName={messages.phoneNo}
          error={errors.phoneNo?.message}
        />
        <Input
          redesigned
          inputProps={{ ref: register, name: 'email' }}
          labelName={messages.Email}
          error={errors.email?.message}
        />
        <Input
          redesigned
          inputProps={{ ref: register, name: 'password' }}
          labelName={messages.Password}
          type="password"
          error={errors.password?.message}
          secured
        />
        <Subtitle>
          * Utilisez au moins cinq caractères avec des lettres, au moins 1 majuscule, 1 chiffre et 1
          symbole.
        </Subtitle>
        <Input
          redesigned
          inputProps={{ ref: register, name: 'confirm_password' }}
          labelName={messages.PasswordRepeat}
          type="password"
          error={errors.confirm_password?.message}
          secured
        />
        {libraryState && (
          <>
            <Controller
              redesigned
              name="profession"
              error={errors?.profession?.message}
              control={control}
              options={libraries.professions?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              labelName={messages.profession}
              as={SelectInput}
            />
            <Controller
              redesigned
              name="gender"
              control={control}
              options={[
                { value: 'Male', label: 'Homme' },
                { value: 'Female', label: 'Femme' },
              ]}
              labelName={messages.Gender}
              error={errors.gender?.message}
              as={SelectInput}
            />
            <Input
              redesigned
              inputProps={{ ref: register, name: 'city' }}
              label={'City'}
              error={errors.city?.message}
            />
            <Controller
              redesigned
              name="region"
              control={control}
              options={states}
              label={'State'}
              error={errors.state?.message}
              as={SelectInput}
            />
            {/*<Controller*/}
            {/*  redesigned*/}
            {/*  name="country"*/}
            {/*  control={control}*/}
            {/*  options={countries.map((item) => ({*/}
            {/*    label: item.name,*/}
            {/*    value: item.name.toLowerCase(),*/}
            {/*  }))}*/}
            {/*  label={'Country'}*/}
            {/*  error={errors.country?.message}*/}
            {/*  as={SelectInput}*/}
            {/*/>*/}
            <Input
              redesigned
              inputProps={{
                ref: register,
                name: 'yearOfBirth',
                type: 'number',
              }}
              labelName={messages.birthDate}
              type="number"
              error={errors.yearOfBirth?.message}
            />
          </>
        )}

        <CheckBoxWrapper>
          <CheckBox
            accent={isCoach ? colors.mainPink : colors.mainGreen}
            label={"J'accepte toutes les conditions"}
            onChange={() => handleToggleAll(!allAgreementsAccepted)}
            checked={allAgreementsAccepted}
          />
          {isCoach && (
            <CheckBox
              accent={isCoach ? colors.mainPink : colors.mainGreen}
              label={
                <span>
                  J'accepte le{' '}
                  <PolicyLink
                    isCoach={isCoach}
                    target={'_blank'}
                    to={`/articles/contracts/${ContractsTypes.Agreement}`}
                  >
                    contrat
                  </PolicyLink>
                </span>
              }
              onChange={(val) => handleAgreementToggle('contract', val)}
              checked={agreements.contract}
            />
          )}
          <CheckBox
            accent={isCoach ? colors.mainPink : colors.mainGreen}
            label={
              <span>
                J'accepte les{' '}
                <PolicyLink
                  isCoach={isCoach}
                  target={'_blank'}
                  to={`/articles/contracts/${ContractsTypes.GeneralConditionsOfUsage}`}
                >
                  Conditions Générales de Vente
                </PolicyLink>
              </span>
            }
            onChange={(val) => handleAgreementToggle('salesConditions', val)}
            checked={agreements.salesConditions}
          />
          <CheckBox
            accent={isCoach ? colors.mainPink : colors.mainGreen}
            label={
              <span>
                J'accepte les{' '}
                <PolicyLink
                  isCoach={isCoach}
                  target={'_blank'}
                  to={`/articles/contracts/${ContractsTypes.TermsAndConditions}`}
                >
                  Conditions Générales d'Utilisations
                </PolicyLink>
              </span>
            }
            onChange={(val) => handleAgreementToggle('termsOfUse', val)}
            checked={agreements.termsOfUse}
          />
          <CheckBox
            accent={isCoach ? colors.mainPink : colors.mainGreen}
            label={
              <span>
                J'accepte la{' '}
                <PolicyLink
                  isCoach={isCoach}
                  target={'_blank'}
                  to={`/articles/contracts/${ContractsTypes.PrivacyPolicy}`}
                >
                  Politique de Confidentialité
                </PolicyLink>
              </span>
            }
            onChange={(val) => handleAgreementToggle('privacyPolicy', val)}
            checked={agreements.privacyPolicy}
          />
          <CheckBox
            accent={isCoach ? colors.mainPink : colors.mainGreen}
            label={
              // 'En indiquant votre adresse mail, vous acceptez de recevoir des offres commerciales de notre part. Vous pouvez vous désinscrire à tout moment en nous adressant un mail et à travers les liens de désinscription'
              'En indiquant votre adresse mail, vous acceptez de recevoir des offres commerciales de notre part. Vous pouvez vous désinscrire à tout moment grâce aux liens de désinscription'
            }
            onChange={(val) => handleAgreementToggle('commercialOffers', val)}
            checked={agreements.commercialOffers}
          />
        </CheckBoxWrapper>
        <ButtonsWrapper>
          <InputSubmit
            style={{ width: '100%' }}
            disableOnFetch
            outline
            disabled={!allAgreementsAccepted}
            background={isCoach ? colors.mainPink : colors.mainGreen}
            color={isCoach ? colors.white : colors.black}
            value={submitLabel}
          />
        </ButtonsWrapper>
      </form>
      <div>
        <Text style={{ margin: 10, textAlign: 'center' }}>ou</Text>
        <GoogleButton
          onClick={saveFormToLocalStorage}
          actionType={GoogleActionType.register}
          disabled={!allAgreementsAccepted}
        />
      </div>
    </Wrapper>
  );
}
const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  libraries: makeSelectLibraries(),
});

function mapDispatchToProps(dispatch) {
  return {
    createAccount: (data) => dispatch(createAccountAction(data)),
    createAccountGoogle: (data) => dispatch(createAccountGoogleAction(data)),
    loginSuccess: (data) => dispatch(logIntoAccountSuccess(data)),
    loginGoogle: (data) => dispatch(loginGoogleAction(data)),
    getAffiliateHost: (token) => dispatch(getAffiliateHostAction(token)),
    getProfessions: () => dispatch(getProfessionsAction()),
    getInstitutionInfo: (data) => dispatch(getInstitutionAction(data)),
    registerWithInstitution: (data) => dispatch(registerForInstitutionAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(RegisterForm);

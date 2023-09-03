/**
 *
 * SubscriptionChoicePage
 *
 */

import React, { memo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from '@reduxjs/toolkit';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import messages from '../messages';
import generalMessages from '../../../components/messages';
import {
  createSetupIntentAction,
  getSubscriptionTypesAction,
  selectSubscriptionAction,
  setDefaultPaymentMethodAction,
  setSetupIntentSecretAction,
} from '../actions';
import makeSelectAuth from '../../Auth/selectors';
import makeSelectSubscription from '../selectors';
import Input from '../../../components/Input';
import { updateUserDataAction } from '../../Auth/actions';
import Button, { ButtonsWrapper } from '../../../components/Button';
import makeSelectHomePage from '../../HomePage/selectors';
import { setLoadingAction } from '../../HomePage/actions';
import SelectInput from '../../../components/SelectInput';
import { countries, stripeCountries } from '../../../utils/countries';
import useQuery from '../../../hooks/useQuery';
import { ModalInnerWrapper, ModalSubtitle, ModalTitle } from '../../../components/Modal';
import history from '../../../utils/history';
import SubscriptionShortBox from '../../../components/SubscriptionShortBox/subscription-short-box';
import { yupValidators } from '../../../utils/validate';

export const InnerWrapper = styled(ModalInnerWrapper)`
  max-width: 600px;
`;

const Header = styled(ModalTitle)``;
const SubHeader = styled(ModalSubtitle)``;
const InputColumns = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 15px;
  border-radius: 10px;
  margin: 10px 0;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    padding: 20px 0;
  }
`;

const userDataSchema = yup.object().shape({
  firstName: yupValidators.min2chars,
  lastName: yupValidators.min2chars,
  phoneNo: yupValidators.phoneNo,
  country: yup.object().pick(['value']).nullable().required(),
  city: yupValidators.min2chars,
  postalCode: yupValidators.min2chars,
});

export function ProfileDataForBillingPage({
  subscription,
  auth,
  updateUserData,
  getSetupClientSecret,
  clearSetupClientSecret,
  setLoading,
}) {
  const query = useQuery();
  const formRef = useRef();
  const { register, handleSubmit, errors, control } = useForm({
    resolver: yupResolver(userDataSchema),
  });

  const userData = auth.userInfo?.userRole === 'COACH' ? auth.userDataFetched : auth.studentData;

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    !subscription.setupClientSecret && getSetupClientSecret();
  }, [subscription.setupClientSecret]);

  useEffect(() => () => clearSetupClientSecret(), []);

  const onSubmit = (data) => {
    const subscriptionId = query.get('subscriptionId');
    const redirectTo = !subscriptionId
      ? 'billingDetails'
      : `billingDetails?subscriptionId=${subscriptionId}`;
    updateUserData({
      ...data,
      redirectTo,
      subscriptionId,
      ...subscription.selected,
    });
  };

  const userCountry = countries?.filter(
    (country) => country.value === userData?.country,
  )?.[0];
  return (
    <InnerWrapper>
      <Header>Détails de la facturation (étape 1/2)</Header>
      <SubHeader>
        {subscription.activeSubscription?.id ? 'Vérifiez ' : 'Remplissez '} les informations de
        votre profil qui seront utilisées pour les factures de l'abonnement. Vous ajouterez les
        informations de votre carte lors de l'étape suivante.
      </SubHeader>
      {!!query.get('subscriptionId') && (
        <SubscriptionShortBox subscription={subscription.selected} />
      )}
      <InputColumns>
        <div style={{ flex: 1, padding: '0 15px' }}>
          <form style={{ display: 'flex' }} ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            <InputColumns>
              <Input
                redesigned
                inputProps={{
                  ref: register,
                  name: 'firstName',
                  defaultValue: userData.firstName,
                }}
                labelName={generalMessages.firstName}
                error={errors?.firstName?.message}
              />
              <Input
                redesigned
                inputProps={{
                  ref: register,
                  name: 'lastName',
                  defaultValue: userData.lastName,
                }}
                labelName={generalMessages.Surname}
                error={errors?.lastName?.message}
              />
              <Input
                redesigned
                colorScheme="dark"
                inputProps={{
                  ref: register,
                  name: 'phoneNo',
                  defaultValue: auth.studentData.phoneNo,
                  type: 'tel',
                }}
                labelName={generalMessages.phoneNo}
                error={errors?.phoneNo?.message}
              />
              <Controller
                redesigned
                wrapperStyle={{ width: '100%' }}
                name="country"
                error={errors?.country?.message}
                control={control}
                options={countries}
                labelName={generalMessages.country}
                defaultValue2={userCountry}
                defaultValue={userCountry}
                placeholderProp="--Sélectionnez votre pays--"
                as={SelectInput}
              />
            </InputColumns>
            <InputColumns>
              <Input
                redesigned
                inputProps={{
                  ref: register,
                  name: 'address',
                  defaultValue: userData.address,
                }}
                labelName={generalMessages.address}
                error={errors?.address?.message}
              />
              <Input
                redesigned
                inputProps={{
                  ref: register,
                  name: 'city',
                  defaultValue: userData.city,
                }}
                labelName={generalMessages.City}
                error={errors?.city?.message}
              />
              <Input
                redesigned
                inputProps={{
                  ref: register,
                  name: 'postalCode',
                  defaultValue: userData.postalCode,
                }}
                labelName={generalMessages.postalCode}
                error={errors?.postalCode?.message}
              />
            </InputColumns>
          </form>
        </div>
      </InputColumns>
      <ButtonsWrapper column>
        <Button
          style={{
            width: 'fit-content',
            padding: '10px 20px',
            margin: '10px 0',
          }}
          showLoader
          color="green"
          onClick={() => formRef.current?.dispatchEvent(new Event('submit'))}
        >
          Continuer
        </Button>
        <Button disableOnFetch color="transparent" onClick={() => history.goBack()}>
          Retour
        </Button>
      </ButtonsWrapper>
    </InnerWrapper>
  );
}

ProfileDataForBillingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subscription: makeSelectSubscription(),
  auth: makeSelectAuth(),
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getSubscriptionPlans: () => dispatch(getSubscriptionTypesAction()),
    selectSubscription: (data) => dispatch(selectSubscriptionAction(data)),
    updateUserData: (data) => dispatch(updateUserDataAction(data)),
    getSetupClientSecret: () => dispatch(createSetupIntentAction()),
    clearSetupClientSecret: () => dispatch(setSetupIntentSecretAction({})),
    setDefaultPaymentMethod: (data) => dispatch(setDefaultPaymentMethodAction(data)),
    setLoading: (isLoading) => dispatch(setLoadingAction(isLoading)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ProfileDataForBillingPage);

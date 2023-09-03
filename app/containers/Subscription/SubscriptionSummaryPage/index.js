/**
 *
 * StudentVerificationPage
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import messages from '../messages';
import makeSelectSubscription from '../selectors';
import Button from '../../../components/Button';
import makeSelectAuth from '../../Auth/selectors';
import { ModalInnerWrapper, ModalSubtitle, ModalTitle } from '../../../components/Modal';
import history from '../../../utils/history';
import { colors } from '../../../utils/colors';
import { FlexColumn, FlexRow, Text } from '../../../global-styles';
import SubscriptionCard from '../../../components/SubscriptionCard';
import { localizeCurrency } from '../../../utils/localize';
import { applySubscriptionAction, selectSubscriptionAction } from '../actions';

export const InnerWrapper = styled(ModalInnerWrapper)`
  max-width: 800px;
`;
const Header = styled(ModalTitle)``;
const SubHeader = styled(ModalSubtitle)`
  margin-bottom: 30px;
`;
const InputsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 45px;
  width: 100%;
  max-width: 900px;
  @media screen and (max-width: 820px) {
    flex-direction: column;
    justify-content: unset;
    align-items: center;
  }
`;
const Column = styled(FlexColumn)`
  max-width: 450px;
  margin-left: 20px;
  @media screen and (max-width: 820px) {
    margin-left: 0;
  }
`;
export const DataRow = styled(FlexRow)`
  align-items: center;
  justify-content: space-between;
  max-width: 500px;
  width: 100%;
`;
export const Label = styled(Text)`
  font-size: 14px !important;
  font-weight: 400;
  word-break: keep-all;
`;
export const Value = styled(Text)`
  text-align: right;
  padding: 0 5px;
  font-size: 21px !important;
  font-weight: 700;
  min-width: 53px;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 10px;
`;
const StyledButton = styled(Button)`
  width: fit-content;
  margin: 10px auto 25px auto;
`;
export function SubscriptionSummaryPage({
  subscription,
  confirmSubscription,
  setSelectedSubscription,
}) {
  const onConfirmSubscription = () => {
    confirmSubscription({
      ...subscription.selected,
      userHasPreviousSubscriptions: subscription?.activeSubscription?.id,
      onSuccess: () => {
        setSelectedSubscription(null);
      },
    });
  };

  const onPaymentChange = () => {
    history.replace(`/subscription/profileDetails?subscriptionId=${subscription.selected?.id}`);
  };
  const onPlanChange = () => {
    history.replace(`/subscription/subscriptionChoice?subscriptionId=${subscription.selected?.id}`);
  };

  const planName =
    subscription.selected?.name &&
    messages[`${subscription.selected?.name?.split(' ')?.join('')?.toLowerCase()}Plan`];

  return (
    <InnerWrapper>
      <Header>
        Confirmez votre choix d'abonnement <br />
        (vous pourrez arrêter votre abonnement à tout moment sans frais)
      </Header>
      <SubHeader>
        Veuillez vérifier les détails de votre choix d'abonnement. Grâce à l'abonnement, vous
        recevrez un accès illimité à tous les cours de la plateforme.
      </SubHeader>
      <InputsWrapper>
        <SubscriptionCard
          item={subscription.selected}
          onSubscriptionSelect={null}
          isSelected
          selectedCard={subscription.selected}
        />

        <Column>
          <DataRow>
            <Label>Marque</Label>
            <Value>{subscription.cardInfo?.card?.brand}</Value>
          </DataRow>
          <DataRow>
            <Label>Numéro de carte</Label>
            <Value>**** **** **** {subscription.cardInfo?.card?.last4Digits}</Value>
          </DataRow>
          <DataRow>
            <Label>Valable jusqu'au</Label>
            <Value>{subscription.cardInfo?.card?.validTo}</Value>
          </DataRow>
          <StyledButton outline color={'green'} disableOnFetch onClick={onPaymentChange}>
            Modifier les informations de paiement
          </StyledButton>
          <DataRow>
            <Label>Abonnement</Label>
            <Value>{planName && <FormattedMessage {...planName} />}</Value>
          </DataRow>
          <DataRow>
            <Label>Prix</Label>
            <Value>
              {localizeCurrency(
                !!subscription.selected?.promotionalPrice
                  ? subscription.selected?.promotionalPrice
                  : subscription.selected?.price?.amount,
              )}
            </Value>
          </DataRow>
          <StyledButton outline color={'green'} disableOnFetch onClick={onPlanChange}>
            Changement d'abonnement
          </StyledButton>
          <ButtonsWrapper>
            <StyledButton color="green" showLoader onClick={onConfirmSubscription}>
              Confirmer et payer
            </StyledButton>
          </ButtonsWrapper>
        </Column>
      </InputsWrapper>
    </InnerWrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  subscription: makeSelectSubscription(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    confirmSubscription: (data) => dispatch(applySubscriptionAction(data)),
    setSelectedSubscription: (data) => dispatch(selectSubscriptionAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(SubscriptionSummaryPage);

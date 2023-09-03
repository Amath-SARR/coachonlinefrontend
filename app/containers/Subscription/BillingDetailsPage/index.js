/**
 *
 * SubscriptionChoicePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import messages from '../messages';
import {
  createSetupIntentAction,
  getSubscriptionTypesAction,
  selectSubscriptionAction,
  setDefaultPaymentMethodAction,
  setSetupIntentSecretAction,
} from '../actions';
import makeSelectAuth from '../../Auth/selectors';
import makeSelectSubscription from '../selectors';
import { updateUserDataAction } from '../../Auth/actions';
import { STRIPE_PK } from '../../../config/env';
import Button, { ButtonsWrapper } from '../../../components/Button';
import makeSelectHomePage from '../../HomePage/selectors';
import { setLoadingAction } from '../../HomePage/actions';
import StripeForm from './stripeForm';
import useQuery from '../../../hooks/useQuery';
import { readFromStorage } from '../../../utils/storage';
import { ModalInnerWrapper, ModalSubtitle, ModalTitle } from '../../../components/Modal';
import history from '../../../utils/history';
import SubscriptionShortBox from '../../../components/SubscriptionShortBox/subscription-short-box';
import AcceptedCardsImg from '../../../images/images/accepted_credit_cards.png';
import { colors } from '../../../utils/colors';
import { FlexRow, Text } from '../../../global-styles';
import { fullName } from '../../../utils/formatters';
import creditCardImg from '../../../images/images/credit-card.svg';
const stripePromise = loadStripe(STRIPE_PK);

export const InnerWrapper = styled(ModalInnerWrapper)`
  max-width: 1600px;
`;

const Header = styled(ModalTitle)``;
const SubHeader = styled(ModalSubtitle)``;
const InputColumns = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  margin: 10px 0;
  width: 100%;
  max-width: 730px;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    padding: 20px 0;
  }
`;
const AcceptedCards = styled.div`
  background: ${colors.white};
  padding: 10px 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Image = styled.img`
  width: 100%;
  max-width: 310px;
  height: auto;
`;
const Row = styled(FlexRow)`
  align-items: center;
  @media screen and (max-width: 860px) {
    flex-direction: column;
  }
`;
const CreditCardWrapper = styled.div`
  position: relative;
  margin: 0 auto 15px auto;
  max-width: 550px;
  @media screen and (max-width: 860px) {
    max-width: 430px;
  }
`;
const CreditCard = styled.img`
  width: 100%;
  height: auto;
`;
const BalanceWrapper = styled.div`
  width: 98%;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 460px) {
    bottom: 10px;
  }
`;

const CardEmail = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  height: 60px;
  position: absolute;
  top: 40%;
  left: 57%;
  width: 260px;
  font-size: 13px;
  color: #00000090;
  transform: translate(-40%, -40%);
  @media screen and (max-width: 410px) {
    left: 1px;
    justify-content: center;
    transform: translate(0%, -40%);
    width: 98%;
  }
`;

export function BillingDetailsPage({
  subscription,
  auth,
  getSetupClientSecret,
  clearSetupClientSecret,
  setDefaultPaymentMethod,
  setLoading,
}) {
  const query = useQuery();

  const [paymentIntent, setPaymentIntent] = useState(null);
  const [stripeFormRef, setStripeFormRef] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    billingName: fullName(auth.studentData),
    cardNumber: null,
    validUntil: '',
    cvc: null,
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    !subscription.setupClientSecret && getSetupClientSecret();
  }, [subscription.setupClientSecret]);

  useEffect(() => () => clearSetupClientSecret(), []);

  const onSubmit = () => {
    const subscriptionId = query.get('subscriptionId');
    const redirectTo = !subscriptionId
      ? '/studentProfile'
      : `summary?subscriptionId=${subscriptionId}`;
    history.push(redirectTo);
    // updateUserData({
    //   ...data,
    //   redirectTo,
    //   subscriptionId,
    //   ...subscription.selected,
    // });
  };

  const onStripeSuccess = (paymentDetails) => {
    /**
       *
       * amount: 200
       canceled_at: null
       cancellation_reason: null
       capture_method: "automatic"
       client_secret: "pi_1IkZ0nBR24jaUNjGPzeZ7o5w_secret_M3TruMpG7Bn8eRI0pteUfypUU"
       confirmation_method: "automatic"
       created: 1619461105
       currency: "pln"
       description: null
       id: "pi_1IkZ0nBR24jaUNjGPzeZ7o5w"
       last_payment_error: null
       livemode: false
       next_action: null
       object: "payment_intent"
       payment_method: "pm_1IkZ1iBR24jaUNjGMWqcnDOH"
       payment_method_types: ["card"]
       0: "card"
       receipt_email: null
       setup_future_usage: "off_session"
       shipping: null
       source: null
       status: "succeeded"
       */
    try {
      console.log('PAYMENT DETAILS', paymentDetails);
      setPaymentIntent(paymentDetails);
      setDefaultPaymentMethod(paymentDetails);
      onSubmit();
    } catch (e) {
      console.warn(e);
    }
  };
  return (
    <InnerWrapper>
      <Header>
        <FormattedMessage {...messages.billingDetailsHeader} /> (étape 2/2)
        <SubHeader>
          Remplissez les détails de la carte qui sera utilisée pour payer l'abonnement. Nous pouvons
          facturer une petite somme d'argent (jusqu'à 1EUR) pour autoriser votre carte de paiement.
        </SubHeader>
        {!!query.get('subscriptionId') && (
          <SubscriptionShortBox subscription={subscription.selected} />
        )}
      </Header>
      <Row>
        <InputColumns>
          <Elements
            stripe={stripePromise}
            style={{ flex: 1, padding: '0 15px', width: '100%' }}
            options={{ locale: readFromStorage('@locale') || 'fr' }}
          >
            <StripeForm
              passRef={(ref) => setStripeFormRef(ref)}
              setLoading={setLoading}
              paymentIntent={paymentIntent}
              billingDetails={auth.studentData}
              clientSecret={subscription.setupClientSecret}
              onSuccess={onStripeSuccess}
            />
          </Elements>
        </InputColumns>
        <InputColumns>
          <CreditCardWrapper>
            <CreditCard src={creditCardImg} alt="Card balance" />
            <CardEmail>{auth.studentData.email}</CardEmail>
            <BalanceWrapper>
              <AcceptedCards>
                <Text
                  style={{
                    color: colors.black,
                    margin: '5px 0',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  Services de paiement fournis par Stripe
                </Text>
                <Image src={AcceptedCardsImg} />
              </AcceptedCards>
            </BalanceWrapper>
          </CreditCardWrapper>
        </InputColumns>
      </Row>
      <ButtonsWrapper column style={{ marginBottom: 20 }}>
        <Button
          style={{
            width: 'fit-content',
            padding: '10px 20px',
            margin: '10px 0',
          }}
          showLoader
          color="green"
          onClick={() => stripeFormRef?.dispatchEvent(new Event('submit'))}
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

BillingDetailsPage.propTypes = {
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

export default compose(withConnect, memo)(BillingDetailsPage);

/**
 *
 * Stripe
 *
 */

import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import messages from '../../containers/BillingPage/messages';
import makeSelectAuth from '../../containers/Auth/selectors';
import SelectInput from '../SelectInput';
import { stripeCountries } from '../../utils/countries';
import Button from '../Button';
import {
  balanceWithdrawAction,
  createStripeAccountAction,
  getFirstStepStripeVerificationUrlAction,
  getSecondStepStripeVerificationUrlAction,
  getStripeConnectedAccountLinkAction,
} from '../../containers/Auth/actions';
import { colors } from '../../utils/colors';
const stripeIcon = require('../../images/icons/stripe.png');

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// const Disclaimer = styled.div`
//   padding: 10px 40px;
//   text-align: center;
//   @media screen and (max-width: 1335px) {
//     padding: 0 10px;
//   }
//   @media screen and (max-width: 1155px) {
//     padding: 0;
//   }
// `;
const StripeStatusWrapper = styled.div`
  display: flex;
  margin: 15px 0;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  @media screen and (max-width: 1300px) {
    justify-content: center;
    text-align: center;
  }
`;
const StripeStatus = styled.div`
  margin-bottom: 15px;
`;
const StripeButton = styled(Button)`
  background-color: #6772e5;
  font-size: 18px;
  font-weight: 500;
  min-width: 350px;
  max-width: 350px;
  padding: 10px 20px;
  margin-bottom: 10px;
  @media screen and (max-width: 1155px) {
    width: fit-content;
    max-width: 200px;
    min-width: 200px;
  }
`;
const StripeOutlineButton = styled(Button)`
  //margin: 10px auto 0 auto;
  border: 2px solid #6772e5;
  background: transparent;
  color: #6772e5 !important;
  max-width: 350px;
  text-transform: uppercase;
  font-size: 18px;
  @media screen and (max-width: 1155px) {
    width: fit-content;
    max-width: 200px;
    min-width: 200px;
  }
`;
const Icon = styled.img`
  width: 36px;
  height: auto;
  border-right: 1px solid #ffffff90;
  margin-right: 10px;
  padding: 0 10px 0 0;
`;
/**
 * STRIPE STATUSES
 * 0 - Not registered in stripe
 * 1 - Not verified
 * 2 - No KYC verification
 * 3 - Verified. Can make payouts
 */
const stripeStatusStyle = [
  { color: 'red' },
  { color: 'orange' },
  { color: 'orange' },
  { color: 'green' },
];

function Stripe({
  auth,
  createStripeAccount,
  redirectToFirstStepSTripeVerification,
  redirectToSecondStepSTripeVerification,
  getStripeConnectedAccountLink,
  makePayout,
}) {
  const [country, setCountry] = useState();

  useEffect(() => {
    getStripeAccountLink();
  }, []);

  const getStripeAccountLink = () => {
    const { expires_at } = auth.stripeConnectedAccountLink || {};
    const linkOutdated = !!expires_at && Date.now() > expires_at * 1000;
    if (!expires_at || linkOutdated) {
      getStripeConnectedAccountLink();
    }
  };

  const goToStripeAccount = (retry = true) => {
    const { url } = auth.stripeConnectedAccountLink || {};
    if (!!url) {
      return window.location.replace(url);
    }
    if (retry) {
      getStripeConnectedAccountLink({ actions: { onSuccess: () => goToStripeAccount(false) } });
    }
  };

  const renderStripeStatusDependentButton = (status) => {
    let action = () => null;
    let label = messages.createStripeAccount;
    switch (status) {
      case 0:
        action = () => {
          if (country) {
            createStripeAccount(country);
          } else {
            toast.info('Sélectionnez un pays');
          }
        };
        label = messages.createStripeAccount;
        break;
      case 1:
        action = redirectToFirstStepSTripeVerification;
        label = messages.verifyStripeAccount;
        break;
      case 2:
        action = redirectToSecondStepSTripeVerification;
        label = messages.verifyStripeKYC;
        break;
      case 3:
        action = makePayout;
        label = messages.payout;
        break;
    }
    return (
      <div>
        {status === 0 && <SelectInput options={stripeCountries} onChange={setCountry} />}
        <StripeButton color="#6772e5" textColor={colors.white} onClick={action}>
          <Icon src={stripeIcon} />
          <FormattedMessage {...label} />
        </StripeButton>
      </div>
    );
  };

  return (
    <Wrapper>
      {/* <Disclaimer>
        <FormattedMessage {...messages.stripeAccountDisclaimer} />
      </Disclaimer> */}
      <StripeStatusWrapper>
        <StripeStatus>
          <FormattedMessage {...messages.stripeStatus} />
          {': '}
          <span style={stripeStatusStyle[auth.userDataFetched.stripeVerificationStatus]}>
            <FormattedMessage
              {...messages[`status${auth.userDataFetched.stripeVerificationStatus}`]}
            />
          </span>
        </StripeStatus>
        {renderStripeStatusDependentButton(auth.userDataFetched.stripeVerificationStatus)}
        <StripeOutlineButton onClick={goToStripeAccount}>
          Voir mon compte Stripe
        </StripeOutlineButton>
      </StripeStatusWrapper>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    createStripeAccount: (country) => dispatch(createStripeAccountAction(country)),
    redirectToFirstStepSTripeVerification: () =>
      dispatch(getFirstStepStripeVerificationUrlAction()),
    redirectToSecondStepSTripeVerification: () =>
      dispatch(getSecondStepStripeVerificationUrlAction()),
    makePayout: () => dispatch(balanceWithdrawAction()),
    getStripeConnectedAccountLink: (data) => dispatch(getStripeConnectedAccountLinkAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Stripe);

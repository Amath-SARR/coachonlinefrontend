/**
 *
 * Paypal
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import messages from '../../containers/BillingPage/messages';
import PaypalButton, { paypalSetup } from '../PaypalButton';
import makeSelectAuth from '../../containers/Auth/selectors';
import {
  getPaypalAccountInfoAction,
  paypalWithdrawAction,
  verifyPaypalAccountAction,
} from '../../containers/Auth/actions';
import useQuery from '../../hooks/useQuery';
import Button from '../Button';
import { PAYPAL_URL } from '../../config/env';
import { colors } from '../../utils/colors';
import WithdrawImg from '../../images/icons/withdraw--green.svg';
import PayoutsButton from '../PayoutsButton/payouts-button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Disclaimer = styled.div`
  color: ${(props) => (props.dark ? colors.white : colors.black)};
  padding: 10px 40px;
  text-align: center;
  @media screen and (max-width: 1335px) {
    padding: 10px;
  }
`;
const PayoutButton = styled(Button)`
  min-width: 260px;
  max-width: 350px;
  @media screen and (max-width: 800px) {
    margin-bottom: 15px;
  }
`;
const StyledButton = styled(Button)`
  font-size: 18px;
  font-weight: 500;
  width: 200px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
`;
const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  padding: 4px;
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
`;
const PaypalIcon = styled.img`
  width: 75px;
  height: auto;
  border-right: 1px solid #ffffff90;
  margin-right: 10px;
  padding: 0 10px 0 0;
`;
const Link = styled.a`
  color: ${(props) => (props.dark ? colors.mainGreen : colors.mainPink)};
`;

function Paypal({
  auth,
  dark = false,
  makePayout,
  getPaypalInfo,
  verifyPaypalAccount,
  notVerifiedMessage,
  onWithdraw: onWithdrawProps,
  paypalSetupProps = {},
}) {
  const query = useQuery();

  const [payoutsUpdateDate, setPayoutUpdateDate] = useState(Date.now());

  const isPies = auth.userInfo?.userRole === 'COACH'; // ;)
  const userData = isPies ? auth.userDataFetched : auth.studentData;

  useEffect(() => {
    const shouldClose = query.get('close');
    const code = query.get('code');
    const idToken = query.get('id_token');
    if (code || idToken) {
      verifyPaypalAccount(idToken || code);
    }
    if (shouldClose) {
      setTimeout(() => window.close(), 2000);
    }
  }, []);

  useEffect(() => {
    getPaypalInfo();
  }, []);

  const paypalUrl = () => {
    const { appid, responseType, scopes, returnurl } = {
      ...paypalSetup,
      ...paypalSetupProps,
    };
    return `${PAYPAL_URL}?flowEntry=static&client_id=${appid}&response_type=${responseType}&scope=${scopes}&redirect_uri=${returnurl}`;
  };

  const onWithdraw = () => {
    if (onWithdrawProps) {
      onWithdrawProps();
    } else {
      makePayout({ actions: { onSuccess: () => setPayoutUpdateDate(Date.now()) } });
    }
  };

  return (
    <Wrapper>
      {!auth.paypalAccount?.payPalEmail ? (
        <>
          <Disclaimer dark={dark}>
            {notVerifiedMessage || <FormattedMessage {...messages.paypalAccountDisclaimer} />}
          </Disclaimer>
          <PaypalButton paypalSetupProps={paypalSetupProps} />
        </>
      ) : (
        <>
          <Disclaimer dark={dark}>
            {/* <FormattedMessage {...messages.verifiedInPaypalAs} /> */}
            {auth.paypalAccount?.payPalEmail}
            {/* {'. '} */}
            <br />
            <Link dark={dark} href={paypalUrl()} target="_self">
              <FormattedMessage {...messages.notYou} />
            </Link>
          </Disclaimer>
          {dark ? (
            <StyledButton
              color="green"
              textColor={colors.mainGreen}
              spinnerColor={colors.mainGreen}
              onClick={onWithdraw}
              outline
            >
              <IconWrapper>
                <Icon src={WithdrawImg} />
              </IconWrapper>
              Withdraw
            </StyledButton>
          ) : (
            <PayoutButton onClick={onWithdraw} color="#0070BA" textColor={colors.white}>
              <PaypalIcon
                src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                alt="PayPal"
              />
              <FormattedMessage {...messages.payout} />
            </PayoutButton>
          )}
          <PayoutsButton userId={userData?.userId} lastUpdateDate={payoutsUpdateDate} dark={dark} />
        </>
      )}
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    makePayout: (data) => dispatch(paypalWithdrawAction(data)),
    getPaypalInfo: () => dispatch(getPaypalAccountInfoAction()),
    verifyPaypalAccount: (token) => dispatch(verifyPaypalAccountAction(token)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Paypal);

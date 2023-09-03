/**
 *
 * BillingPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Input from '../../components/Input';
import messages from './messages';
import makeSelectAuth from '../Auth/selectors';
import PageContainer from '../../components/PageContainer';
import { updateCompanyDataAction } from '../Auth/actions';
import creditCardImg from '../../images/images/credit-card.svg';
import InputSubmit from '../../components/InputSubmit';
import makeSelectStatistics from '../Statistics/selectors';
import { getMonthBalanceAction } from '../Statistics/actions';
import { localizeCurrency } from '../../utils/localize';
import Paypal from '../../components/Paypal';
import Stripe from '../../components/Stripe';
import { colors } from '../../utils/colors';

const Columns = styled.div`
  display: flex;
  margin-left: 50px;
  @media screen and (max-width: 800px) {
    flex-direction: column-reverse;
    margin-top: 130px;
  }
`;
const InputsWrapper = styled.form`
  display: flex;
  flex-direction: column;
  flex: 0.75;
  padding-right: 25px;
  margin-right: 40px;
  border-right: 1px solid black;
  @media screen and (max-width: 1155px) {
    flex-direction: column;
    flex: 1.5;
    border-right: 0px solid black;
    margin-top: 20px;
    width: 100%;
  }
`;
const BillingInfoWrapper = styled.div`
  flex: 1;
  align-items: center;
`;
const CreditCardWrapper = styled.div`
  width: 500px;
  position: relative;
  margin: auto;
  margin-bottom: 20px;
  @media screen and (max-width: 1155px) {
    width: fit-content;
  }
`;
const CreditCard = styled.img`
  width: 100%;
  height: auto;
`;
const BalanceWrapper = styled.div`
  position: absolute;
  bottom: 60px;
  left: 40px;
  display: flex;
  flex-direction: column;
  font-size: 28px;
  @media screen and (max-width: 1335px) {
    font-size: 18px;
  }
  @media screen and (max-width: 1155px) {
    font-size: 14px;
  }
  @media screen and (max-width: 380px) {
    bottom: 20px;
    left: 20px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 40px;
  @media screen and (max-width: 1300px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
const StripeWrapper = styled.div`
  width: 50%;
  border: 2px solid ${colors.lilac};
  border-radius: 10px;
  padding: 20px;
  margin: 5px;
  @media screen and (max-width: 1300px) {
    width: fit-content;
  }
`;

const PaypalWrapper = styled.div`
  width: 50%;
  border: 2px solid ${colors.mainPink};
  border-radius: 10px;
  padding: 20px;
  margin: 5px;
  @media screen and (max-width: 1300px) {
    width: fit-content;
  }
`;
const Text = styled.p``;

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  width: 500px;
  margin-top: 20px;
  margin-bottom: 40px;
  margin: auto;
  @media screen and (max-width: 1155px) {
    width: fit-content;
  }
`;
export function BillingPage({ history, auth, updateCompanyData, getMonthBalances, statistics }) {
  const { register, handleSubmit, errors } = useForm({});
  const { userDataFetched } = auth;
  const { companyInfo } = userDataFetched;

  useEffect(() => {
    getMonthBalances({});
  }, []);

  const onSubmit = (data) => updateCompanyData(data);

  return (
    <div>
      <Helmet>
        <title>BillingPage</title>
        <meta name="description" content="Description of BillingPage" />
      </Helmet>
      <PageContainer withPanel history={history} title="ADRESSE DE FACTURATION">
        <Columns>
          <InputsWrapper onSubmit={handleSubmit(onSubmit)}>
            {/* <div style={{ flex: 1, padding: '0 15px' }}> */}
            <Input
              inputProps={{
                ref: register,
                name: 'name',
                defaultValue: companyInfo?.name,
              }}
              labelName={messages.companyName}
              error={errors.companyName}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'city',
                defaultValue: companyInfo?.city,
              }}
              labelName={messages.city}
              error={errors.city}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'siretNumber',
                defaultValue: companyInfo?.siretNumber,
              }}
              labelName={messages.siretNumber}
              error={errors.siretNumber}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'vatNumber',
                defaultValue: companyInfo?.vatNumber,
              }}
              labelName={messages.vatNumber}
              error={errors.vatNumber}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'bicNumber',
                defaultValue: companyInfo?.bicNumber,
              }}
              labelName={messages.bicNumber}
              error={errors.bicNumber}
            />
            {/* </div> */}
            {/* <div style={{ flex: 1, padding: '0 15px' }}> */}
            <Input
              inputProps={{
                ref: register,
                name: 'registerAddress',
                defaultValue: companyInfo?.registerAddress,
              }}
              labelName={messages.companyRegistrationAddress}
              error={errors.registerAddress}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'country',
                defaultValue: companyInfo?.country,
              }}
              labelName={messages.country}
              error={errors.country}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'postCode',
                defaultValue: companyInfo?.postCode,
              }}
              labelName={messages.postCode}
              error={errors.postCode}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'bankAccountNumber',
                defaultValue: companyInfo?.bankAccountNumber,
              }}
              labelName={messages.bankAccountNumber}
              error={errors.bankAccountNumber}
            />
            <InputSubmit
              background={colors.mainPink}
              color={colors.white}
              value="SAUVEGARDER"
              style={{ marginBottom: '10px', flex: 1 }}
            />
            {/* </div> */}
          </InputsWrapper>
          <BillingInfoWrapper>
            <CreditCardWrapper>
              <CreditCard src={creditCardImg} alt="Card balance" />
              <BalanceWrapper>
                <span>
                  <FormattedMessage {...messages.yourBalance} />
                  {': '}
                  {localizeCurrency(
                    statistics?.monthBalance?.totalBalanceToWithdrawCurrentMonth,
                    statistics?.monthBalance?.currency,
                  )}
                </span>
              </BalanceWrapper>
            </CreditCardWrapper>
            <TextWrapper>
              <Text>
                Veuillez connecter ci-dessous votre compte <strong>Stripe</strong> et/ou votre
                compte <strong>PayPal</strong> afin de recevoir vos gains Coachs-Online.
              </Text>
            </TextWrapper>
            <ButtonWrapper>
              <StripeWrapper>
                <Stripe />
              </StripeWrapper>
              <PaypalWrapper>
                <Paypal />
              </PaypalWrapper>
            </ButtonWrapper>
          </BillingInfoWrapper>
        </Columns>
      </PageContainer>
    </div>
  );
}

BillingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateCompanyData: (data) => dispatch(updateCompanyDataAction(data)),
    getMonthBalances: (data) => dispatch(getMonthBalanceAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  statistics: makeSelectStatistics(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(BillingPage);

/**
 *
 * SubscriptionShortBox
 *
 */

import React from 'react';
import SubscriptionShortBoxProps from './subscription-short-box.props';
import styled from 'styled-components';
import { localizeCurrency } from '../../utils/localize';
import messages from '../../containers/Subscription/messages';
import { FormattedMessage } from 'react-intl';
import history from '../../utils/history';
import { colors } from '../../utils/colors';
import { FlexColumn, FlexRow, Text } from '../../global-styles';

const Wrapper = styled.div`
  margin: 10px auto;
  width: 100%;
  max-width: 400px;
`;
const Background = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${colors.white};
  border: 1px solid black;
  border-radius: 10px;
  padding: 20px;
  @media screen and (max-width: 450px) {
    flex-direction: column;
    justify-content: center;
  }
`;
const Column = styled(FlexColumn)``;
const DataRow = styled(FlexRow)`
  align-items: flex-start;
  justify-content: space-between;
  max-width: 500px;
  width: 100%;
`;
const Label = styled(Text)`
  font-size: 12px !important;
  font-weight: 400;
  word-break: keep-all;
  margin: 0 5px;
`;
const Value = styled(Text)`
  text-align: right;
  padding: 0 5px;
  font-size: 13px !important;
  font-weight: 700;
`;
const StyledButton = styled.u`
  color: ${colors.black};
  margin: 0 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  min-width: 90px;
`;

function SubscriptionShortBox(props: SubscriptionShortBoxProps) {
  const { subscription } = props;

  const onPlanChange = () => {
    history.replace(`/subscription/subscriptionChoice?subscriptionId=${subscription?.id}`);
  };

  const planName =
    subscription?.name &&
    messages[`${subscription?.name?.split(' ')?.join('')?.toLowerCase()}Plan`];
  return (
    <Wrapper>
      <Background>
        <Column>
          <DataRow>
            <Label>Abonnement</Label>
            <Value>{planName && <FormattedMessage {...planName} />}</Value>
          </DataRow>
          <DataRow>
            <Label>Prix</Label>
            <Value>
              {localizeCurrency(
                !!subscription?.promotionalPrice
                  ? subscription?.promotionalPrice
                  : subscription?.price?.amount,
              )}
            </Value>
          </DataRow>
        </Column>
        <StyledButton onClick={onPlanChange}>Changement</StyledButton>
      </Background>
    </Wrapper>
  );
}

export default SubscriptionShortBox;

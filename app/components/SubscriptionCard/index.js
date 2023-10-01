/**
 *
 * SubscriptionCard
 *
 */

import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { colors } from '../../utils/colors';
import { localizeCurrency } from '../../utils/localize';
import { FlexCenteredColumn, FlexRow } from '../../global-styles';
import { BillingOption } from '../../containers/Subscription/reducer.types';

const ChoosePlanButton = styled(Button)`
  color: ${colors.black};
  font-weight: 600;
  font-size: 14px;
  padding: 10px;
  box-shadow: none;
  margin: 10px 0 15px 0;
  transition: all 0.5s ease-in-out;
  text-transform: none;
  height: 60px;
  width: 100%;
`;
const InfoTag = styled.div`
  position: absolute;
  padding: 8px 21px;
  height: 30px;
  width: 150px;
  margin-top: 0px;
  border-radius: 10px;
  background: var(--yellow, #EAC435);
  backdrop-filter: blur(2px);
  display: flex;
  top: -3px;
`;
const Wrapper = styled.div`

  background: var(--blue, #7474FC);
  box-shadow: none;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 415px;
  padding: 10px 15px 30px 15px;
  width: 100%;
  max-width: 250px;
  margin-left: 15px;
  margin-bottom: 10px;
  margin-top: 20px;
  transition: all 0.2s ease-in-out;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'unset')};
  ${(props) =>
    props.clickable &&
    `&:hover {
    box-shadow: 35px 10px 45px ${colors.backgroundDarkBlue};
    z-index: 1;
    ${ChoosePlanButton} {
      box-shadow: 0px 9px 8px ${colors.mainBlue}70;
    }
  }`}
`;

const SubscriptionInfo = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 300px;
  width: 100%;
`;
const Title = styled.div`
  font-size: 19px;
  color: ${colors.white};
  margin-bottom: 5px;
  height: 45px;
`;
const PriceWrapper = styled(FlexCenteredColumn)`
  justify-content: center;
  align-items: center;
`;
const Price = styled(Title)`
  font-size: 52px;
  font-weight: 600;
  color: ${colors.white};
  //text-transform: capitalize;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const PricePeriod = styled.span`
  color: ${colors.white};
  font-size: 14px;
  font-weight: 500;
  text-transform: unset;
  text-align: center;
`;
const Footer = styled(FlexCenteredColumn)`
  width: 100%;
`;

const CrossedPrice = styled(Price)`
  text-decoration: line-through;
  font-size: 30px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
const DiscountWrapper = styled.div`
  padding: 5px 10px;
  background: ${(props) => (props.special ? colors.mainGold : '#2C4CE4')};
  color: ${colors.white};
  font-weight: 600;
  font-size: 25px;
  border-radius: 10px;
  margin-bottom: 15px;
`;
const HR = styled.hr`width:550px; margin-left:-20px;`

const freeText = (
  <>
    * aucune obligation d'abonnement
    <br />* sans carte de crédit
  </>
);

function SubscriptionCard({ item, onSubscriptionSelect, selectedCard }) {
  const yearlyBillingPeriod = item.price?.periodType === 'year';
  const studentSpecial = item.billingOption === BillingOption.STUDENT;
  const isSelected = selectedCard.id === item.id;

  const selectSubscription = (item) => {
    !!onSubscriptionSelect && onSubscriptionSelect(item);
    //console.log(item);
  };

  ///
  /// Next section to be recreate entirely because bad method
  /// start re-do
  ///

  const itemsName = () => {
    if (item.name == 'Monthly') return 'Au mois';
    if (item.name == 'Yearly') return "A l'année";
    if (item.name == 'Monthly Student') return 'Etudiant';
    return item.name;
  };

  const itemsDescription = () => {
    if (item.name == 'Monthly') return "Offre d'abonnement au mois";
    if (item.name == 'Yearly') return "Offre d'abonnement à l'année";
    if (item.name == 'Monthly Student') return 'Offre réserver au étudiants';
    return item.description;
  };

  ///
  /// end re-do
  ///

  const hasPromotionalPrice = typeof item.promotionalPrice === 'number';

  return (
    <Wrapper
      special={studentSpecial}
      isSelected={isSelected}
      otherIsSelected={!!selectedCard?.id}
      key={item.name}
      onClick={() => selectSubscription(item)}
      clickable={!!onSubscriptionSelect}
    >
      {yearlyBillingPeriod && (
        <InfoTag isSelected={isSelected} otherIsSelected={!!selectedCard?.id}>
          6 mois offerts
        </InfoTag>
      )}
      <SubscriptionInfo otherIsSelected={!!selectedCard?.id} isSelected={isSelected}>
        <FlexRow style={{ justifyContent: 'flex-end', width: '100%' }}>
          {!!item.coupon?.id && (
            <DiscountWrapper special>
              {!!item.coupon.percentOff
                ? `${item.coupon.percentOff}%`
                : localizeCurrency(item.coupon.amountOff)}
            </DiscountWrapper>
          )}
          {!!item.price?.trialDays > 0 && (
            <DiscountWrapper special>{item.price?.trialDays} jours d'essai</DiscountWrapper>
          )}
        </FlexRow>
        <Title>{itemsName()}</Title>
        <HR/>
        <PriceWrapper>
          {hasPromotionalPrice && (
            <CrossedPrice>{localizeCurrency(item.amountPerMonth)}</CrossedPrice>
          )}
          {item.billingOptionStr !== 'FREE' && (
            <Price>
              {localizeCurrency(
                hasPromotionalPrice ? item.promotionalAmountPerMonth : item.amountPerMonth,
              )}{' '}
              {studentSpecial || item?.coupon?.durationInMonths ? '*' : ''}
              <PricePeriod>par mois</PricePeriod>
            </Price>
          )}
        </PriceWrapper>
        <PricePeriod>{itemsDescription()}</PricePeriod>
      </SubscriptionInfo>
      <Footer otherIsSelected={!!selectedCard?.id} isSelected={isSelected}>
        {!!onSubscriptionSelect && (
          <ChoosePlanButton color="#fff" onClick={() => selectSubscription(item)}>
            <span style={{ textAlign: 'center' }}>Choisir l’abonnement</span>
          </ChoosePlanButton>
        )}
        <PricePeriod style={{ height: 35 }}>
          {yearlyBillingPeriod
            ? `${localizeCurrency(
                hasPromotionalPrice ? item.promotionalPrice : item.price?.amount,
              )} par an`
            : item.billingOptionStr === 'FREE'
            ? freeText
            : !!item?.coupon?.durationInMonths
            ? `* la promotion est valable pour: ${item.coupon.durationInMonths} mois`
            : '* paiement mensuel'}
        </PricePeriod>
      </Footer>
    </Wrapper>
  );
}

SubscriptionCard.propTypes = {};

export default SubscriptionCard;

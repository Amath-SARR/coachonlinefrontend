import React, { memo, useEffect } from 'react';
import SubscriptionsSelectorProps from './subscriptions-selector.props';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { DispatchType } from '../../types';
import makeSelectSubscription from '../../containers/Subscription/selectors';
import {
  getSubscriptionTypesAction,
  selectSubscriptionAction,
} from '../../containers/Subscription/actions';
import SubscriptionCard from '../SubscriptionCard';
import { Subscription } from '../../containers/Subscription/reducer.types';
import useQuery from '../../hooks/useQuery';
import { emptySubscription } from '../../containers/Subscription/SubscriptionChoicePage/emptySubscription';
import { colors } from '../../utils/colors';
import history, { navigateWithBackground, replaceWithBackground } from '../../utils/history';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 40px;
  margin-top: 20px;
  justify-content: space-around;
  width: 100%;
  flex-wrap: wrap;
  position: relative;
  left: 150px;
`;

const Text = styled.p`
  margin-left: 70px;
  margin-right: 70px;
  margin-top: 30px;
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  @media screen and (max-width: 920px) {
    font-size: 15px;
  }
`;
const Subtext = styled.p`
  font-size: 18px;
  text-align: start;
  color: var(--rose, #E21680);
  @media screen and (max-width: 920px) {
    font-size: 13px;
  }
`;
const Button = styled.button`
  width: 120px;
  background-color: var(--rose, #E21680);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 10px;
`;

function SubscriptionsSelectorFree(props: SubscriptionsSelectorFreeProps) {
  const query = useQuery();
  const {
    subscription,
    onSelect,
    getSubscriptionPlans,
    setSubscription,
    showFreePlan = true,
    item,

    selectedCard,
  } = props;

  useEffect(() => {
    getSubscriptionPlans({ body: { affToken: query.get('Join') } });
  }, []);

  const handleClick = () => {
    setSubscription(emptySubscription);
    onSelect(emptySubscription);
    history.replace('/auth/register/student');
  };

  // const onSubscriptionSelect = (item: Subscription) => {
  //   setSubscription(item);
  //   onSelect(item);
  //   console.log(item);
  // };

  const Subscriptions = () => {
    const sortedByPrice = JSON.parse(JSON.stringify(subscription.availableSubscriptions))?.sort(
      (a, b) => b.amountPerMonth - a.amountPerMonth,
    );
    // const withTrialDays = sortedByPrice?.filter((sub: Subscription) => sub.price.trialDays > 0);
    // const noTrialDays = sortedByPrice?.filter(
    //   (sub: Subscription) => !sub.price.trialDays || sub.price.trialDays === 0,
    // );
    return (
      <>
        {showFreePlan && (
          <SubscriptionCard
            isSelected={subscription.selected?.id === emptySubscription.id}
            selectedCard={subscription.selected}
            key={emptySubscription.id}
            item={emptySubscription}
            subscriptions={subscription.availableSubscriptions}
            highestPriceSubscription={sortedByPrice?.[0]}
            onSubscriptionSelect={() => {
              // @ts-ignore*/
              onSubscriptionSelect(emptySubscription);
            }}
            isStudent={false}
          />
        )}
      </>
    );
  };
  return (
    <Wrapper>
      <Text>
        Félicitation, vous allez vous abonner GRATUITEMENT pour visionner pendant 7 jours les
        premières vidéos de chacune de nos formations.
      </Text>
      <Subtext>* Aucune obligation d'abonnement</Subtext>
      <Subtext>* Sans carte de crédit</Subtext>
      <Text>
        Pour accéder à tous nos contenus choisissez votre abonnement sur la page d'acceuil ou dans
        votre profil !{' '}
      </Text>
      <Button onClick={() => handleClick()}>Confirmer</Button>
      {/* <Subscriptions /> */}
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    getSubscriptionPlans: (data) => dispatch(getSubscriptionTypesAction(data)),
    setSubscription: (data: Subscription) => dispatch(selectSubscriptionAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  subscription: makeSelectSubscription(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(SubscriptionsSelectorFree);

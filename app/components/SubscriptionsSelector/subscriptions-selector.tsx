/**
 *
 * SubscriptionsSelector
 *
 */

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

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 40px;
  margin-top: 20px;
  justify-content: space-around;
  width: 100%;
  flex-wrap: wrap;
  position: relative;
`;

const Title = styled.p`
  font-size: 40px;
  text-align: center;
  margin-top: 80px;
  margin-bottom: 30px;
`;

function SubscriptionsSelector(props: SubscriptionsSelectorProps) {
  const query = useQuery();
  const {
    subscription,
    onSelect,
    getSubscriptionPlans,
    setSubscription,
    showFreePlan = true,
  } = props;

  useEffect(() => {
    getSubscriptionPlans({ body: { affToken: query.get('Join') } });
  }, []);

  const onSubscriptionSelect = (item: Subscription) => {
    setSubscription(item);
    onSelect(item);
    const timer = setTimeout(() => { 
      scrollTo();
    }, 800);
  };

    const scrollTo = () => {
    const forms = document.querySelector('#homepage_form-ref-inscription');
    const y = forms?.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({
      top: y,
      behavior: 'smooth',
      // block: 'start',
    });
  };

  const Subscriptions = () => {
    const sortedByPrice = JSON.parse(JSON.stringify(subscription.availableSubscriptions))?.sort(
      (a, b) => b.amountPerMonth - a.amountPerMonth,
    );
    const withTrialDays = sortedByPrice?.filter((sub: Subscription) => sub.price.trialDays > 0);
    const noTrialDays = sortedByPrice?.filter(
      (sub: Subscription) => !sub.price.trialDays || sub.price.trialDays === 0,
    );
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
        {(withTrialDays?.length > 0 ? withTrialDays : noTrialDays)?.map((item: Subscription) => (
          <SubscriptionCard
            selectedCard={subscription.selected}
            key={item.id}
            item={item}
            subscriptions={subscription.availableSubscriptions}
            highestPriceSubscription={sortedByPrice?.[0]}
            onSubscriptionSelect={() => {
              onSubscriptionSelect(item);
            }}
          />
        ))}
      </>
    );
  };
  return (
    <>
      <Title>Découvrez nos offres d'abonnement</Title>
      <Wrapper>
        <Subscriptions />
      </Wrapper>
    </>
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

export default compose(withConnect, memo)(SubscriptionsSelector);

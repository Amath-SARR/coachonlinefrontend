/**
 *
 * SubscriptionChoicePage
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { useLocation } from 'react-router-dom';
import messages from '../messages';
import dashboardMessages from '../../../components/messages';
import {
  applySubscriptionAction,
  getSubscriptionTypesAction,
  selectSubscriptionAction,
} from '../actions';
import makeSelectAuth from '../../Auth/selectors';
import makeSelectSubscription from '../selectors';
import Button from '../../../components/Button';
import useQuery from '../../../hooks/useQuery';
import { ModalHeaderDescription, ModalInnerWrapper, ModalTitle } from '../../../components/Modal';
import history, { navigateWithBackground, replaceWithBackground } from '../../../utils/history';
import SubscriptionsSelector from '../../../components/SubscriptionsSelector/subscriptions-selector';

export const InnerWrapper = styled(ModalInnerWrapper)``;

const Header = styled(ModalTitle)``;
const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-direction: column;
`;

export function SubscriptionChoicePage({ auth, subscription }) {
  const location = useLocation();
  const confirmButtonRef = useRef();
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const userData = auth.userInfo?.userRole === 'COACH' ? auth.userDataFetched : auth.studentData;

  useEffect(() => {
    setLoading(false);
  }, []);

  const confirmSubscriptionChoice = () => {
    if (subscription.selected?.billingOptionStr === 'FREE') {
      return history.replace('/');
    }
    const hasCardInfo = subscription.cardInfo?.card?.validTo;
    const isAdditionalInfoRequired = !userData?.firstName || !userData?.lastName || !hasCardInfo;
    isAdditionalInfoRequired
      ? replaceWithBackground({
          path: `/subscription/profileDetails?subscriptionId=${subscription.selected?.id}`,
          location,
          history,
      })
      : replaceWithBackground({
        path: `/subscription/summary?subscriptionId=${subscription.selected?.id}`,
        location,
        history,
      });
  };

  const onSelect = () => {
    !scrolled &&
      confirmButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    setScrolled(true);
  };

  return (
    <InnerWrapper>
      <Header>
        <FormattedMessage {...messages.billingChoiceHeader} />
      </Header>
      {!auth.studentData?.trialActive && !auth.studentData?.subscription?.selectedPlanId && (
        <ModalHeaderDescription>
          Votre essai est terminé veuillez choisir un des plans suivant
        </ModalHeaderDescription>
      )}
      <SubscriptionsSelector
        showFreePlan={!userData?.subscription?.selectedPlanId}
        onSelect={onSelect}
      />
      <ButtonsWrapper ref={confirmButtonRef}>
        <Button
          style={{
            width: 'fit-content',
            padding: '10px 20px',
            margin: '10px 0',
          }}
          isLoading={loading}
          disabled={!subscription.selected?.id}
          onClick={confirmSubscriptionChoice}
          color="green"
        >
          <FormattedMessage {...messages.confirmSubscriptionChoice} />
        </Button>
        {/*<Button disableOnFetch color="transparent" onClick={() => history.push('/')}>*/}
        {/*  <FormattedMessage {...dashboardMessages.skip} />*/}
        {/*</Button>*/}
      </ButtonsWrapper>
    </InnerWrapper>
  );
}

SubscriptionChoicePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subscription: makeSelectSubscription(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getSubscriptionPlans: () => dispatch(getSubscriptionTypesAction()),
    selectSubscription: (data) => dispatch(selectSubscriptionAction(data)),
    confirmSubscription: (data) => dispatch(applySubscriptionAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(SubscriptionChoicePage);

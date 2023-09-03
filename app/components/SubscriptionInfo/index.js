/**
 *
 * SubscriptionInfo
 *
 */

import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import subscriptionMessages from '../../containers/Subscription/messages';
import Button from '../Button';
import { colors } from '../../utils/colors';
import { localizeCurrency, localizeDate } from '../../utils/localize';
import Label from '../Label';
import { UppercaseText } from '../../global-styles';
import history from '../../utils/history';
import messages from '../messages';
import Input from '../Input';
import { compose } from '@reduxjs/toolkit';
import { QuestionnaireEventData } from '../ConnectionsTrackerSignalR/types';
import { setQuestionnaireAction } from '../../containers/Auth/actions';
import { createStructuredSelector } from 'reselect';
import makeSelectAuth from '../../containers/Auth/selectors';
import { connect } from 'react-redux';
import CancelSubscriptionQuestionnaire from '../CancelSubscriptionQuestionnaire/cancel-subscription-questionnaire';
import {
  getCancelSubscriptionQuestionnaireAction,
  setCancelSubscriptionQuestionnaireAction,
} from '../../containers/Subscription/actions';
import { toast } from 'react-toastify';

const Title = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  color: ${(props) => (props.isDark ? colors.textDark : colors.black)};
  @media screen and (max-width: 1024px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;
const AdditionalInfo = styled(Title)`
  font-size: 14px;
  font-weight: normal;
  text-transform: unset;
`;
const ExpiresText = styled(AdditionalInfo)`
  text-align: center;
`;
const SubscriptionPlanName = styled.div`
  background: ${colors.mainGreen};
  font-size: 32px;
  font-weight: 300;
  color: ${colors.black};
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 15px;
  //margin-bottom: 30px;
`;
const SmallText = styled(UppercaseText)`
  text-transform: lowercase;
  color: ${colors.black};
  letter-spacing: 0px;
  font-weight: 400;
`;

const SubscriptionButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  flex-direction: column;
`;

function SubscriptionInfo({
  subscription,
  cancelSubscription,
  auth,
  colorScheme = 'dark',
  userRole,
  getQuestionnaire,
}) {
  const location = useLocation();
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [questionnaireOpened, setQuestionnaireOpened] = useState(false);
  const { activeSubscription, currentSubscription } = subscription || {};
  const activeSubscriptionPrice = activeSubscription?.billingPlanType?.price;
  const currentSubscriptionPrice = currentSubscription?.billingPlanType?.price;

  const userHasActiveSubscription =
    activeSubscription?.statusStr === 'ACTIVE' || activeSubscription?.statusStr === 'PENDING';

  const isNextMonthSubscriptionDifferent =
    activeSubscription?.billingPlanType?.id !== currentSubscription?.billingPlanType?.id;

  const nextMonthSubscriptionRequiresVerification =
    currentSubscription?.studentCardVerificationStatusStr === 'IN_VERIFICATION';

  const subscriptionCancelAt =
    activeSubscription?.expiryDate && localizeDate(activeSubscription?.expiryDate);

  const shouldShowCancelButton = isNextMonthSubscriptionDifferent
    ? !currentSubscription?.expiryDate
    : !activeSubscription?.expiryDate;

  const subscriptionActivationDate =
    currentSubscription?.plannedActivationDate &&
    localizeDate(activeSubscription?.plannedActivationDate);

  const subscriptionPrice =
    activeSubscriptionPrice &&
    localizeCurrency(activeSubscriptionPrice?.amount, activeSubscriptionPrice?.currency);

  const nextMonthSubPrice =
    currentSubscriptionPrice &&
    localizeCurrency(currentSubscriptionPrice?.amount, currentSubscriptionPrice?.currency);

  const isCoach = auth.userInfo?.userRole === 'COACH';

  const subscriptionInfoFromAuth = isCoach
    ? auth.userDataFetched?.subscription
    : auth.studentData?.subscription;

  const nextBillingDate =
    subscriptionInfoFromAuth?.nextBillingTime &&
    new Date(subscriptionInfoFromAuth?.nextBillingTime);

  const getSubscriptionLabel = () => {
    if (nextBillingDate && !subscriptionCancelAt) {
      return subscriptionMessages.yourNextBillingDateIs;
    }
    if (subscriptionCancelAt) {
      return subscriptionMessages.subscriptionEndsIn;
    }
    if (!subscriptionCancelAt && !nextBillingDate) {
      return subscriptionMessages.showInvoices;
    }
  };
  const subscriptionLabel = getSubscriptionLabel();

  const onSubscriptionCancelRequest = () => {
    setQuestionnaireOpened(true);
  };

  const onCancelQuestionnaireSubmit = (data) => {
    cancelSubscription({ answerId: data.answerId });
  };

  return userHasActiveSubscription || isNextMonthSubscriptionDifferent ? (
    <div>
      {userHasActiveSubscription && (
        <>
          <Label
            labelName={subscriptionMessages.yourSubscriptionPlan}
            isDark={colorScheme === 'dark'}
          />
          <SubscriptionPlanName isDark={colorScheme === 'dark'}>
            {subscriptionPrice}
            <SmallText>
              par{' '}
              {!!activeSubscription?.billingPlanType?.price?.periodType && (
                <FormattedMessage
                  {...messages[activeSubscription?.billingPlanType?.price?.periodType]}
                />
              )}
            </SmallText>
            {subscriptionCancelAt && (
              <SmallText isDark={colorScheme === 'dark'}>
                <FormattedMessage {...subscriptionMessages.expires} />: {subscriptionCancelAt}
              </SmallText>
            )}
          </SubscriptionPlanName>
        </>
      )}

      {isNextMonthSubscriptionDifferent && (
        <>
          <Label
            labelName={subscriptionMessages.yourNextSubscriptionPlan}
            isDark={colorScheme === 'dark'}
          />

          <SubscriptionPlanName isDark={colorScheme === 'dark'}>
            {nextMonthSubPrice}

            <SmallText>
              par{' '}
              {!!currentSubscription?.billingPlanType?.price?.periodType && (
                <FormattedMessage
                  {...messages[currentSubscription?.billingPlanType?.price?.periodType]}
                />
              )}
            </SmallText>
            {subscriptionActivationDate && (
              <>
                <SmallText isDark={colorScheme === 'dark'}>
                  <FormattedMessage {...subscriptionMessages.activationDate} />:{' '}
                  {subscriptionActivationDate}{' '}
                  {nextMonthSubscriptionRequiresVerification ? '*' : ''}
                </SmallText>
                <SmallText isDark={colorScheme === 'dark'}>
                  {nextMonthSubscriptionRequiresVerification
                    ? "* l'abonnement ne deviendra actif que lorsque l'administrateur aura vérifié votre carte d'étudiant"
                    : ''}
                </SmallText>
              </>
            )}
          </SubscriptionPlanName>
        </>
      )}

      {userHasActiveSubscription && (
        <Input
          redesigned
          inputProps={{
            readOnly: true,
            value: subscriptionCancelAt || nextBillingDate,
          }}
          labelName={subscriptionLabel}
        />
      )}

      <SubscriptionButtonsWrapper>
        <Button
          color="green"
          disableOnFetch
          style={{
            whiteSpace: 'nowrap',
            marginBottom: '15px',
          }}
          onClick={() =>
            history.push('/subscription/subscriptionChoice', {
              background: location,
            })
          }
        >
          <FormattedMessage {...subscriptionMessages.changePlan} />
        </Button>
        {shouldShowCancelButton && (
          <Button
            color="green"
            outline
            disableOnFetch
            isLoading={subscriptionLoading}
            style={{ whiteSpace: 'nowrap' }}
            onClick={onSubscriptionCancelRequest}
          >
            <FormattedMessage {...subscriptionMessages.cancelSubscription} />
          </Button>
        )}
        <CancelSubscriptionQuestionnaire
          onAnswerSubmit={onCancelQuestionnaireSubmit}
          questionnaireOpened={questionnaireOpened}
          onClose={() => setQuestionnaireOpened(false)}
        />
      </SubscriptionButtonsWrapper>
    </div>
  ) : (
    <div>
      {userRole === 'INSTITUTION_STUDENT' && (
        <Label
          label={
            'Vous êtes inscrit sous un compte invité. Vous n’avez pas besoin d’abonnement. Vous pouvez obtenir un abonnement personnel quand vous le souhaitez sur https://inscription.coachs-online.com.'
          }
          isDark={colorScheme === 'dark'}
        />
      )}
      <Label
        labelName={subscriptionMessages.youDontHaveSubscriptionPlan}
        isDark={colorScheme === 'dark'}
      />
      <SubscriptionButtonsWrapper>
        <Button
          color="green"
          disableOnFetch
          onClick={() =>
            history.push('/subscription/subscriptionChoice', {
              background: location,
            })
          }
        >
          <FormattedMessage {...subscriptionMessages.getSubscription} />
        </Button>
      </SubscriptionButtonsWrapper>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getQuestionnaire: (data) => dispatch(getCancelSubscriptionQuestionnaireAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SubscriptionInfo);

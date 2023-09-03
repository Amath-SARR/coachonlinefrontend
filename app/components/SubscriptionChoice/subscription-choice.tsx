/**
 *
 *
 * --> Subscription Choice at the end of the homePage
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import HomePageAffiliationSectionProps from './home-page-affiliation-section.props';
import styled from 'styled-components';
import RegisterForm from '../RegisterForm/register-form';
import { colors } from '../../utils/colors';
import SubscriptionsSelector from '../SubscriptionsSelector/subscriptions-selector';
import { Text } from '../../global-styles';
import useQuery from '../../hooks/useQuery';
import { UserRole } from '../../containers/Auth/reducer.types';
import getWixLink from './links';
import IFrame from '../IFrame/i-frame';

const Wrapper = styled.div``;
const SubscriptionsWrapper = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 50px auto;
`;
const FormWrapper = styled.div`
  background: #f8f7fb;
  //border: 1px solid ${colors.lilac};
  border-radius: 24px;
  width: 100%;
  max-width: 875px;
  margin: 50px auto;
  position: relative;
  display: flex;
  padding: 30px;
  box-shadow: 0px 5px 14px rgba(8, 15, 52, 0.1);
  @media screen and (max-width: 600px) {
    max-width: 300px;
    flex-direction: column;
  }
`;

const Title = styled.p`
  color: ${colors.lilac};
  font-size: 30px;
  font-weight: 500;
  margin-top: 40px;
  margin-bottom: 20px;
  text-align: center;
  @media screen and (max-width: 600px) {
    font-size: 25px;
  }
`;
const Subtitle = styled.p`
  font-size: 45px;
  margin-bottom: 10px;
  text-align: center;
  @media screen and (max-width: 600px) {
    font-size: 25px;
  }
`;

function SubscriptionChoice(props: SubscriptionChoiceProps) {
  const { auth, subscription } = props;
  const formsRef = useRef();
  const subsRef = useRef();
  const iframeRef = useRef();
  const query = useQuery();
  const isCoach = !!query.get('Ref');
  const [iframeSrc, setIframeSrc] = useState('');
  const [form, setForm] = useState(false);

  //When you click on the card of your choice, the iframe updates and displays the information about the selected subscription.
  useEffect(() => {
    updateIframeSrc(subscription.selected);
  }, [subscription?.selected?.id]);

  const updateIframeSrc = (sub) => {
    const selectedSubscription = sub?.name ? sub : { name: '' };
    setIframeSrc(null);
    setTimeout(() => setIframeSrc(getWixLink(selectedSubscription)?.url), 500);
  };

  const onSubscriptionSelect = () => {
    setForm(true);
  };

  const registerRole = isCoach ? 'coach' : 'student';

  const subscriptionChoiceShown = !!auth.authToken
    ? auth?.userInfo?.userRole === 'STUDENT' && !auth?.userInfo?.subscriptionActive
    : !isCoach;

  return (
    <Wrapper>
      {subscriptionChoiceShown && (
        <SubscriptionsWrapper id={'homepage_subs'} ref={subsRef}>
          <SubscriptionsSelector showFreePlan onSelect={onSubscriptionSelect} />
        </SubscriptionsWrapper>
      )}{' '}
      {/* {subscriptionChoiceShown && (
        <div ref={iframeRef}>{!!iframeSrc && <IFrame src={iframeSrc} />}</div>
      )} */}
      <>
        {form ? (
          <div>
            {' '}
            <Title id={'homepage_form-ref-inscription'} ref={formsRef}>
              Pour poursuivre votre inscription veuillez remplir le formulaire d'abonnement ci
              dessous
            </Title>
            <Subtitle>
              {isCoach
                ? 'Créez un compte de coach dédié et commencez à gagner un revenu passif en 2 minutes !'
                : 'Tous les cours de vos coachs préférés en illimité'}
            </Subtitle>
            <FormWrapper>
              <div style={{ flex: 1, maxWidth: 400, margin: 'auto' }}>
                <Subtitle>{isCoach ? 'Inscrivez-vous' : 'Abonnez vous'}</Subtitle>
                <RegisterForm accountType={registerRole} submitLabel={'Inscription'} />
              </div>
            </FormWrapper>{' '}
          </div>
        ) : null}
      </>
    </Wrapper>
  );
}

export default memo(SubscriptionChoice);

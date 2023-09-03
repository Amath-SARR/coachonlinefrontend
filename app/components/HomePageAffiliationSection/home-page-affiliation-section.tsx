/**
 *
 * HomePageAffiliationSection
 * --> Become Subscription Choice at the end of the homePage
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import HomePageAffiliationSectionProps from './home-page-affiliation-section.props';
import styled from 'styled-components';
import Banner from '../Banner';
import RegisterForm from '../RegisterForm/register-form';
import LoginForm from '../LoginForm/login-form';
import { colors } from '../../utils/colors';
import AffiliationBannerImg from '../../images/images/affiliation-banner.jpg';
import SubscriptionsSelector from '../SubscriptionsSelector/subscriptions-selector';
import history, { replaceWithBackground } from '../../utils/history';
import { useLocation } from 'react-router-dom';
import { Text } from '../../global-styles';
import Button from '../Button';
import getWixLink from './links';
import IFrame from '../IFrame/i-frame';
import { readFromStorage } from '../../utils/storage';
import useQuery from '../../hooks/useQuery';
import { UserRole } from '../../containers/Auth/reducer.types';
import Video from '../../images/video/CoachOnline-Presentation.mp4';
import CardsHomePage from '../CardsHomePage/cards-home-page';


const Wrapper = styled.div`
  @media screen and (max-width: 920px) {
    margin-top: 90px;
  }
`;
const SubscriptionsWrapper = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 50px auto;
`;
const FormWrapper = styled.div`
  //background: linear-gradient(135deg, #1b2134 0%, #121621 100%);
  border: 1px solid ${colors.mainGreen};
  border-radius: 24px;
  width: 100%;
  max-width: 875px;
  margin: 50px auto;
  position: relative;
  display: flex;
  padding: 30px;
  @media screen and (max-width: 600px) {
    max-width: 300px;
    flex-direction: column;
  }
`;
const AffiliationBanner = styled(Banner)``;
const BannerOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(closest-side, ${colors.backgroundBlue}CC 0%, transparent 100%);
  top: 0;
  left: 0;
`;
const WelcomeTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin-top: 60px;
  margin-bottom: 50px;
  margin-left: 20px;
  position: relative;

  @media screen and (max-width: 920px) {
    flex-direction: column;
    margin: auto;
    justify-content: center;
  }
`;
const TextWrapper = styled.div`
  width: 700px;
  // padding: 20px;
  // background: ${colors.lilac};
  
  @media screen and (max-width: 920px) {
    width: 300px;
    margin-top: 60px;
  }
`;
const VideoWrapper = styled.div`
  margin: 60px;
  box-shadow: 214px 87px 0px 23px ${colors.lilac}, 189px -136px 0px 0px ${colors.lilac};
  @media screen and (max-width: 920px) {
    box-shadow: 0px 0px 0px 0px;
    margin-top: 60px;
  }
`;
const Videoplayer = styled.video`
  width: 700px;
  @media screen and (max-width: 500px) {
    width: 325px;
  }
`;
const Title = styled(Text)`
  font-size: 45px;
  font-weight: 500;
  text-align: center;
  @media screen and (max-width: 920px) {
    font-size: 35px;
    margin-bottom: 2px;
  }
  @media screen and (max-width: 500px) {
    font-size: 25px;
  }
`;

const Title2 = styled(Text)`
  font-size: 55px;
  font-weight: 600;
  text-align: center;
  @media screen and (max-width: 920px) {
    font-size: 40px;
    margin-bottom: 2px;
  }
  @media screen and (max-width: 500px) {
    //font-size: 25px;
  }
`;
const Welcome = styled.div`
  margin-top: 40px;
  margin-bottom: 20px;
  @media screen and (max-width: 920px) {
    margin-top: 20px;
  }
`;
const Subtitle = styled(Text)`
  font-size: 35px;
  margin-bottom: 20px;
  text-align: center;
  @media screen and (max-width: 920px) {
    font-size: 15px;
  }
`;
const RegisterButton = styled(Button)`
  width: 200px;
  margin-left: 6px;
  font-size: 24px;
  @media screen and (max-width: 920px) {
    font-size: 20px;
    width: fit-content;
    font-weight: 400;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
`;

const Separator = styled.div`
  margin: 0 30px;
  border-left: 1px solid white;
  @media screen and (max-width: 600px) {
    margin: 30px 0;
    border-left: none;
    border-bottom: 1px solid white;
  }
`;

const Links = styled.a`
  text-decoration: none;
`;
function HomePageAffiliationSection(props: HomePageAffiliationSectionProps) {
  const { auth, subscription } = props;
  const formsRef = useRef();
  const subsRef = useRef();
  const iframeRef = useRef();
  const query = useQuery();
  const isCoach = !!query.get('Ref');
  const [iframeSrc, setIframeSrc] = useState('');

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
    const timeout = subscription.selected?.id === sub.id ? 0 : 0;
    scrollTo(formsRef.current, timeout);
    // }
  };

  const scrollTo = () => {
    const forms = document.querySelector('#homepage_form-ref');
    const y = forms?.getBoundingClientRect().top + window.pageYOffset + -100;
    window.scrollTo({
      top: y,
      behavior: 'smooth',
      // block: 'start',
    });
  };

  const registerRole = isCoach ? 'coach' : 'student';

  const subscriptionChoiceShown = !!auth.authToken
    ? auth?.userInfo?.userRole === 'STUDENT' && !auth?.userInfo?.subscriptionActive
    : !isCoach;

  return (
    <Wrapper>
      {/* <AffiliationBanner>
        <BannerOverlay />
      </AffiliationBanner> */}
      <WelcomeTextWrapper>
        <TextWrapper>
          <Welcome>
            <Title>Bienvenue sur </Title>
            <Title2>Coachs Online</Title2>
          </Welcome>
          <Subtitle>
            {isCoach
              ? 'Créez un compte de coach dédié et commencez à gagner un revenu passif en 2 minutes !'
              : 'Tous les cours de vos coachs préférés en illimité'}
          </Subtitle>
          <Buttons>
            <Links href="https://www.coachs-online.net/offres-d-abonnements/" target="_blank">
              <RegisterButton
                // onClick={() => scrollTo()}
                color={isCoach ? 'pink' : 'green'}
                style={{ color: colors.white }}
              >
                En savoir plus
              </RegisterButton>
            </Links>
            {/* <Links href="https://www.coachs-online.net/offre-d-accompagnements/" target="_blank">
              <RegisterButton style={{ backgroundColor: 'transparent', color: colors.mainPink }}>
                Devenir Coach
              </RegisterButton>
            </Links> */}
          </Buttons>
        </TextWrapper>
        <VideoWrapper>
          <Videoplayer controls autostart autoPlay muted loop src={Video} type="video/mp4" />
        </VideoWrapper>
      </WelcomeTextWrapper>
      {/* {subscriptionChoiceShown && (
        <SubscriptionsWrapper id={'homepage_subs'} ref={subsRef}>
          <SubscriptionsSelector showFreePlan onSelect={onSubscriptionSelect} />
        </SubscriptionsWrapper>
      )} */}
      <CardsHomePage />
      {/* <FormWrapper id={'homepage_form-ref'} ref={formsRef}>
        <div style={{ flex: 1, maxWidth: 400, margin: 'auto' }}>
          <Subtitle>{isCoach ? 'Inscrivez-vous' : 'Abonnez vous'}</Subtitle>
          <RegisterForm accountType={registerRole} submitLabel={'Inscription'} />
        </div>
      </FormWrapper> */}
      {/* {subscriptionChoiceShown && (
        <div ref={iframeRef}>{!!iframeSrc && <IFrame src={iframeSrc} />}</div>
      )} */}
    </Wrapper>
  );
}

export default memo(HomePageAffiliationSection);

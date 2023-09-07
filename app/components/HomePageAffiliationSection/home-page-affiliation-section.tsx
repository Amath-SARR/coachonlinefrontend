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
import './style.css';
const ImgAceuil = require('../../images/images/imgAcueil.png');
const Union = require('../../images/images/union.png');

const Wrapper = styled.div`
  width: 85%;
  margin-left: 80px;
  margin: auto;
`;

const Wrapper1 = styled.div`
  width: 550px;
  height: 100px;
  margin-top: 50px;
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

const Videoplayer = styled.video`
  width: 90%;
  border: 2px solid ${colors.lilac};
  border-radius: 10px;
  @media screen and (max-width: 920px) {
    width: 320px;
  }
`;
const VideoWrapper = styled.div`
  margin-left: 100px;
  margin-top: 50px;
  @media screen and (max-width: 520px) {
    box-shadow: 0px 0px 0px 0px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
`;

const Title = styled(Text)`
  font-size: 30px;
  font-weight: 100;
  text-transform: uppercase;
  margin-bottom: 20px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
  }

`;

const Title2 = styled(Text)`
  color: var(--rose, #E21680);
  font-size: 30px;
  font-weight: 100;
  text-transform: uppercase;
  margin-bottom: 20px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
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
  height: 100px;
  letter-spacing: 2px;
  font-size: 30px;
  font-weight: 100;
  text-transform: uppercase;
  margin-bottom: 20px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
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

const Button1 = styled.button`
    display: flex;
    padding: 10px 32px;
    align-items: flex-end;
    cursor: pointer;
    border-radius: 14px;
    border: 1px solid var(--rose, #E21680);
    background: var(--rose, #E21680);
    margin-top: 60px;
`;

const CardRight = styled.div`
  width: 700px;
  height: 500px;
  margin-left: -300px;
  background: url(${ImgAceuil});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-position-x: center;
  background-position-y: center;
  background-position: bottom, right;
  border-radius: 0px 14px 14px 0px;
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
    <>
      <Wrapper>
        <div className="full-card">
          <div className="card-left">
            <div className='head'>
              <Title>Bienvenue sur </Title>
              <Title2>Coachs Online</Title2>
            </div>
            <div className='decription'>
              <Subtitle>
                {isCoach
                  ? <p>Créez un compte de coach dédié <br /> et commencez à gagner <br /> un revenu passif en 2 minutes !</p>
                  : <p>Tous les cours <br /> de vos coachs <br /> préférés en <br /> illimité</p>}
              </Subtitle>
              <Button1>
                <Links href="https://www.coachs-online.net/offres-d-abonnements/" target="_blank">
                  {/* <RegisterButton
                // onClick={() => scrollTo()}
                // color={isCoach ? 'pink' : 'green'}
              ></RegisterButton>*/}
                  <p style={{ color: colors.white }}>En savoir plus</p>
                </Links>
              </Button1>
            </div>
          </div>
          <CardRight className='card-right' />
        </div>
        <VideoWrapper>
          <Videoplayer controls autostart autoPlay muted loop src={Video} type="video/mp4" />
        </VideoWrapper>
      </Wrapper >
    </>
  );
}

export default memo(HomePageAffiliationSection);

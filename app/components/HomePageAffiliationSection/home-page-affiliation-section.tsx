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
import './style.css';
const ImgAceuil = require('../../images/images/imgAcueil.png');

const Wrapper = styled.div`
  width: 85%;
  margin-left: 60px;
  margin: auto;
  margin-top: 30px;
  @media screen and (max-width: 900px) {
    margin: auto
  }
`;

const CardWrapper = styled.div`
margin-left: 50px;
margin-top: 50px;
border-radius: 8px;
border: 1px solid var(--dark-grey-50, #C5C5C9);
background: var(--white, #FFF);
display: flex;
@media screen and (max-width: 900px) {
  margin-top: 90px;
  flex-direction: column;
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
  width: 90%;
  @media screen and (max-width: 900px) {
    margin-bottom: 50px;
    width: 100%;
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

const ImageAccueil = styled.div`
  background: url(${ImgAceuil});
  background-size: cover;
  background-repeat: no-repeat;
  width: 700px;
  height: 450px;
  margin-left:30px;
  border-radius: 0px 14px 14px 0px;
  @media screen and (max-width: 900px) {
    margin: auto;
    width: 100%;
  }`;

  const InfoWelcome = styled.div`
    display: flex;
    width: 400px;
    padding: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 57px;
    flex-shrink: 0;
    border-radius: 8px 0px 0px 8px;
    backdrop-filter: blur(2px);
    @media screen and (max-width: 900px) {
      flex-direction: column;
      margin-top: 80px;
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
    <>
      <Wrapper>
        <CardWrapper>
          <InfoWelcome>
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
          </InfoWelcome>
          <ImageAccueil />
        </CardWrapper>
        <VideoWrapper>
          <Videoplayer controls autostart autoPlay muted loop src={Video} type="video/mp4" />
        </VideoWrapper>
      </Wrapper >
    </>
  );
}

export default memo(HomePageAffiliationSection);

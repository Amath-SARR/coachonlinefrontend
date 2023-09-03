/**
 *
 * Welcome Banner with Title, Subtitle and Button to redirect to Subscription choice.
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import HomePageAffiliationSectionProps from '../HomePageAffiliationSection/home-page-affiliation-section.props';
import styled from 'styled-components';
import Banner from '../Banner';
import { colors } from '../../utils/colors';
import AffiliationBannerImg from '../../images/images/affiliation-banner.jpg';
import { Text } from '../../global-styles';
import Button from '../Button';
import useQuery from '../../hooks/useQuery';
const Wrapper = styled.div``;

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 120px 20px;
  position: relative;
`;
const Title = styled(Text)`
  font-size: 70px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  @media screen and (max-width: 600px) {
    font-size: 50px;
  }
`;
const Subtitle = styled(Text)`
  font-size: 45px;
  margin-bottom: 10px;
  text-align: center;
  @media screen and (max-width: 600px) {
    font-size: 25px;
  }
`;
const RegisterButton = styled(Button)`
  width: fit-content;
  margin: 0 auto;
  font-size: 24px;
`;

function WelcomeBanner(props: HomePageAffiliationSectionProps) {
  const query = useQuery();
  const isCoach = !!query.get('Ref');

  const scrollTo = () => {
    const forms = document.querySelector('#homepage_form-ref');
    const y = forms?.getBoundingClientRect().top + window.pageYOffset + -100;
    window.scrollTo({
      top: y,
      behavior: 'smooth',
      // block: 'start',
    });
  };

  return (
    <Wrapper>
      <AffiliationBanner src={AffiliationBannerImg}>
        <BannerOverlay />
      </AffiliationBanner>
      <WelcomeTextWrapper>
        <Title>Bienvenue sur Coachs Online</Title>
        <Subtitle>
          {isCoach
            ? 'Créez un compte de coach dédié et commencez à gagner un revenu passif en 2 minutes !'
            : 'Tous les cours de vos coachs préférés en illimité'}
        </Subtitle>
        <RegisterButton onClick={() => scrollTo()} color={isCoach ? 'pink' : 'green'}>
          Commencer l'expérience
        </RegisterButton>
      </WelcomeTextWrapper>
    </Wrapper>
  );
}

export default memo(WelcomeBanner);

/**
 *
 * LandingSection
 *
 */

import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { colors } from '../../utils/colors';
import Image from '../Image';
import { FlexRow } from '../../global-styles';
import useWindowSize from '../../hooks/useWindowSize';

const CyrilImg = require('./images/cyril-darmon.png');
const OlivierImg = require('./images/olivier-madelrieux.png');
const GaelleImg = require('./images/gaelle-pelloille.png');
const CellPhoneImg = require('./images/cell-phone.png');
const CoachsImg = require('./images/coachs-logo.png');
const KakuterImg = require('./images/kakuter.png');
const LaptopImg = require('./images/laptop.png');

const Wrapper = styled.div`
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;
const Section = styled.section`
  min-height: 800px;
  width: 100%;
  //border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 40px;
  position: relative;
  @media screen and (max-width: 920px) {
    padding: 0 10px;
    max-width: 100%;
    overflow: hidden;
    margin-bottom: 10px;
    min-height: 300px;
  }
`;
const SectionHeader = styled.div`
  background: ${colors.lilac};
  border-radius: 12px;
  color: ${colors.white};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 26px;
  padding: 10px 20px;
  margin: 0 auto 20px auto;
  width: fit-content;
`;
const TextBase = styled.p`
  margin: 0;
  padding: 0;
  color: ${colors.white};
  line-height: 30px;
  font-size: ${props => props.style?.fontSize};
  @media screen and (max-width: 920px) {
    font-size: ${props => props.style?.mobileFontSize || '24px'} !important;
    text-align: center;
  }
`;
const HighlightedText = styled.span`
  background: ${colors.lilac};
  line-height: 30px;
  padding: 5px 8px;
  //margin: 0 -8px;
  border-radius: 12px;
  color: ${colors.white};
  font-size: ${props => props.style?.fontSize};
  @media screen and (max-width: 920px) {
    font-size: 24px !important;
  }
`;
const Profiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
`;
const ProfileImage = styled.img`
  width: 284px;
  height: auto;
  margin-bottom: 10px;
`;
const ProfileName = styled(TextBase)`
  font-size: 26px;
  font-weight: 500;
  margin-bottom: 15px;
`;
const PhoneImage = styled(Image)`
  float: left;
  z-index: 1;
  flex: 1;
  max-width: 456px;
  @media screen and (max-width: 920px) {
    float: unset;
  }
`;
const RowToColumn = styled(FlexRow)`
  @media screen and (max-width: 920px) {
    flex-direction: column;
  }
`;
const MobileRestrictedImage = styled(Image)`
  ${props => props.style};
  @media screen and (max-width: 920px) {
    max-width: 100% !important;
  }
`;

function LandingSection() {
  const { width } = useWindowSize();
  return (
    <Wrapper>
      <Section>
        <SectionHeader>Pour vous</SectionHeader>
        <TextBase
          style={{
            fontSize: 55,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: width > 920 ? '70px' : '40px',
          }}
        >
          Coachs, Formateurs, Conférenciers et Auteurs issus de la francophonie
          mondiale.
        </TextBase>
        {/* promo video here */}
      </Section>
      <Section>
        <SectionHeader>Qui sommes nous ?</SectionHeader>
        <TextBase style={{ maxWidth: '730px', margin: '20px auto' }}>
          <HighlightedText>
            Coachs Online est une plateforme en ligne proposant des formations{' '}
            <br />
          </HighlightedText>
          <HighlightedText>
            et des conférences pour tous les membres inscrits et en illimité,
            <br />
          </HighlightedText>{' '}
          cette plateforme vous permet une éducation simple et intuitive, un
          accompagnement global qui a pour but d’élargir ses projets
          professionnels ou personnels et d’approfondir ses connaissances.
        </TextBase>
        <TextBase
          style={{ maxWidth: '730px', margin: '20px auto', width: '100%' }}
        >
          <HighlightedText>
            Notre mission est de vous apporter un maximum d'apprentissages en un
            minimum de temps
            <br />
          </HighlightedText>{' '}
          à travers un service pédagogique d’excellence partagé par des experts
          et à des prix imbattables.
        </TextBase>
        <Profiles>
          <ProfileWrapper>
            <ProfileImage src={CyrilImg} alt="Cyril Darmon" />
            <ProfileName>Cyril Darmon</ProfileName>
          </ProfileWrapper>
          <ProfileWrapper>
            <ProfileImage src={OlivierImg} alt="Olivier Madelrieux" />
            <ProfileName>Olivier Madelrieux</ProfileName>
          </ProfileWrapper>
          <ProfileWrapper>
            <ProfileImage src={GaelleImg} alt="Gaëlle Pelloille" />
            <ProfileName>Gaëlle Pelloille</ProfileName>
          </ProfileWrapper>
        </Profiles>
      </Section>
      <Section>
        <RowToColumn style={{ alignItems: 'center' }}>
          <PhoneImage
            style={{ display: width > 920 ? 'block' : 'none' }}
            src={CellPhoneImg}
          />
          <div>
            <TextBase
              style={{
                letterSpacing: '2px',
                fontSize: '13px',
                zIndex: 1,
                mobileFontSize: '13px',
                textTransform: 'uppercase',
              }}
            >
              An Avant-garde concept
            </TextBase>
            <TextBase
              style={{
                fontSize: '67px',
                lineHeight: width > 920 ? '95px' : '35px',

                fontWeight: 800,
                maxWidth: '500px',
              }}
            >
              Des formations{' '}
              <HighlightedText>
                pour tous,
                <br />
              </HighlightedText>{' '}
              pour toutes{' '}
              <HighlightedText>
                les envies,
                <br />
              </HighlightedText>{' '}
              pour évoluer
            </TextBase>
          </div>
        </RowToColumn>
        <MobileRestrictedImage
          style={{ position: 'absolute', zIndex: 0, opacity: 0.05 }}
          src={CoachsImg}
        />
      </Section>
      <Section>
        <MobileRestrictedImage
          style={{
            position: 'absolute',
            maxWidth: '800px',
            right: '-10%',
            zIndex: 0,
            top: '50%',
            transform: 'translateY(-40%)',
          }}
          src={KakuterImg}
        />
        <div style={{ zIndex: 1, width: '100%' }}>
          <TextBase
            style={{
              fontSize: '34px',
              lineHeight: width > 920 ? '53px' : '30px',

              fontWeight: 800,
              maxWidth: '500px',
              marginBottom: '20px',
            }}
          >
            Une offre simple,{' '}
            <HighlightedText>
              efficace,
              <br />
            </HighlightedText>
            <HighlightedText>à la portée de tous</HighlightedText> et défiant
            toute concurrence pour se former en continu et{' '}
            <HighlightedText>
              à votre rythme
              <br />
            </HighlightedText>
          </TextBase>
          <TextBase
            style={{
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          />
        </div>
      </Section>
      <Section style={{ height: 800 }}>
        <MobileRestrictedImage
          style={{
            position: 'absolute',
            zIndex: 0,
            opacity: 0.1,
            maxWidth: '700px',
            left: '50%',
            top: 0,
            transform: 'translateX(-45%)',
          }}
          src={CoachsImg}
        />
        <MobileRestrictedImage
          style={{
            position: 'absolute',
            zIndex: 1,
            maxWidth: '800px',
            bottom: '20px',
          }}
          src={LaptopImg}
        />
        <MobileRestrictedImage
          style={{
            position: 'absolute',
            zIndex: 2,
            maxWidth: '250px',
            bottom: 0,
            left: '10%',
            display: width > 920 ? 'block' : 'none',
          }}
          src={CellPhoneImg}
        />
        <div
          style={{
            position: 'absolute',
            right: '10%',
            bottom: '20%',
            zIndex: 3,
            width: '280px',
            height: '300px',
          }}
        >
          <SectionHeader
            style={{
              textTransform: 'unset',
              width: '280px',
              boxShadow: '1px 5px 50px black',
              fontSize: '18px',
              padding: '30px',
              textAlign: 'center',
              marginBottom: 0,
              zIndex: 3,
              position: 'absolute',
              top: '0',
            }}
          >
            Un abonnement <br /> unique
          </SectionHeader>
          <SectionHeader
            style={{
              textTransform: 'unset',
              width: '280px',
              boxShadow: '1px 5px 50px black',
              fontSize: '18px',
              padding: '30px',
              textAlign: 'center',
              marginBottom: 0,
              zIndex: 2,
              position: 'absolute',
              top: '100px',
            }}
          >
            Un accès illimité
            <br /> à toutes les formations
          </SectionHeader>
          <SectionHeader
            style={{
              textTransform: 'unset',
              width: '280px',
              boxShadow: '1px 5px 50px black',
              fontSize: '18px',
              padding: '30px',
              textAlign: 'center',
              marginBottom: 0,
              zIndex: 1,
              position: 'absolute',
              top: '200px',
            }}
          >
            Une simplicité d’accès
            <br /> avec ou sans engagement
          </SectionHeader>
        </div>
        <TextBase
          style={{
            fontSize: '34px',
            fontWeight: 800,
            zIndex: 4,
            maxWidth: '500px',
            marginTop: '-450px',
            textAlign: 'center',
          }}
        >
          Un tarif réfléchi et adapté aux besoins de chacun
        </TextBase>
      </Section>
    </Wrapper>
  );
}

export default LandingSection;

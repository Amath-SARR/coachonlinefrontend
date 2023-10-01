/**
 *
 * Student CTA
 * Banner CTA for students
 *
 */

import React from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import Video from '../../images/video/Coachs-Online-Promo06.mp4';
import Button from '../Button';

const Wrapper = styled.div`
  width: auto;
  display: flex;
  position:relative;
  //flex-direction: column;
  justify-content: center;
  background-color: #fff;
  margin-top: 60px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const Title = styled.p`
  font-size: 30px;
  font-weight: 100;
  text-transform: uppercase;
  margin-bottom: 20px;
  width: 320px;
  @media screen and (max-width: 900px) {
    font-size: 20px;
  }
`;
const Text = styled.p`
  font-size: 10px;
  font-weight: 20 ;
  //width: 320px;
  @media screen and (max-width: 900px) {
    font-size: 8px;
  }
`;
const Videoplayer = styled.video`
  width: 500px;
  border: 2px solid ${colors.lilac};
  border-radius: 10px;
  @media screen and (max-width: 900px) {
    margin-bottom: 10px;
    width: 300px;
    height: auto;
  }
`;
const VideoWrapper = styled.div`
  margin: auto;
`;
const RegisterButton = styled(Button)`
  width: 200px;
  font-size: 14px;
  border-color: ${colors.mainPink};
  background-color: ${colors.mainPink};

  @media screen and (max-width: 920px) {
    width: 120px;
    font-size: 12px;
    margin-bottom: 50px;
  }
`;
const Links = styled.a`
  text-decoration: none;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const CardLeft = styled.div`
  margin-left: 15px;
  @media screen and (max-width: 900px) {
    margin-bottom: 10px;
    width: 300px;
    height: auto;
  }
`;

const CardRight = styled.div`
  margin-left: 100px;
  @media screen and (max-width: 900px) {
    margin-bottom: 10px;
    width: 300px;
    height: auto;
  }
`;

function StudentsCta(props) {
  return (
    <div>
      <Wrapper>
          <CardLeft>
            <Title>Faites un pas de plus vers vos objectifs personnels et professionnels</Title>
            <Text>
              87 % des personnes qui apprennent pour se perfectionner font état d'avantages
              professionnels tels qu'une promotion, une augmentation ou le début d'une nouvelle
              carrière.
            </Text>
            <ButtonWrapper>
              <Links href="https://www.coachs-online.net/offres-d-abonnements/" target="_blank">
                <RegisterButton
                  style={{
                    backgroundColor: colors.mainPink,
                    color: colors.white,
                    width: 'fit-content',
                    fontSize: '10px',
                    fontWeight: '100',
                    marginTop: '10px',
                    textTransform: 'uppercase',
                  }}
                >
                  En savoir plus
                </RegisterButton>
              </Links>
            </ButtonWrapper>
          </CardLeft>
          <CardRight>
            <VideoWrapper>
              <Videoplayer controls autostart autoPlay muted loop src={Video} type="video/mp4" />
            </VideoWrapper>
          </CardRight>
      </Wrapper>
    </div>
  );
}

export default StudentsCta;

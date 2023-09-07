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
  width: 100%;
  display: flex;
  //flex-direction: column;
  justify-content: center;
  background-color: #fff;
  @media screen and (max-width: 900px) {
    height: 700px;
  }
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 70px;
`;
const Title = styled.p`
  font-size: 30px;
  font-weight: 100;
  text-transform: uppercase;
  margin-bottom: 20px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
  }
`;
const Text = styled.p`
  font-size: 10px;
  font-weight: 20 ;
  @media screen and (max-width: 500px) {
    font-size: 15px;
  }
`;
const Videoplayer = styled.video`
  width: 500px;
  border: 2px solid ${colors.lilac};
  border-radius: 10px;
  @media screen and (max-width: 920px) {
    width: 320px;
  }
`;
const VideoWrapper = styled.div`
  margin: auto;
  @media screen and (max-width: 520px) {
    box-shadow: 0px 0px 0px 0px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
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
  margin-left: -50px;
`;

const CardRight = styled.div`
  margin-left: 100px;
`;

function StudentsCta(props) {
  return (
    <div>
      <Wrapper>
        <Container>
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
        </Container>
      </Wrapper>
    </div>
  );
}

export default StudentsCta;

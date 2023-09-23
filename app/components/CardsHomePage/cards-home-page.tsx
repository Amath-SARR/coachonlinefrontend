import React from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { Text } from '../../global-styles';
import icon1 from '../../images/icons/24-hours-support-pink.png';
import icon2 from '../../images/icons/smart-devices-pink.png';
import icon3 from '../../images/icons/goal-pink.png';
import Button from '../Button';
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  margin-left: -15px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;
const Card = styled.div`
  width: 350px;
  height: 230px;
  margin-left: 20px;
  background: #F8F7FB;
  border-radius: 15px;
  //box-shadow: 2px 2px 2px 2px #dbd6d6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-block-end: 40px;
  padding: 15px;
  @media screen and (max-width: 900px) {
    margin-bottom: 10px;
    width: 300px;
    height: 300px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
  @media screen and (max-width: 900px) {
    font-size: 20px;
  }
`;

const Texte = styled.p`
  font-size: 15px;
  text-align: center;
  @media screen and (max-width: 900px) {
    font-size: 13px;
  }
`;

const Intro = styled.p`
  text-transform: uppercase;
  color: ${colors.lilac};
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
`;

const Title1 = styled(Text)`
  font-size: 15px;
  margin-bottom: 20px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
  }
`;

const Title = styled.p`
  margin-top: 30px;
  color: var(--rose, #E21680);
  font-size: 30px;
  font-weight: 100;
  text-transform: uppercase;
  margin-bottom: 20px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
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
  margin-left: 860px;
  margin-top: -40px;
  display: flex;
`;

function CardsHomePage(props) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '50px' }}>
      {/* <Intro>LET'S TRY !</Intro> */}
      <Title>Pourquoi rejoindre Coachs Online ?</Title>
      <Title1>
        Notre objectif est de vous transmettre le maximum de contenus en un minimum de temps
      </Title1>
      <hr />
      <Wrapper>
        <Card>
          <img src={icon3} width="60px" style={{ marginBottom: '10px' }} />
          <Subtitle>Des formations à la hauteur de vos attentes</Subtitle>
          <Texte>Formez-vous à votre rythme.</Texte>
          <Texte>Inscrivez-vous en 5 minutes.</Texte>
          <Texte>Désabonnez vous en 1 clic</Texte>
        </Card>
        <Card>
          <img src={icon2} width="60px" style={{ marginBottom: '10px' }} />
          <Subtitle>Une plateforme de formations adaptable</Subtitle>
          <Texte>
            L'ensemble des formations sont disponibles sur votre ordinateur, tablette et téléphone
            portable.
          </Texte>
        </Card>
        <Card>
          <img src={icon1} width="60px" style={{ marginBottom: '10px' }} />
          <Subtitle>Accédez à l'ensemble des vidéos de formation en illimité</Subtitle>
          <Texte>Accédez à l'ensemble des vidéos de formation 24h/24</Texte>
        </Card>
      </Wrapper>
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
    </div>
  );
}

export default CardsHomePage;

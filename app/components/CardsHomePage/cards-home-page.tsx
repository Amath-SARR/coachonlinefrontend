import React from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { Text } from '../../global-styles';
import icon1 from '../../images/icons/24-hours-support-pink.png';
import icon2 from '../../images/icons/smart-devices-pink.png';
import icon3 from '../../images/icons/goal-pink.png';
const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 50px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;
const Card = styled.div`
  width: 350px;
  height: 350px;
  background: ${colors.white};
  border-radius: 15px;
  //box-shadow: 2px 2px 2px 2px #dbd6d6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  @media screen and (max-width: 900px) {
    margin-bottom: 10px;
    width: 300px;
    height: 300px;
  }
`;
const Title = styled(Text)`
  font-size: 40px;
  color: black;
  text-align: center;
  font-weight: 500;
  @media screen and (max-width: 900px) {
    font-size: 20px;
  }
`;
const Title2 = styled(Text)`
  font-size: 25px;
  color: black;
  text-align: center;
  font-weight: 500;
  @media screen and (max-width: 900px) {
    font-size: 18px;
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

function CardsHomePage(props) {
  return (
    <div style={{ backgroundColor: '#F8F7FB', padding: '50px' }}>
      {/* <Intro>LET'S TRY !</Intro> */}
      <Title>Pourquoi rejoindre Coachs Online ?</Title>
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
      <Title2>
        Notre objectif est de vous transmettre le maximum de contenus en un minimum de temps
      </Title2>
    </div>
  );
}

export default CardsHomePage;

import React from 'react';
import styled from 'styled-components';
import './style.css';

const sante = require('../../images/images/sante.png');
const bienEtre = require('../../images/images/bienEtre.png');
const sport = require('../../images/images/sport.png');
const animaux = require('../../images/images/animaux.png');
const bureatique = require('../../images/images/bureautique.png');
const design = require('../../images/images/design.png');
const esthetique = require('../../images/images/esthetique.png');
const langue = require('../../images/images/langue.png');

const HorizontalDisplay = styled.div`
  margin-left: 20px;
  margin-block-end: 20px;
  margin-block-start: -20px;
`;

const Container = styled.span`
  position: relative;
  text-align: center;
  text-transform: uppercase;
  color: white;
  //margin-block-end: 50px;
  margin-left: 10px;
  flex-direction: row;
  @media screen and (max-width: 900px) {
    margin-top: 50px;
  }
`;

function HomePageCatecory() {
  return (
    <>
      <HorizontalDisplay>
        <Container>
          <img src={sante} alt="Snow" className='image' />
          <div className="centered">Sante</div>
        </Container>
        <Container className="container">
          <img src={bienEtre} alt="Snow" className='image' />
          <div className="centered">Bien-Etre</div>
        </Container>
        <Container>
          <img src={sport} alt="Snow" className='image' />
          <div className="centered">Sport&Fitness</div>
        </Container>
        <Container>
          <img src={animaux} alt="Snow" className='image' />
          <div className="centered">Animaux</div>
        </Container>
        <Container>
          <img src={bureatique} alt="Snow" className='image' />
          <div className="centered">Bureatique</div>
        </Container>
        <Container>
          <img src={design} alt="Snow" className='image' />
          <div className="centered">Design</div>
        </Container>
        <Container>
          <img src={esthetique} alt="Snow" className='image' />
          <div className="centered">esthetique</div>
        </Container>
        <Container>
          <img src={langue} alt="Snow" className='image' />
          <div className="centered">langue</div>
        </Container>
      </HorizontalDisplay>

    </>
  )
}

export default HomePageCatecory;

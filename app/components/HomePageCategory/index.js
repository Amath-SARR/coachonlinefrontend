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
  margin-block-end: 50px;
  margin-block-start: -20px;
`;

function HomePageCatecory() {
  return (
    <>
      <HorizontalDisplay>
        <span className="container">
          <img src={sante} alt="Snow" className='image' />
          <div className="centered">Sante</div>
        </span>
        <span className="container">
          <img src={bienEtre} alt="Snow" className='image' />
          <div className="centered">Bien-Etre</div>
        </span>
        <span className="container">
          <img src={sport} alt="Snow" className='image' />
          <div className="centered">Sport&Fitness</div>
        </span>
        <span className="container">
          <img src={animaux} alt="Snow" className='image' />
          <div className="centered">Animaux</div>
        </span>
        <span className="container">
          <img src={bureatique} alt="Snow" className='image' />
          <div className="centered">Bureatique</div>
        </span>
        <span className="container">
          <img src={design} alt="Snow" className='image' />
          <div className="centered">Design</div>
        </span>
        <span className="container">
          <img src={esthetique} alt="Snow" className='image' />
          <div className="centered">esthetique</div>
        </span>
        <span className="container">
          <img src={langue} alt="Snow" className='image' />
          <div className="centered">langue</div>
        </span>
      </HorizontalDisplay>

    </>
  )
}

export default HomePageCatecory;

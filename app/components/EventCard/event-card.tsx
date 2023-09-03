/**
 *
 * EventCard
 *
 */

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import EventCardProps from './event-card.props';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import makeSelectDashboard from '../../containers/Dashboard/selectors';
// import { getCategoriesAction } from '../../containers/Dashboard/actions';

import { Carousel } from 'react-responsive-carousel';
import {
  ArrowLeft,
  ArrowLeftWrapper,
  ArrowRight,
  ArrowRightWrapper,
  Icon,
} from '../HomepageCarousel';
import ChevronRightIcon from '../../images/icons/arrow-point-to-right.png';
import { colors } from '../../utils/colors';
import useWindowSize from '../../hooks/useWindowSize';
//import makeSelectAuth from '../../containers/Auth/selectors';
import Button from '../Button';
import './carousel.css';
import img from '../../images/images/background-image.jpg';
const SINGLE_ITEM_WIDTH = 300;

const Wrapper = styled.div`
  background-color: #f8f7fb;
  //background-image: url(${img}); 
  //background-size: content;
  //background-podition: center;
  padding: 50px;
`;

const WrapperCarousel = styled.div`
  width: 85%;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 100px;
  .carousel.carousel-slider .control-arrow:hover {
    background-color: unset;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${SINGLE_ITEM_WIDTH}px;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(59, 59, 142, 0.7091430322128851) 6%,
    rgba(229, 19, 125, 1) 100%
  );
  border-radius: 15px;
  @media screen and (max-width: 500px) {
    padding: 5px;
  }
`;

const InfoWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 292px;
  background: white;
  border-radius: 11px;
  @media screen and (max-width: 920px) {
    display: none;
  }
`;

const Name = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: black;
  @media screen and (max-width: 500px) {
    font-size: 15px;
  }
`;

const CategoryContainer = styled.div`
  justify-content: center;
  display: flex;
  margin-left: 30px;
  margin-right: 30px;
  // margin-bottom: 80px;
  margin-top: 50px;
`;

const Title = styled.p`
  display: flex;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 8px;
  margin-top: 30px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  display: flex;
  margin-right: 200px;
  margin-left: 200px;
  justify-content: center;
  text-align: center;
  font-size: 18px;
  margin-bottom: 15px;
  @media screen and (max-width: 500px) {
    margin-right: 10px;
    margin-left: 10px;
    font-size: 11px;
  }
`;

const Subtitle2 = styled.p`
 display: none;
  @media screen and (max-width: 920px) {
    display: flex;
    // margin-right: 200px;
    // margin-left: 200px;
    justify-content: center;
    text-align: center;
    font-size: 13px;
    margin-bottom: 15px;
`;

const Indicator = styled.div`
  width: 30px;
  border-bottom: 3px solid ${(props) => (props.selected ? colors.lilac : colors.borderDark)};
  margin: 0 2px;
  cursor: pointer;
`;

const EventImage = styled.img`
  width: 150px;
  border-radius: 10px;
  //margin: auto;
  // margin-right: -50px;
  // margin-top: -40px;
  @media screen and (max-width: 1200px) {
    width: 200px;
  }
`;

const RegisterButton = styled(Button)`
  width: 200px;
  // margin-left: 6px;
  // font-size: 24px;
  @media screen and (max-width: 920px) {
    width: 120px;
    font-size: 12px;
  }
`;

const Links = styled.a`
  text-decoration: none;
  display: flex;
  // align-content: center;
  justify-content: center;
`;

const LIST_EVENT_IMAGES = [
  require('../../images/maverick-event/maverick-event-1.jpg'),
  require('../../images/maverick-event/maverick-event-2.jpg'),
  require('../../images/maverick-event/maverick-event-3.jpg'),
  require('../../images/maverick-event/maverick-event-4.jpg'),
  require('../../images/maverick-event/maverick-event-5.jpg'),
  require('../../images/maverick-event/maverick-event-6.jpg'),
  require('../../images/maverick-event/maverick-event-7.jpg'),
  require('../../images/maverick-event/maverick-event-8.jpg'),
  require('../../images/maverick-event/maverick-event-9.jpg'),
];

const LIST_EVENT_TEXTES = [
  '9 Conférences impactantes qui vont vous donner des clefs, créer des déclics, vous inspirer.',
  'Des conférences qui sont toutes complémentaires et qui ont le même objectif : vous permettre de devenir une meilleure version de vous-même ! ',
  'Des moments conviviaux pour connecter avec ceux qui vous ressemblent',
  'Pauses-café, brunchs, dîner de gala, ces moments sont riches de rencontres inspirantes et vous permettront aussi d’échanger avec les conférenciers.',
  '​Une soirée de Gala',
  'Soirée exceptionnelle avec un dîner en présence des conférenciers et du staff Coachs Online. ',
  'Spectacle privé avec le mentaliste Jean-Sébastien Masset.',
  'Animée par un DJ d’exception (il anime toutes soirées Jet set, y compris celles de Monaco).',
  "Venez vivre l'Evénement Maverick à l'hôtel Mercure Paris CDG.",
];

function EventCard(props: EventCardProps) {
  const { getCategories, dashboard } = props;
  const wrapperRef = useRef();
  const { width } = useWindowSize();

  // useEffect(() => {
  //   getCategories();
  // }, []);

  const ImageItem = ({ image, index }) => (
    <CategoryContainer ref={wrapperRef}>
      <InfoWrapper key={index}>
        <EventImage src={image} alt="coach"></EventImage>
      </InfoWrapper>

      <InfoWrapper2 key={index}>
        <Name>{LIST_EVENT_TEXTES[index]}</Name>
      </InfoWrapper2>
    </CategoryContainer>
  );

  const calcSingleItemMinWidth = () => {
    const wrapperWidth = wrapperRef.current?.offsetWidth;
    // 10 is the margin
    return ((SINGLE_ITEM_WIDTH + 2) * 100) / wrapperWidth;
  };

  const renderImages = () =>
    // eslint-disable-next-line react/jsx-key
    LIST_EVENT_IMAGES.map((image, index) => <ImageItem key={index} image={image} index={index} />);

  return (
    <Wrapper>
      <Title>Evénement Maverick</Title>
      <Subtitle style={{ fontWeight: 'bold' }}> SAMEDI 26 ET DIMANCHE 27 NOVEMBRE 2022</Subtitle>
      <Subtitle>
        {' '}
        1 week-end exceptionnel pour donner un coup de boost à votre bien-être et votre mental{' '}
      </Subtitle>
      <Subtitle2>
        Pauses-café, brunchs, dîner de gala, ces moments sont riches de rencontres inspirantes et
        vous permettront aussi d’échanger avec les conférenciers.
      </Subtitle2>
      <Subtitle2>
        ​Une soirée de Gala exceptionnelle avec un dîner en présence des conférenciers et du staff
        Coachs Online.
      </Subtitle2>
      <Subtitle2>
        Spectacle privé avec le mentaliste Jean-Sébastien Masset, animée par un DJ d’exception (il
        anime toutes soirées Jet set, y compris celles de Monaco).{' '}
      </Subtitle2>
      <Subtitle2> Venez vivre l'Evénement Maverick à l'hôtel Mercure Paris CDG.</Subtitle2>
      <WrapperCarousel style={{ display: 'flex', justifyContent: 'center' }}>
        <Carousel
          swipeable={width <= 600}
          className="category-list"
          autoPlay
          infiniteLoop
          transitionTime={1000}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          //centerSlidePercentage={calcSingleItemMinWidth()}
          centerSlidePercentage={100}
          //selectedItem={currentIndex}
          centerMode
          // renderIndicator={(clickHandler, selected) => (
          //   <Indicator selected={selected} onClick={clickHandler} />
          // )}
          renderArrowPrev={(clickHandler, hasPrev) =>
            hasPrev && (
              <ArrowLeftWrapper style={{ position: 'absolute ' }}>
                <ArrowLeft onClick={clickHandler}>
                  <Icon src={ChevronRightIcon} />
                </ArrowLeft>
              </ArrowLeftWrapper>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext && (
              <ArrowRightWrapper style={{ position: 'absolute ' }}>
                <ArrowRight onClick={clickHandler}>
                  <Icon src={ChevronRightIcon} />
                </ArrowRight>
              </ArrowRightWrapper>
            )
          }
        >
          {renderImages()}
        </Carousel>
      </WrapperCarousel>
      <div>
        <Links href="https://www.evenementmaverick.com" target="_blank">
          <RegisterButton
            style={{
              backgroundColor: colors.mainPink,
              color: colors.white,
              width: 'fit-content',
              fontSize: '20px',
              fontWeight: '400',
            }}
          >
            Participer à l'événement Maverick
          </RegisterButton>
        </Links>
      </div>
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // getCategories: () => dispatch(getCategoriesAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, memo)(EventCard);

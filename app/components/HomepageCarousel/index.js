/**
 *
 * HomepageCarousel
 *
 */

import React, { memo, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import { BASE_URL } from '../../config/env';
import { colors } from '../../utils/colors';
import { Category } from '../CategorySelector';
import Image from '../Image';
import ChevronRightIcon from '../../images/icons/arrow-point-to-right.png';
import useWindowSize from '../../hooks/useWindowSize';
import AspectRatioContainer from '../AspectRatioContainer';
import { fullName } from '../../utils/formatters';
import './style.css';

const PlayIconViolet = require('../../images/icons/play--violet.svg');

const Wrapper = styled.div`
  width: 85%;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 100px;
  .carousel-root {
    background-color: ${colors.backgroundBlackBlue};
  }
  .carousel.carousel-slider .control-arrow:hover {
    background-color: unset;
  }
  @media screen and (max-width: 920px) {
    margin-top: 130px;
    width: 90%;
  }
`;

export const ArrowRightWrapper = styled.div`
  //position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 40px;
  margin-right: 50px;
  right: -10px;
  top: 0;
  z-index: 1;
  @media screen and (max-width: 920px) {
    width: 30px;
    display: none;
  }
`;
export const ArrowLeftWrapper = styled(ArrowRightWrapper)`
  right: unset !important;
  left: -10px;
  margin-left: 50px;
`;
export const ArrowRight = styled.div`
  cursor: pointer;

  //border: 1px solid ${colors.lilac};
  border-radius: 60px;
  background-color: ${colors.lilac};
  box-shadow: 2px 2px 2px rgba(8, 15, 52, 0.1);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 8px;
`;
export const ArrowLeft = styled(ArrowRight)`
  transform: rotate(180deg);
`;
export const Icon = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const SingleItemWrapper = styled(AspectRatioContainer)`
  width: calc(100% - 200px);
  max-width: 1460px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  margin: 0 auto;
  background-image: url(${(props) => props.img});
  background-position-y: 10%;
  background-position-x: 50%;
  background-size: cover;
  background-color: ${colors.backgroundBlackBlue};
  @media screen and (max-width: 600px) {
    width: 100%;
    border-radius: 16px;
  }
`;
const PlayButton = styled.div`
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
`;
const DarkOverlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: radial-gradient(closest-side, #003a6090 0%, ${colors.backgroundBlackBlue} 100%);
  opacity: 0.5;
  &:hover {
    opacity: 0.9;
    background: radial-gradient(#003a6090 0%, ${colors.backgroundBlackBlue} 70%);
    z-index: 1;
    ${PlayButton} {
      opacity: 1;
    }
  }
`;
const PlayIcon = styled(Image)`
  width: 100%;
  height: auto;
`;
const InfoWrapper = styled.div`
  padding: 40px 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  z-index: 1;
  @media screen and (max-width: 900px) {
    padding: 40px 35px;
  }
  &:hover {
    ${DarkOverlay} {
      opacity: 0.9;
      background: radial-gradient(#003a6090 0%, ${colors.backgroundBlackBlue} 70%);
      z-index: 1;
    }

    ${PlayButton} {
      opacity: 1;
    }
  }
`;
const Title = styled.p`
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  color: ${colors.lilac};
  margin-bottom: 15px;
  //text-overflow: ellipsis;
  //display: -webkit-box;
  //-webkit-line-clamp: 3; /* number of lines to show */
  //-webkit-box-orient: vertical;
  //overflow: hidden;
  //-webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  //mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  //height: 70px;
  @media screen and (max-width: 900px) {
    height: 35px;
    //-webkit-line-clamp: 2; /* number of lines to show */
    width: 100%;
  }
  @media screen and (max-width: 700px) {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
  }
`;
const CourseName = styled(Title)`
  text-transform: uppercase;
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  height: 70px;
  @media screen and (max-width: 920px) {
    font-size: 14px;
    height: 30px;
  }
`;
const CoachName = styled(Title)`
  font-size: 2em;
  height: 70px;
  text-transform: unset;
  font-weight: 700;
  @media screen and (max-width: 920px) {
    font-size: 18px;
    height: 30px;
  }
`;

const Indicator = styled.div`
  width: 30px;
  border-bottom: 3px solid ${(props) => (props.selected ? colors.lilac : colors.borderDark)};
  margin: 0 2px;
  cursor: pointer;
`;

const Description = styled(Title)`
  font-size: 20px !important;
  font-weight: normal;
  text-align: left;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  height: 120px;
  @media screen and (max-width: 920px) {
    display: none;
    height: 30px;
    //-webkit-line-clamp: 2; /* number of lines to show */
    width: 100%;
  }
`;

function HomepageCarousel({ courses, onCourseClick }) {
  const CarouselItem = ({ course }) => (
    <SingleItemWrapper key={course.id} heightRatio={0.52} img={BASE_URL + course.photoUrl}>
      <InfoWrapper onClick={() => onCourseClick(course)}>
        <CoachName>{fullName(course.coach)}</CoachName>
        <CourseName className="line-clamp">{course.name}</CourseName>
        {/* <Description
          className="line-clamp"
          dangerouslySetInnerHTML={{ __html: course.description }}
        /> */}
        <Category style={{ backgroundColor: 'transparent' }}>{course.category?.name}</Category>
      </InfoWrapper>
      <DarkOverlay>
        <PlayButton onClick={() => onCourseClick(course)}>
          <PlayIcon src={PlayIconViolet} />
        </PlayButton>
      </DarkOverlay>
    </SingleItemWrapper>
  );

  const renderCourses = () => courses?.map((course) => <CarouselItem course={course} />);

  return (
    <Wrapper>
      <Carousel
        autoPlay
        infiniteLoop
        centerMode
        transitionTime={1000}
        centerSlidePercentage={100}
        showStatus={false}
        showThumbs={false}
        onSwipeEnd={(ev) => console.log(ev)}
        interval={10000}
        renderIndicator={(clickHandler, selected) => (
          <Indicator selected={selected} onClick={clickHandler} />
        )}
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
        {useMemo(renderCourses, [courses?.length])}
      </Carousel>
    </Wrapper>
  );
}

HomepageCarousel.propTypes = {};

export default HomepageCarousel;

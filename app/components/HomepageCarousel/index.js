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
import { Text } from '../../global-styles';
import ChevronRightIcon from '../../images/icons/arrow-point-to-right.png';
import useWindowSize from '../../hooks/useWindowSize';
import AspectRatioContainer from '../AspectRatioContainer';
import { fullName } from '../../utils/formatters';
import './styl.css';

const PlayIconViolet = require('../../images/icons/play--violet.svg');

const Wrapper = styled.div`
  width: 95%;
  margin: auto;
  margin-top: 0px;
  margin-bottom: 100px;
  .carousel-root {
    background-color: ${colors.backgroundBlackBlue};
  }
  .carousel.carousel-slider .control-arrow:hover {
    background-color: unset;
  }
  @media screen and (max-width: 920px) {
    margin-top: 130px;
    width: 100%;
    flex-direction: column;
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
  @media screen and (max-width: 900px) {
    width: 30px;
    flex-direction: column;
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

const PlayIcon = styled(Image)`
  width: 100%;
  height: auto;
`;

const CourseName = styled(Text)`
  height: 100px;
  //letter-spacing: 2px;
  font-size: 30px;
  font-weight: 100;
  text-transform: uppercase;
  text-align: justify;
  @media screen and (max-width: 500px) {
    font-size: 20px;
`;

const CoachName = styled.div`
  color: var(--black-grey, #191919);
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 94.023%;
`;

  const CoverImage = styled.img`
  width: auto;
  height: 500px;
  margin-left: -100px;
  background-image: url();
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 0px 14px 14px 0px;
  bottom: 32, 2%;
  @media screen and (max-width: 900px) {
    width: 100%;
    margin-left: 0;
  }
`;

  const Button = styled.button`
    display: flex;
    padding: 10px 32px;
    align-items: flex-end;
    cursor: pointer;
    border-radius: 14px;
    border: 1px solid var(--rose, #E21680);
    background: var(--rose, #E21680);
    margin-top: 130px;
    color: #fff;
    @media screen and (max-width: 900px) {
      margin-top: 0;
    }
`;

const FullWrapper = styled.div`
  width: 95%;
  margin-left: 80px;
  display: flex;
  border-radius: 14px 14px 14px 14px;
  margin: auto;
  @media screen and (max-width: 900px) {
    margin-top: 30px;
    flex-direction: column;
  }
`;

const Decription = styled.div`
  display: flex;
  width: 330px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
  margin-top:50px
  @media screen and (max-width: 900px) {
    //margin-top: 30px;
    display: flex;

  }
`;

function HomepageCarousel({ courses, onCourseClick }) {
  const CarouselItem = ({ course, index }) => (
     <div key={course.id} >
      <FullWrapper>
        <div className="card-left">
          <div className='head'>
            <span>{[index+1]+'/'+[courses?.length]}</span>
            <span className='category'>{course.category?.name}</span>
          </div>
          <Decription>
            <CoachName>{fullName(course.coach)}</CoachName>
            <CourseName> {course.name}</CourseName>
            <Button onClick={() => onCourseClick(course)}>En savoir plus</Button>
          </Decription>
        </div>
        <CoverImage src={`${BASE_URL}${course.photoUrl}`} />
      </FullWrapper>
    </div>
  );

  const renderCourses = () => courses?.map((course, index) => <CarouselItem course={course} index={index} />);

  return (
    <Wrapper>
      <Carousel
        autoPlay
        infiniteLoop
        transitionTime={1000}
        showStatus={false}
        showThumbs={false}
        showArrows={false}
        interval={2000}
        renderIndicator={(onClickHandler, isSelected, index, label) => {
          const defStyle = { marginLeft: 0, color: "black", cursor: "pointer",
          border: "1px solid var(--dark-grey-50, #C5C5C9)", borderRadius: "5px",
          display: "flex",
          width: "30px",
          height: "20px",
          padding: "1px 20px",
          flexDirection: "column",
          alignItems: "center",
        };
          const style = isSelected
            ? { ...defStyle, backgroundColor: "#E21680" }
            : { ...defStyle };
          return (
            <span
              style={style}
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`${label} ${index + 1}`}
            >
              {index+1}
            </span>
          );
        }}
      >
      {useMemo(renderCourses, [courses?.length])}
      </Carousel>
    </Wrapper>
  );
}

HomepageCarousel.propTypes = {};

export default HomepageCarousel;

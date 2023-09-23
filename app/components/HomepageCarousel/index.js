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

const PlayIcon = styled(Image)`
  width: 100%;
  height: auto;
`;

// const CourseName = styled.div`
//   color: var(--black-grey, #191919);
//   font-size: 30px;
//   font-weight: 100;
//   margin-left: -40px;
//   text-transform: uppercase;
//   margin-bottom: 20px;
//   @media screen and (max-width: 500px) {
//     font-size: 20px;
//   }
// `;

const CourseName = styled(Text)`
  height: 100px;
  letter-spacing: 2px;
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

const CardRight = styled.div`
  width: 700px;
  height: 500px;
  margin-left: -350px;
  background: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-position-x: center;
  background-position-y: center;
  background-position: bottom, right;
  border-radius: 0px 14px 14px 0px;
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
`;

const FullWrapper = styled.div`
  mmax-width: 95%;
  height: 500px;
  display: flex;
  position: relative;
  margin: auto;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  border-radius: 14px;
  border: 1px solid var(--dark-grey-50, #C5C5C9);
  background: var(--white, #FFF);
  //margin-left: 100px;
  margin-top: 30px;
  border-radius: 14px 14px 14px 14px;

  @media screen and (max-width: 95%) {
    box-shadow: 0px 0px 0px 0px;

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
          <div className='decription'>
            <CoachName>{fullName(course.coach)}</CoachName>
            <CourseName>{course.name}</CourseName>
            <Button onClick={() => onCourseClick(course)}>En savoir plus</Button>
          </div>
          {/* <div className='foot'>
            <div className="pagination">
              {courses?.map((course,index) =>
              <span className='a' onClick={() => onCourseClick(course)}>{index+1}</span>)}
            </div>
          </div> */}
        </div>
        <CardRight img={BASE_URL + course.photoUrl}/>
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

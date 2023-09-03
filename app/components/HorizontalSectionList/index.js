/**
 *
 * HorizontalSectionList
 *
 */

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import { colors } from '../../utils/colors';
import CourseListItem from '../CourseListItem';
import CourseCard from '../CourseCard/course-card';
import useWindowSize from '../../hooks/useWindowSize';
import {
  ArrowLeft,
  ArrowLeftWrapper,
  ArrowRight,
  ArrowRightWrapper,
  Icon,
} from '../HomepageCarousel';
import './style.css';

const ChevronRightIcon = require('../../images/icons/arrow-point-to-right.png');
const ChevronDownIcon = require('../../images/icons/chevron-down.svg');
const SINGLE_ITEM_WIDTH = 354;

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  //margin-bottom: 30px;
  position: relative;
  .carousel.carousel-slider {
    overflow: unset;
  }
`;
export const SectionTitle = styled.p`
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 30px;
  font-weight: bolder;
  font-family: Canaro;
  text-transform: uppercase;
  color: ${colors.lilac};
  @media screen and (max-width: 600px) {
    font-size: 18px;
  }
`;
export const ShowMore = styled.p`
  font-size: 16px;
  font-weight: bolder;
  color: ${colors.lilac};
  width: 0;
  overflow: hidden;
  transition: width 0.5s ease-in-out;
  word-break: keep-all;
  white-space: nowrap;
  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`;
export const SectionTitleWrapper = styled.div`
  padding: 10px 0;
  margin-left: 20px;
  border-radius: 10px;

  width: fit-content;
  display: flex;
  align-items: center;
  &:hover {
    ${ShowMore} {
      width: 90px;
    }
  }
  ${(props) =>
    props.clickable && {
      cursor: 'pointer',
    }}
`;

const ListItem = styled(CourseCard)`
  width: ${SINGLE_ITEM_WIDTH}px;
  //padding-right: -200px;
`;
export const CarouselNextButton = styled.div`
  cursor: pointer;
  border: 1px solid ${colors.lilac};
  padding: 10px 15px;
  border-radius: 60px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(110%, -50%);
  z-index: 1;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;
export const CarouselPrevButton = styled(CarouselNextButton)`
  left: 0;
  right: unset !important;
  transform: rotate(180deg) translate(110%, 50%);
`;
export const CarouselItemsWrapper = styled.div`
  display: flex;
  overflow: auto;
  flex-wrap: wrap;
  @media screen and (max-width: 830px) {
    justify-content: center;
  }
`;
const Chevron = styled.img`
  width: 20px;
  height: 20px;
  transform: rotate(-90deg);
  filter: invert(1);
`;
const ArrowContainer = styled.div`
  //width: 100%;
  display: flex;
  justify-content: end;
  padding-bottom: 10px;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
  margin-left: 20px;
`;
const Mobile = styled.div`
  // @media screen and (max-width: 900px) {
  //   display: flex;
  //   justify-content: center;
  //   margin-left: -10px;
  //   margin-right: -10px;
  // }
`;
function HorizontalSectionList({
  title,
  items = [],
  onItemClick,
  onTitleClick,
  withIndexes = false,
  keys = { name: 'courseName', id: 'courseId', image: 'coursePhotoUrl' },
  category,
  auth
}) {
  const { width } = useWindowSize();
  const wrapperRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItems = (list) =>
    list?.reverse().map((item, i) => (
      <ListItem
        //category={item.category?.name || title}
        key={item[keys.id]}
        item={item}
        course={item}
        onItemClick={() => onItemClick(item)}
        keys={keys}
        withIndex={withIndexes}
        index={i}
        category={category}
        canLike={!!auth?.authToken}
      />
    ));

  const calcSingleItemMinWidth = () => {
    const wrapperWidth = wrapperRef.current?.offsetWidth;
    // 10 is the margin
    return ((SINGLE_ITEM_WIDTH + 10) * 100) / wrapperWidth;
  };

  const shouldShowNextArrow = () => {
    const wrapperWidth = wrapperRef.current?.offsetWidth;
    return (
      items?.length * (SINGLE_ITEM_WIDTH + 10) > wrapperWidth && currentIndex <= items.length - 3
    );
  };

  const shouldShowPrevArrow = () => {
    const wrapperWidth = wrapperRef.current?.offsetWidth;
    return items?.length * (SINGLE_ITEM_WIDTH + 10) > wrapperWidth && currentIndex >= 1;
  };

  const onSectionTitleClick = (title) => onTitleClick && onTitleClick(title);

  if (items?.length) {
    return (
      <SectionWrapper ref={wrapperRef}>
        <Wrapper>
          <SectionTitleWrapper
            clickable={!!onTitleClick}
            onClick={() => onSectionTitleClick(title)}
          >
            <SectionTitle>{title}</SectionTitle>
            {!!onTitleClick && (
              <ShowMore style={{ fontSize: 16, margin: '0 5px' }}>Voir plus</ShowMore>
            )}
            {!!onTitleClick && <Chevron src={ChevronDownIcon} />}
          </SectionTitleWrapper>
          <ArrowContainer>
            {shouldShowPrevArrow() && (
              <ArrowLeftWrapper>
                <ArrowLeft onClick={() => setCurrentIndex(currentIndex - 2)}>
                  <Icon src={ChevronRightIcon} />
                </ArrowLeft>
              </ArrowLeftWrapper>
            )}
            {shouldShowNextArrow() && (
              <ArrowRightWrapper>
                <ArrowRight onClick={() => setCurrentIndex(currentIndex + 2)}>
                  <Icon src={ChevronRightIcon} />
                </ArrowRight>
              </ArrowRightWrapper>
            )}
          </ArrowContainer>
        </Wrapper>
        <Subtitle>Découvrez notre séléction de cours </Subtitle>
        <Mobile>
          <Carousel
            className="horizontal-list"
            swipeable={width <= 900}
            autoPlay={false}
            infiniteLoop={false}
            transitionTime={1000}
            showStatus={false}
            showThumbs={false}
            showArrows={false}
            showIndicators={false}
            selectedItem={currentIndex}
            centerMode={true}
            centerSlidePercentage={calcSingleItemMinWidth()}
            // renderArrowPrev={(clickHandler, hasPrev) =>
            //   hasPrev &&
            //
            // }
            // renderArrowNext={(clickHandler, hasNext) =>
            //   hasNext &&
            //   shouldShowNextArrow() && (
            //     <ArrowRightWrapper>
            //       <ArrowRight onClick={() => setCurrentIndex(currentIndex + 2)}>
            //         <Icon src={ChevronRightIcon} />
            //       </ArrowRight>
            //     </ArrowRightWrapper>
            //   )
            // }
          >
            {renderItems(items)}
          </Carousel>
        </Mobile>
      </SectionWrapper>
    );
  }
  return null;
}

HorizontalSectionList.propTypes = {};

export default HorizontalSectionList;

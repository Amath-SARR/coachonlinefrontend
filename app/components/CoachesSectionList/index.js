/**
 *
 * CoachesSectionList
 *
 */

import React, { useRef, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import useWindowSize from '../../hooks/useWindowSize';
import Image from '../Image';
import ChevronRightIcon from '../../images/icons/chevron-right--violet.svg';
import { SectionTitle, SectionTitleWrapper, SectionWrapper } from '../HorizontalSectionList';
import { BASE_URL } from '../../config/env';
import { colors } from '../../utils/colors';
import history from '../../utils/history';
import {
  ArrowLeft,
  ArrowLeftWrapper,
  ArrowRight,
  ArrowRightWrapper,
  Icon,
} from '../HomepageCarousel';
import { useIntersection } from '../../hooks/useIntersectionObserver';
import { readFromStorage } from '../../utils/storage';
import { fullName } from '../../utils/formatters';
import hexadecimalOpacity from '../../utils/hexadecimalOpacity';
import ChevronDownIcon from '../../images/icons/chevron-down.svg';
import { IconWrapper, LikeCounter, LikeWrapper } from '../CourseInfo/course-info';
import HeartFilledImg from '../../images/icons/heart--filled--lilac.svg';

const SINGLE_ITEM_WIDTH = 475;

export const ShowMore = styled.p`
  font-size: 16px;
  font-weight: bolder;
  color: ${colors.white};
  width: 0;
  overflow: hidden;
  transition: width 0.5s ease-in-out;
  word-break: keep-all;
  white-space: nowrap;
  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`;

const TitleWrapper = styled(SectionTitleWrapper)`
  padding: 10px 0;
  border-radius: 10px;
  margin-bottom: 20px;
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

const Overlay = styled.div`
  display: flex;
  opacity: 0.9;
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    ${(props) => props.gradientColor + hexadecimalOpacity[0]} 0%,
    ${(props) => props.gradientColor + hexadecimalOpacity[0]} 30%,
    ${(props) => props.gradientColor + hexadecimalOpacity[40]} 100%
  );
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  pointer-events: none;
`;

const Item = styled.div`
  width: ${SINGLE_ITEM_WIDTH}px;
  max-width: 100%;
  margin: 10px 10px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  :hover ${Overlay} {
    opacity: 1;
  }
`;
const ThumbnailWrapper = styled.div`
  position: relative;
  width: ${SINGLE_ITEM_WIDTH}px;
  height: 356px;
  overflow: hidden;
  display: flex;
  border-radius: 10px;
  @media screen and (max-width: 600px) {
    width: 280px;
    height: 210px;
  }
`;
const Thumbnail = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Text = styled.p`
  font-size: 22px;
  color: ${colors.white};
`;
const CoachName = styled(Text)`
  font-weight: bolder;
  margin-bottom: 10px;
`;
const CategoryName = styled(Text)`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const CoursesInfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  min-height: 65px;
  font-size: 36px;
  font-weight: bolder;
  position: absolute;
  z-index: 2;
  top: 0;
  right: 30px;
  background: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  mix-blend-mode: screen;
`;
const CoursesText = styled.p`
  font-size: 12px;
`;

const Chevron = styled.img`
  width: 20px;
  height: 20px;
  transform: rotate(-90deg);
  filter: invert(1);
`;

export const CoachItem = ({ item, index, className, style, onItemClick }) => {
  const imgParentRef = useRef();
  const [isInView, setIsInView] = useState(false);

  useIntersection(imgParentRef, () => {
    setIsInView(true);
  });

  const numberOfCourses = item.courses?.length;
  const gradientColor = '#2f51f1';
  return (
    <Item index={index} className={className} style={style} onClick={onItemClick}>
      <ThumbnailWrapper ref={imgParentRef}>
        {isInView && (
          <Thumbnail src={`${BASE_URL}${item?.profilePhotoUrl}`} style={{ maxWidth: '100%' }} />
        )}
        <Overlay gradientColor={gradientColor}>
          <CoachName>{fullName(item)}</CoachName>
          <CategoryName>{item.categories?.[0]?.name}</CategoryName>
          {/* <LikeWrapper>
              <IconWrapper style={{ marginRight: 5 }}>
                <Icon style={{ filter: 'none' }} src={HeartFilledImg} />
              </IconWrapper>
              <LikeCounter style={{ color: colors.white }}>{item.courses?.isLiked || 0}</LikeCounter>
            </LikeWrapper> */}
        </Overlay>
        <CoursesInfoText>
          {item.courses?.length}
          <CoursesText>COURS</CoursesText>
        </CoursesInfoText>
      </ThumbnailWrapper>
    </Item>
  );
};

function CoachesSectionList({
  title,
  coaches = [],
  onItemClick,
  maxItems = 6,
  keys = { name: 'courseName', id: 'courseId', image: 'coursePhotoUrl' },
}) {
  const location = useLocation();
  const { width } = useWindowSize();
  const wrapperRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToCoach = (id) => {
    const authToken = readFromStorage('authToken');
    if (authToken) {
      history.push(`coach/${id}`);
    } else {
      history.push('/auth/login', { background: location });
    }
  };

  const renderItems = (list) => {
    const coaches = filterCoaches(list);
    return coaches?.map((item, i) => (
      <CoachItem
        category={title}
        key={item.userId}
        item={item}
        onItemClick={() => goToCoach(item.userId)}
        keys={keys}
        index={i}
      />
    ));
  };

  const filterCoaches = (list) =>
    list
      ?.filter((coach) => coach.courses?.length > 0)
      ?.sort((a, b) => b.courses?.length - a.courses?.length);

  const calcSingleItemMinWidth = () => {
    const wrapperWidth = wrapperRef.current?.offsetWidth;
    // 10 is the margin
    return width <= 600 ? 100 : ((SINGLE_ITEM_WIDTH + 10) * 100) / wrapperWidth;
  };

  const shouldShowNextArrow = () => {
    const wrapperWidth = wrapperRef.current?.offsetWidth;
    const items = filterCoaches(coaches);
    return (
      items?.length * (SINGLE_ITEM_WIDTH + 10) > wrapperWidth && currentIndex <= items.length - 3
    );
  };

  const shouldShowPrevArrow = () => {
    const wrapperWidth = wrapperRef.current?.offsetWidth;
    const items = filterCoaches(coaches);
    return items?.length * (SINGLE_ITEM_WIDTH + 10) > wrapperWidth && currentIndex >= 1;
  };

  const onTitleClick = () => history.push('/coaches');

  if (coaches?.length) {
    return (
      <SectionWrapper ref={wrapperRef}>
        <TitleWrapper clickable={!!onTitleClick} onClick={() => onTitleClick()}>
          <SectionTitle>{title}</SectionTitle>
          {!!onTitleClick && (
            <ShowMore style={{ fontSize: 16, margin: '0 5px' }}>Voir plus</ShowMore>
          )}
          {!!onTitleClick && <Chevron src={ChevronDownIcon} />}
        </TitleWrapper>
        <Carousel
          swipeable={width <= 600}
          autoPlay={false}
          infiniteLoop={false}
          transitionTime={1000}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          selectedItem={currentIndex}
          centerMode
          centerSlidePercentage={calcSingleItemMinWidth()}
          renderArrowPrev={(clickHandler, hasPrev) =>
            hasPrev &&
            shouldShowPrevArrow() && (
              <ArrowLeftWrapper>
                <ArrowLeft onClick={() => setCurrentIndex(currentIndex - 2)}>
                  <Icon src={ChevronRightIcon} />
                </ArrowLeft>
              </ArrowLeftWrapper>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext &&
            shouldShowNextArrow() && (
              <ArrowRightWrapper>
                <ArrowRight onClick={() => setCurrentIndex(currentIndex + 2)}>
                  <Icon src={ChevronRightIcon} />
                </ArrowRight>
              </ArrowRightWrapper>
            )
          }
        >
          {renderItems(coaches)}
        </Carousel>
      </SectionWrapper>
    );
  }
  return null;
}

export default CoachesSectionList;

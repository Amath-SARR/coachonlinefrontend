/**
 *
 * CourseListItem
 *
 */

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Image from '../Image';
import { colors } from '../../utils/colors';
import { BASE_URL } from '../../config/env';
import { Category } from '../CategorySelector';
import PlayIconViolet from '../../images/icons/play--violet.svg';
import { useIntersection } from '../../hooks/useIntersectionObserver';
import { fullName } from '../../utils/formatters';
import HeartFilledImg from '../../images/icons/heart--filled--lilac.svg';
import { IconWrapper, LikeCounter, LikeWrapper, Icon } from '../CourseInfo/course-info';
import { FlexRow } from '../../global-styles';

const ITEM_WIDTH = 354;

const PlayButton = styled.div`
  width: 57px;
  height: 49px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const PlayIcon = styled(Image)`
  width: 100%;
  height: auto;
`;

const Overlay = styled.div`
  display: flex;
  opacity: 0.9;
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, #1a1a39 90%);
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  align-items: flex-start;
  :hover ${PlayButton} {
    opacity: 1;
  }
`;
const Index = styled.span`
  color: ${colors.lilac};
  font-size: 255px;
  line-height: 100%;
  height: 200px;
  width: 185px;
  word-break: keep-all;
  text-align: center;
  margin-right: -15px;
  opacity: 1;
  text-shadow: -1px -1px 0 ${colors.lilac}, 1px -1px 0 ${colors.lilac}, -1px 1px 0 ${colors.lilac},
    1px 1px 0 ${colors.lilac};
  transition: all 0.5s ease-in-out;
`;
const Item = styled.div`
  width: ${(props) => props.size || ITEM_WIDTH}px;
  max-width: 100%;
  margin: 10px 10px 10px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  ${(props) => props.style}

  :hover ${Overlay} {
    opacity: 1;
  }

  @media screen and (min-width: 1000px) {
    &:hover {
      ${Index} {
        margin-right: -52%;
        opacity: 0;
      }
    }
  }

  @media screen and (max-width: 360px) {
    width: 100%;
  }
  @media screen and (max-width: 600px) {
    width: 280px;
  }
`;
const ThumbnailWrapper = styled.div`
  position: relative;
  width: ${(props) => props.size || ITEM_WIDTH}px;
  height: calc(${(props) => props.size || ITEM_WIDTH}px * 0.52);
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
  height: auto;
  object-fit: cover;
`;
const Text = styled.p`
  font-size: 19px;
  color: ${colors.white};
`;
const CoachName = styled(Text)`
  font-weight: bolder;
  margin-bottom: 10px;
  font-size: 22px;
`;
const ItemName = styled(Text)`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
`;
const ProgressBarWrapper = styled.div`
  width: 282px;
  height: 25px;
  display: flex;
  padding: 5px 0;
  position: relative;
`;
const ProgressBar = styled.div`
  width: 282px;
  height: 4px;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 5px;
  transform: translateX(-50%);
`;
const ProgressBarBack = styled(ProgressBar)`
  background: #6772e5;
  opacity: 0.2;
`;
const ProgressBarFront = styled.div`
  position: relative;
  background: linear-gradient(270deg, #7474fc 0%, #2c4ce4 100%);
  width: 282px;
  height: 4px;
  border-radius: 5px;
  ${(props) => props.style};
`;
const PercentageText = styled.p`
  position: absolute;
  min-width: 15px;
  padding-top: 5px;
  word-break: keep-all;
  color: ${colors.white};
  font-size: 12px;
  right: -15px;
  bottom: -15px;
`;

function CourseListItem({
  className,
  item = [],
  onItemClick,
  category,
  keys = { name: 'courseName', id: 'courseId', image: 'coursePhotoUrl' },
  thumbnailWrapperStyle,
  style = {},
  index,
  withIndex = false,
  size = ITEM_WIDTH,
}) {
  const imgParentRef = useRef();
  const { allEpisodesCnt, watchedEpisodesCnt, watchedPercentage } = item;
  const [isInView, setIsInView] = useState(false);

  useIntersection(imgParentRef, () => {
    setIsInView(true);
  });

  const hasWatchedInfo =
    typeof allEpisodesCnt === 'number' &&
    typeof watchedEpisodesCnt === 'number' &&
    typeof watchedPercentage === 'number';
  return (
    <Item
      index={index}
      className={className}
      style={{ ...style, flexDirection: withIndex ? 'row' : 'column' }}
      size={size}
      onClick={onItemClick}
    >
      {withIndex && <Index>{index + 1}</Index>}
      <ThumbnailWrapper ref={imgParentRef} size={size} style={thumbnailWrapperStyle}>
        {isInView && (
          <Thumbnail src={`${BASE_URL}${item[keys.image]}`} style={{ maxWidth: '100%' }} />
        )}
        <Overlay>
          <CoachName>{fullName(item.coach)}</CoachName>
          <ItemName>{item[keys.name]}</ItemName>
          <FlexRow style={{ width: '100%', justifyContent: 'space-between' }}>
            <Category style={{ width: 'fit-content', height: 'fit-content' }}>
              {category || item?.category?.name}
            </Category>
            <LikeWrapper>
              <IconWrapper style={{ marginRight: 5 }}>
                <Icon style={{ filter: 'none' }} src={HeartFilledImg} />
              </IconWrapper>
              <LikeCounter style={{ color: colors.white }}>{item.likesCnt || 0}</LikeCounter>
            </LikeWrapper>
          </FlexRow>

          <PlayButton onClick={() => null}>
            <PlayIcon src={PlayIconViolet} />
          </PlayButton>
        </Overlay>
      </ThumbnailWrapper>
      {hasWatchedInfo && (
        <ProgressBarWrapper>
          <ProgressBarBack />
          <ProgressBarFront style={{ width: `${watchedPercentage}%` }}>
            <PercentageText>{`${watchedPercentage}%`}</PercentageText>
          </ProgressBarFront>
        </ProgressBarWrapper>
      )}
    </Item>
  );
}

CourseListItem.propTypes = {};

export default CourseListItem;

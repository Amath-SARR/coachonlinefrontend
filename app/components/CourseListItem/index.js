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
import ViewRose from '../../images/icons/View.svg';
import HeartRose from '../../images/icons/Heart.png';
import iconDroite from '../../images/icons/iconDroite.png';
import iconGauche from '../../images/icons/iconGauche.png';
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
  /*width: ${(props) => props.size || ITEM_WIDTH}px;
  max-width: 100%;
  margin: 10px 10px 10px 10px;
  display: flex;
  flex-direction: column;
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
  }*/
  display: flex;
  width: 352px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  border-radius: 14px;
  border: 1px solid rgba(140, 140, 148, 0.5);
  background: var(--white, #fff);
`;
const Rectangle = styled.div`
  height: 204px;
  align-self: stretch;
  border-radius: 14px 14px 0px 0px;
  border-top: 1px solid var(--dark-grey-50, #c5c5c9);
  border-right: 1px solid var(--dark-grey-50, #c5c5c9);
  border-left: 1px solid var(--dark-grey-50, #c5c5c9);
  background: url(<path-to-image>), lightgray 50% / cover no-repeat;
`;
const IconeRose = styled.img`
  width: 16px;
  height: 16px;
`;
const PetitText = styled.p`
  color: #000;

  /* Coachs - Petits icones */
  font-family: Montserrat;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const PartieDesc = styled.div`
  display: flex;
  padding: 0px 16px 20px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;
const PartieCategorie = styled.div`
  display: flex;
  padding: 8px 16px;
  align-items: flex-start;
  gap: 8px;
  position: absolute;
  right: 16px;
  top: 18px;
  border-radius: 10px;
  border: 1px solid #000;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(2px);
`;
const CategorieView = styled.p`
  color: #e21680;
  text-align: right;

  /* Coachs - Tags */
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 94.023%; /* 15.044px */
  border-radius: 14px;
  border: 1px solid rgba(140, 140, 148, 0.5);
  background: var(--white, #fff);
`;
const SousPartie1 = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;
const SousPartie2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
`;
const PartieView = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
`;
const PartieLike = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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
  height: 204px;
  align-self: stretch;
  border-radius: 14px 14px 0px 0px;
  border-top: 1px solid var(--dark-grey-50, #c5c5c9);
  border-right: 1px solid var(--dark-grey-50, #c5c5c9);
  border-left: 1px solid var(--dark-grey-50, #c5c5c9);
  background: url(<path-to-image>), lightgray 50% / cover no-repeat;
`;
const Text = styled.p`
  font-size: 19px;
  color: ${colors.white};
`;

const CoachName = styled(Text)`
  color: #000;
  text-align: right;

  /* Coachs - Sous-titre */
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  align-self: stretch;
`;
const ItemName = styled(Text)`
  height: 59px;
  align-self: stretch;
  overflow: hidden;
  color: #000;
  text-overflow: ellipsis;
  whitespace: nowrap;

  /* Coachs H4 */
  font-family: Montserrat;
  font-size: 21px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
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
      <Rectangle ref={imgParentRef} size={size} style={thumbnailWrapperStyle}>
        {isInView && (
          <Thumbnail src={`${BASE_URL}${item[keys.image]}`} style={{ maxWidth: '100%' }} />
        )}
      </Rectangle>

      <PartieDesc>
        <SousPartie1>
          <PartieView>
            <IconeRose src={ViewRose} />
            <PetitText>1 305 vues</PetitText>
          </PartieView>
          <PartieLike>
            <IconeRose src={HeartRose} />
            <PetitText> {item.likesCnt || 0} j'aime</PetitText>
          </PartieLike>
        </SousPartie1>
        <SousPartie2>
          <ItemName>{item[keys.name]}</ItemName>
          <CoachName>{fullName(item.coach)}</CoachName>
          <CategorieView> {category || item?.category?.name}</CategorieView>
        </SousPartie2>
      </PartieDesc>

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

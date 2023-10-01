/**
 *
 * ListOfEpisodes
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import useWindowSize from '../../hooks/useWindowSize';
import PlayerButtonPink from '../../images/icons/play-button-pink.png';
import Intro from '../../images/imagevideo/image0.png';
import Imagevideo1 from '../../images/imagevideo/image1.png';
import Imagevideo2 from '../../images/imagevideo/image2.png';
import Imagevideo3 from '../../images/imagevideo/image3.png';
import Imagevideo4 from '../../images/imagevideo/image4.png';
import Imagevideo5 from '../../images/imagevideo/image5.png';
import Imagevideo6 from '../../images/imagevideo/image6.png';
import Imagevideo7 from '../../images/imagevideo/image7.png';
import Imagevideo8 from '../../images/imagevideo/image8.png';
import Imagevideo9 from '../../images/imagevideo/image9.png';
import Imagevideo10 from '../../images/imagevideo/image10.png';
import Imagevideo11 from '../../images/imagevideo/image11.png';
import Imagevideo12 from '../../images/imagevideo/image12.png';
import Imagevideo13 from '../../images/imagevideo/image13.png';
import Imagevideo14 from '../../images/imagevideo/image14.png';
import Imagevideo15 from '../../images/imagevideo/image15.png';

const image = [
  Intro,
  Imagevideo1,
  Imagevideo2,
  Imagevideo3,
  Imagevideo4,
  Imagevideo5,
  Imagevideo6,
  Imagevideo7,
  Imagevideo8,
  Imagevideo9,
  Imagevideo10,
  Imagevideo11,
  Imagevideo12,
  Imagevideo13,
  Imagevideo14,
  Imagevideo15,
];
const Wrapper = styled.div`
  /* width: 100%;
  height: 100%;
  padding: 5px;
  display: inline-flex;
flex-direction: column;
justify-content: flex-end;
align-items: center;
  */
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 800px;
  border-radius: 14px;
  border: 1px solid var(--opacity, rgba(140, 140, 148, 0.5));
  background: var(--white, #fff);
  overflow-y: scroll;
  ::-webkit-scrollbar-thumb {
    background: ${colors.mainPink};
    opacity: 0.4;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  @media screen and (max-width: 920px) {
    display: flex;
    flex-direction: row;
  }
`;
const TextWhite = styled.p`
  font-size: 16px;
  color: ${colors.lilac};
`;
const EpisodeItem = styled.div`
  /* display: flex;
  flex-direction: column;
  max-width: 430px;
  min-width: 210px;
  max-height: 200px;
  //border: 1px solid ${(props) => (props.isSelected ? colors.mainPink : colors.white)};
  border-radius: 10px;
  //background: ${(props) => (props.isSelected ? colors.mainPink : colors.white)};
  margin: 0 10px 10px 10px;
  cursor: pointer;
  padding: 20px;
  @media screen and (max-width: 920px) {
    max-width: 300px;
  }*/
  display: flex;
  width: 350px;
  padding: 12px 20px 12px 12px;
  align-items: flex-start;
  gap: 16px;
  border-radius: 14px;
  background: var(--carte, #f4f4f6);
    @media screen and (max-width: 920px) {
    width:450px;
  }
`;
const Title = styled(TextWhite)`
  /* font-weight: 600;
  margin-bottom: 17px;
  border-bottom: 1px solid ${colors.black}30;
  text-align: left;
  padding-bottom: 10px;
  width: 100%;
  min-height: 30px;
  font-size: 20px;
  max-height: 40px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  transition: max-height 0.5s ease-in-out;
  &:hover {
    max-height: 2000px;
    height: auto;
    -webkit-mask-image: none;
    mask-image: none;
    overflow: auto;
  }*/

  align-self: stretch;
  color: var(--black-grey, #191919);
  font-family: Montserrat;
  font-size: 21px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
   @media screen and (max-width: 920px) {
    font-size:14px;
  }
`;
const Description = styled(TextWhite)`
  color: var(--black-grey, #191919);
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  max-height: 50px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  transition: max-height 0.5s ease-in-out;
  @media screen and (max-width: 920px) {
    height: 30px;
    width: 100%;
  }
  &:hover {
    max-height: 2000px;
    height: auto;
    -webkit-mask-image: none;
    mask-image: none;
    overflow: auto;
  }
/*
  align-self: stretch;
  

/* Coachs - Sous-titre */

font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;*/
`;

const VideoIcon = styled.img`
  width: 120px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 14px;
  background: url(<path-to-image>), lightgray 50% / cover no-repeat, #d9d9d9;
   @media screen and (max-width: 920px) {
    width:60px;
    height: 50px;
  }
  `;
const VideoDesc = styled.div`
  display: flex;
  padding-right: 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
`;

function ListOfEpisodes({ episodes, openedEpisodeIndex, onEpisodeChange, style }) {
  const { width } = useWindowSize();
  const [openedIndex, setOpenedIndex] = useState(openedEpisodeIndex);
  const [itemsRef, setItemsRefs] = useState(null);
  const wrapperRef = useRef();
  const refs = episodes?.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

  useEffect(() => {
    setOpenedIndex(null);
    setTimeout(() => setOpenedIndex(openedEpisodeIndex), 1000);
    const scrollProps =
      width > 920
        ? { behavior: 'smooth', block: 'start' }
        : { behavior: 'smooth', inline: 'start', block: 'end' };
    refs?.[episodes?.[openedEpisodeIndex]?.id]?.current?.scrollIntoView(scrollProps);
  }, [openedEpisodeIndex]);

  const renderEpisodes = (list) =>
    list?.map((episode, index) => (
      <EpisodeItem
        key={episode.id}
        ref={refs[episode.id]}
        isSelected={openedIndex === index}
        onClick={() => onEpisodeChange({ episode, index })}
      >
        <VideoIcon src={image[index]} />
        <VideoDesc>
          <Title> {episode.title}</Title>
          <Description>{episode.description}</Description>
        </VideoDesc>
      </EpisodeItem>
    ));

  return (
    <Wrapper ref={wrapperRef} style={style}>
      {renderEpisodes(episodes)}
    </Wrapper>
  );
}

export default ListOfEpisodes;

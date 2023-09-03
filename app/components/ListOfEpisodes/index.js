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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 5px;
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
  display: flex;
  flex-direction: column;
  max-width: 430px;
  min-width: 210px;
  max-height: 200px;
  border: 1px solid ${(props) => (props.isSelected ? colors.mainPink : colors.white)};
  border-radius: 10px;
  //background: ${(props) => (props.isSelected ? colors.mainPink : colors.white)};
  margin: 0 10px 10px 10px;
  cursor: pointer;
  padding: 20px;
  @media screen and (max-width: 920px) {
    max-width: 300px;
  }
`;
const Title = styled(TextWhite)`
  font-weight: 600;
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
  }
`;
const Description = styled(TextWhite)`
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
`;

const VideoIcon = styled.img`
  width: 30px;
  margin-right: 10px;
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
        <Title>
          {' '}
          <VideoIcon src={PlayerButtonPink} />
          {episode.title}
        </Title>
        <Description>{episode.description}</Description>
      </EpisodeItem>
    ));

  return (
    <Wrapper ref={wrapperRef} style={style}>
      {renderEpisodes(episodes)}
    </Wrapper>
  );
}

export default ListOfEpisodes;

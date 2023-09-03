import React, { useRef, useState } from 'react';
import SoundControlProps from './sound-control.props';
import styled from 'styled-components';
const SpeakerImg = require('../../../images/icons/speaker.svg');
const SpeakerNoSoundImg = require('../../../images/icons/speaker--no-sound.svg');

const Wrapper = styled.div`
  display: flex;
  width: 150px;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  @media screen and (max-width: 900px) {
    width: 120px;
  }
`;
const Bar = styled.div`
  height: 40px;
  width: 90%;
  position: relative;
  cursor: pointer;
  align-items: center;
  display: flex;
  margin-right: 20px;
`;
const ProgressLine = styled.div`
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #2f51f1 0%, #7574fc 100%);
`;
const PositionWrapper = styled.div`
  position: absolute;
  width: 60px;
  top: 50%;
  transition: all 0.5s linear;
  left: ${(props: { left: string }) => props.left};
  transform: translate(-15%, -50%);
`;
const PositionDot = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background: #3f59f3;
`;
const SoundIcon = styled.img`
  height: 25px;
  width: auto;
  cursor: pointer;
  margin: 0 10px;
  filter: invert(1);
  @media screen and (max-width: 1366px) {
    height: 30px;
  }
  @media screen and (max-width: 900px) {
    height: 20px;
  }
`;
function SoundControl(props: SoundControlProps) {
  const { onBarClick, currentPosition: position } = props;
  const [valueBeforeMute, setValueBeforeMute] = useState(0);
  const [mute, setMute] = useState(false);
  const progressBarRef = useRef();

  const calcProgressToPosition = (position: number) =>
    `${position * progressBarRef?.current?.offsetWidth}px`;
  const calcPositionToProgress = (position: number) =>
    position / progressBarRef?.current?.offsetWidth;

  const onPositionChange = (ev: MouseEvent) => {
    const eventPosition = ev.clientX - ev.currentTarget.getBoundingClientRect()?.left;
    const position = calcPositionToProgress(eventPosition > 0 ? eventPosition : 0);
    setValueBeforeMute(position);
    setMute(!(position > 0));
    onBarClick(position);
  };

  const toggleMute = () => {
    if (!mute) {
      setValueBeforeMute(position);
      onBarClick(0);
    } else {
      onBarClick(valueBeforeMute);
      setValueBeforeMute(0);
    }
    setMute(!mute);
  };

  return (
    <Wrapper>
      <SoundIcon src={mute ? SpeakerNoSoundImg : SpeakerImg} onClick={toggleMute} />
      <Bar ref={progressBarRef} onClick={onPositionChange}>
        <ProgressLine />
        <PositionWrapper left={calcProgressToPosition(position)}>
          <PositionDot />
        </PositionWrapper>
      </Bar>
    </Wrapper>
  );
}

export default SoundControl;

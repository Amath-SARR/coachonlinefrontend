import React, { useRef, memo } from 'react';
import ProgressBarProps from './progress-bar.props';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
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
  transform: translateY(-75%);
`;
const PositionDot = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background: #3f59f3;
`;
const PositionText = styled.p`
  font-size: 14px;
  color: white;
  top: 0;
  word-break: keep-all;
`;

function ProgressBar(props: ProgressBarProps) {
  const { onBarClick, currentPosition: position, duration } = props;
  const progressBarRef = useRef();

  const calcProgressToPosition = (progress: number) =>
    `${(progress * progressBarRef?.current?.offsetWidth) / duration}px`;
  const calcPositionToProgress = (position: number) =>
    (position * duration) / progressBarRef?.current?.offsetWidth;

  const onPositionChange = (ev: MouseEvent) => {
    const position = calcPositionToProgress(
      ev.clientX - ev.currentTarget.getBoundingClientRect()?.left,
    );
    onBarClick(position);
  };

  const convertToMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const minutesRest = minutes - hours * 60;
    const secondsRest = Math.round(seconds - minutes * 60);
    const minutesString =
      minutesRest.toString().length > 1 ? minutesRest.toString() : `0${minutesRest.toString()}`;
    const secondsString =
      secondsRest.toString().length > 1 ? secondsRest.toString() : `0${secondsRest.toString()}`;
    return !hours
      ? `${hours}:${minutesString}:${secondsString}`
      : `${minutesString}:${secondsString}`;
  };

  return (
    <Wrapper>
      <Bar ref={progressBarRef} onClick={onPositionChange}>
        <ProgressLine />
        <PositionWrapper left={calcProgressToPosition(position)}>
          <PositionText>{convertToMinutesAndSeconds(position)}</PositionText>
          <PositionDot />
        </PositionWrapper>
      </Bar>
      <PositionText>{convertToMinutesAndSeconds(duration)}</PositionText>
    </Wrapper>
  );
}

export default memo(ProgressBar);

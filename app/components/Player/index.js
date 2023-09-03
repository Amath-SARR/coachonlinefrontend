/**
 *
 * Player
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Image from '../Image';
import { colors } from '../../utils/colors';
import AspectRatioContainer from '../AspectRatioContainer';
import { useFullScreen } from '../../hooks/useFullScreen';
import ProgressBar from './ProgressBar/progress-bar';
import SoundControl from './SoundControl/sound-control';
import { FlexRow } from '../../global-styles';
const PlayImg = require('../../images/icons/play--player.svg');
const PauseImg = require('../../images/icons/pause.svg');
const ForwardImg = require('../../images/icons/forward.svg');
const BackwardImg = require('../../images/icons/backward.svg');
const FullscreenImg = require('../../images/icons/fullscreen--white.svg');
const GoBackImg = require('../../images/icons/back-arrow.svg');
const CoachLogoImg = require('../../images/logo/logo.png');

const FullscreenButton = styled.div`
  position: absolute;
  z-index: 99;
  left: ${(props) => props.fullscreen && '10px'};
  right: ${(props) => !props.fullscreen && '10px'};
  top: 10px;
  width: 20px;
  height: auto;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: all 0.5s ease-in-out;
  mix-blend-mode: difference;
  cursor: pointer;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  color: ${colors.white};
  width: 100%;
  max-width: 750px;
  height: 140px;
  border-radius: 10px;
  padding: 10px 20px;
  background-color: #00000080;
  backdrop-filter: blur(3px);
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: all 0.5s ease-in-out;
  z-index: 1;
  @media screen and (max-width: 1366px) {
    height: 180px;
  }
  @media screen and (max-width: 800px) {
    height: 120px;
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  height: 45px;
  position: relative;
  width: 100%;
  @media screen and (max-width: 1366px) {
    margin: 10px 0;
  }
  @media screen and (max-width: 900px) {
    justify-content: start;
    height: 35px;
  }
`;
const Button = styled.div`
  height: auto;
  width: 40px;
  cursor: pointer;
  margin: 0 30px;
  transition: all 0.3s ease-in-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  @media screen and (max-width: 1366px) {
    width: 30px;
  }
`;
const SmallerButton = styled.div`
  height: 35px;
  width: auto;
  cursor: pointer;
  display: flex;
  @media screen and (max-width: 1366px) {
    width: 25px;
  }
`;
const Icon = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled(AspectRatioContainer)`
  position: relative;
  display: flex;
  width: 100%;
  max-width: 1166px;
  max-height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  margin: auto;
  overflow: hidden;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const Video = styled.video`
  width: 100%;
  height: auto;
  margin: auto;
  object-fit: contain;
  object-position: center center;
`;

let timer;
function Player({
  src,
  styles = {},
  onCanPlay: onCanPlayProp = (videoRef) => null,
  onLoadMetaData: onLoadMetaDataProp = (videoRef) => null,
  onPlay: onPlayProp = (videoRef) => null,
  onPause: onPauseProp = (videoRef) => null,
  onSeek: onSeekProp = (videoRef) => null,
  onDurationChange: onDurationProp = (videoRef) => null,
  onError: onErrorProp = (error, videoRef) => null,
  onEnded: onEndedProp = (videoRef) => null,
  onRefReceive = (ref) => null,
  attachments = [],
  onFullscreenFalse = () => null,
}) {
  const containerRef = useRef();
  const videoRef = useRef();
  const wrapperRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [playButtonVisible, setPlayButtonVisible] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(true);
  const [source, setSource] = useState(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [fs, setFs] = useState(false);

  const { toggleFullScreen, isFullScreen } = useFullScreen(wrapperRef?.current);

  useEffect(() => {
    setTimeout(() => setPlayButtonVisible(!playing), 100);
  }, [playing]);

  useEffect(() => {
    setSource(null);
    console.log('Video source has changed ', src);
    setTimeout(() => setSource(src), 100);
  }, [src]);

  useEffect(() => {
    onRefReceive(videoRef?.current);
  }, [videoRef?.current]);

  const onPlay = () => {
    setPlaying(true);
    onMouseMove(2000);
    setTimeout(() => setMuted(false), 1000);
    onPlayProp(videoRef?.current);
  };
  const onPause = () => {
    setPlaying(false);
    onPauseProp(videoRef?.current);
    setControlsVisible(true);
  };
  const onSeek = () => {
    setPosition(videoRef?.current?.currentTime);
    onSeekProp(videoRef?.current);
  };
  const onDurationChange = () => {
    setDuration(videoRef?.current?.duration);
    onDurationProp(videoRef?.current);
  };

  const play = () => {
    videoRef?.current?.play();
  };

  const pause = () => {
    videoRef?.current?.pause();
  };

  const seek = (value) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = value;
    }
  };

  const onCanPlay = () => {
    onCanPlayProp(videoRef?.current);
  };

  const onLoadedMetadata = () => {
    onLoadMetaDataProp(videoRef?.current);
  };

  const onEnded = () => {
    onEndedProp(videoRef?.current);
  };

  const changeVolume = (value) => {
    if (videoRef?.current) {
      videoRef.current.volume = value;
      setVolume(value);
    }
  };

  const onMouseMove = (timeout = 5000) => {
    setControlsVisible(true);
    if (timeout && !controlsVisible) {
      setTimeout(() => {
        setControlsVisible(false);
      }, timeout);
    }
  };

  const onError = (err) => {
    console.log('Video error', videoRef?.current?.error, err);
    onErrorProp(err, videoRef?.current?.error);
  };

  const onClick = () => {
    if (!timer) {
      timer = setTimeout(() => {
        playing ? pause() : play();
        timer = null;
      }, 300);
    } else {
      clearTimeout(timer);
      timer = null;
      onFullScreenToggle();
    }
    onMouseMove(5000);
  };

  const onFullScreenToggle = () => {
    try {
      toggleFullScreen();
    } catch (e) {
      console.warn(e);
      containerRef.current.style.position = fs ? 'fixed' : 'unset';
      setFs(!fs);
    }
  };

  return (
    <Container ref={containerRef}>
      <Wrapper
        onMouseMove={() => onMouseMove(5000)}
        ref={wrapperRef}
        reference={wrapperRef}
        style={styles.wrapper}
        onClick={onClick}
        heightRatio={0.5625}
      >
        <FullscreenButton
          visible={controlsVisible}
          fullscreen={isFullScreen}
          onClick={onFullScreenToggle}
        >
          <Icon src={isFullScreen ? GoBackImg : FullscreenImg} />
        </FullscreenButton>
        <Video
          ref={videoRef}
          onPlay={onPlay}
          onPause={onPause}
          onCanPlay={onCanPlay}
          onLoadedMetadata={onLoadedMetadata}
          onDurationChange={onDurationChange}
          onTimeUpdate={onSeek}
          onError={onError}
          onEnded={onEnded}
          style={styles.video}
          src={source}
          poster={CoachLogoImg}
          onClick={onClick}
          preload={'auto'}
          playsInline
        />
        <Controls
          onMouseMove={() => onMouseMove()}
          visible={controlsVisible}
          style={styles.controls}
        >
          <ControlButtons>
            <SmallerButton onClick={() => seek(position - 5)}>
              <Icon src={BackwardImg} />
            </SmallerButton>
            {playing && (
              <Button visible={!playButtonVisible} onClick={pause}>
                <Icon src={PauseImg} />
              </Button>
            )}
            {!playing && (
              <Button visible={playButtonVisible} onClick={play}>
                <Icon src={PlayImg} />
              </Button>
            )}
            <SmallerButton onClick={() => seek(position + 5)}>
              <Icon src={ForwardImg} />
            </SmallerButton>
            <SoundControl
              onBarClick={(position) => changeVolume(position)}
              currentPosition={volume}
            />
          </ControlButtons>

          <ProgressBar
            onBarClick={(position) => seek(position)}
            currentPosition={position}
            duration={duration}
          />
        </Controls>
      </Wrapper>
    </Container>
  );
}

export default Player;

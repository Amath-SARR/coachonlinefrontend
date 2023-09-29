/**
 *
 * CoursePlayer
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { colors } from '../../utils/colors';
import Button from '../Button';
import { readFromStorage } from '../../utils/storage';
import { BASE_URL } from '../../config/env';
import makeSelectHomePage from '../../containers/HomePage/selectors';
import { setEpisodeErrorAction } from '../../containers/CoursePage/actions';
import history from '../../utils/history';
import Player from '../Player';
import { Category } from '../CategorySelector';
import { FlexCenteredColumn, FlexRow } from '../../global-styles';
import messages from '../../containers/CoursePage/messages';
import subscriptionMessages from '../../containers/Subscription/messages';
import { fullName } from '../../utils/formatters';
import makeSelectCourse from '../../store/course/course.selectors';
const VideoPlayer = require('../../images/icons/play-button.png');
import VideoPlayerNew from '../../images/icons/PlayIcon.svg';
import useWindowSize from '../../hooks/useWindowSize';

const Wrapper = styled.div`
  position: relative;
  border-radius: 10px;
`;
const PlayerOverlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 15px;
  //background-color: ${colors.backgroundBlackBlue}cc;
  z-index: 2;
  top: 0;
  backdrop-filter: opacity(0.6);
  text-align: center;
`;
const EpisodeName = styled.p`
  color: ${colors.white};
  font-size: 28px;
  padding: 10px 20px;
  word-break: break-word;
  margin: 0;
  margin-bottom: 10px;
`;

//background: ${colors.mainGreen};
//color: ${colors.black};
const CoachName = styled.p`
  color: ${colors.white};
  font-size: 46px;
  font-weight: 800;
  word-break: break-word;
  @media screen and (max-width: 920px) {
    font-size: 24px;
  }
`;
const CourseName = styled.p`
  color: ${colors.white};
  font-size: 18px;
  font-weight: 500;
  word-break: break-word;
  letter-spacing: 3px;
`;
const WatchButton = styled(Button)`
  width: fit-content;
  margin: 30px 0;
  padding: 10px 30px;
  font-size: 28px;
  color: black !important;
  @media screen and (max-width: 920px) {
    font-size: 16px;
    margin: 5px 0;
  }
`;
const VideoIcon = styled.img`
  width: 80px;
  margin: 7px;
  &:hover {
    cursor: pointer;
    background-color: #e5137d;
    border-radius: 100%;
  }
  @media screen and (max-width: 920px) {
    width: 40px;
  }
`;
const NoSubscriptionMessage = styled.p`
  color: ${colors.dark};
  font-size: 20px;
  font-weight: 500;
  width:1000px;
  word-break: break-word;
`;

function CoursePlayer({
  src,
  currentCourse = {},
  homePage,
  currentEpisode,
  currentEpisodeIndex,
  onEpisodeError,
  onEpisodeChange,
  onCanPlay: onCanPlayProps = () => null,
  onPlayerRefChange = () => null,
  loading,
  fetchError,
}) {
  const location = useLocation();
  const { width } = useWindowSize();
  const playerWrapperRef = useRef();
  const [initOverlayShown, setInitOverlayShown] = useState(true);
  const [episodeError, setEpisodeError] = useState(null);
  const [episodeCanPlay, setEpisodeCanPlay] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [playerRef, setPlayerRef] = useState(null);

  useEffect(() => {
    signalrStartConnection(false);
  }, []);

  useEffect(() => {
    setInitOverlayShown(true);
    console.log('Episode fetch error', fetchError);
  }, [fetchError]);

  useEffect(() => {
    onPlayerRefChange(playerWrapperRef?.current);
  }, [playerWrapperRef]);

  useEffect(() => {
    setEpisodeCanPlay(false);
    setInitOverlayShown(true);
  }, [currentEpisode?.id]);

  const play = () => {
    const episodeId = currentEpisode?.id;
    setEpisodeError(null);
    window.videoHubConnection
      .send('Play', {
        episodeId,
        currentSecond: playerRef?.currentTime,
        rate: playerRef?.playbackRate,
        duration: playerRef?.duration,
        authToken: readFromStorage('authToken'),
      })
      .then(() => {
        playCurrentVideo();
        setAutoplay(true);
        setInitOverlayShown(false);
      })
      .catch((e) => console.warn(e));
  };

  const stop = () => {
    const episodeId = currentEpisode?.id;
    try {
      window.videoHubConnection.send('Stop', {
        episodeId,
        currentSecond: playerRef?.currentTime,
        rate: playerRef?.playbackRate,
        duration: playerRef?.duration,
        authToken: readFromStorage('authToken'),
      });
    } catch (e) {
      console.warn(e);
    }
  };
  const saveVideoStatus = () => {
    const episodeId = currentEpisode?.id;
    try {
      const data = {
        episodeId,
        currentSecond: playerRef?.currentTime,
        rate: playerRef?.playbackRate,
        duration: playerRef?.duration,
        authToken: readFromStorage('authToken'),
      };
      window.videoHubConnection.send('SaveVideoStatus', data);
      console.log('Video status sent ', data);
    } catch (e) {
      console.warn(e);
    }
  };
  const setHubEvents = () => {
    window.videoHubConnection.on('VideoStarted', (data) => {
      console.log('received- video started', data);
      playCurrentVideo();
    });
    window.videoHubConnection.on('CheckVideoStatus', () => {
      console.log('Video status check');
      saveVideoStatus();
    });
    window.videoHubConnection.on('VideoStopped', (data) => {
      console.log('received- video stopped', data);
      playerRef?.stop();
    });
  };
  const signalrStartConnection = (shouldPlay = true) => {
    window.videoHubConnection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}signalr/video`)
      .withAutomaticReconnect()
      .build();
    window.videoHubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        setHubEvents();
      })
      .then(() => {
        shouldPlay && play();
      })

      .catch((err) => console.log(`Error while starting connection: ${err}`));
  };

  const onPlay = async () => {
    try {
      console.log('SignalR connection state: ', window.videoHubConnection?.connectionState);
      if (window.videoHubConnection?.connectionState === 'Connected') {
        play();
      } else {
        playerRef?.pause();
        signalrStartConnection();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const onEnded = async () => {
    try {
      stop();
      console.log(
        'Video has ended',
        homePage.selectedCourse?.episodes.length - 1,
        currentEpisodeIndex,
      );
      if (homePage.selectedCourse?.episodes.length - 1 > currentEpisodeIndex) {
        onEpisodeChange({ index: currentEpisodeIndex + 1 });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const playCurrentVideo = () => {
    try {
      playerRef?.play();
    } catch (e) {
      console.warn(e);
    }
  };

  const onCanPlay = () => {
    setEpisodeCanPlay(true);
    autoplay && onPlay();
    onCanPlayProps();
  };

  const onError = (err, mediaErr) => {
    setEpisodeError(err);
    onEpisodeError({ err, mediaErr, currentEpisodeIndex });
  };

  const onDurationChange = (ref) => {
    console.log('Duration changed', currentEpisode);
    playerRef.currentTime = 1;
    if (ref.duration > currentEpisode?.lastOpenedSecond + 5) {
      playerRef.currentTime = currentEpisode?.lastOpenedSecond;
    }
  };

  const goTo = (route) => {
    history.push(route);
  };

  const StartPlayingButton = () => {
    if (!fetchError) {
      return (
        <VideoIcon
          src={VideoPlayerNew}
          onClick={onPlay}
          disabled={!episodeCanPlay}
          isLoading={loading}
        />
      );
    }
    switch (fetchError?.codeString) {
      case 'SubscriptionNotExist':
        const userInfo = readFromStorage('userInfo');
        switch (userInfo?.userRole) {
          case 'COACH':
            return (
              <FlexCenteredColumn style={{ marginTop: 30 }}>
                <NoSubscriptionMessage>
                  Pour pouvoir regarder les cours des autres coachs, vous devez avoir au moins un
                  cours publié !
                </NoSubscriptionMessage>
              </FlexCenteredColumn>
            );
          case 'INSTITUTION_STUDENT':
            return (
              <FlexCenteredColumn style={{ marginTop: 30 }}>
                <NoSubscriptionMessage>
                  La limite d'utilisateurs actifs pour votre bibliothèque a été temporairement
                  atteinte. Veuillez essayer plus tard ou acheter un abonnement personnel.
                </NoSubscriptionMessage>
              </FlexCenteredColumn>
            );
          case 'STUDENT':
          default:
            return (
              <FlexCenteredColumn style={{ marginTop: 30 }}>
                <NoSubscriptionMessage>
                  <FormattedMessage {...messages.noActiveSubscription} />
                </NoSubscriptionMessage>
                <WatchButton
                  color="green"
                  style={{
                    fontSize: 26,
                    margin: '10px 0',
                  }}
                  onClick={() =>
                    history.push('/subscription/subscriptionChoice', {
                      background: location,
                    })
                  }
                >
                  <FormattedMessage {...subscriptionMessages.getSubscription} />
                </WatchButton>
              </FlexCenteredColumn>
            );
        }
        break;
      case 'NotAuthorized':
      case 'PermissionDenied':
        return (
          <FlexCenteredColumn style={{ marginTop: width > 600 ? 30 : 5 }}>
            <NoSubscriptionMessage>
              Un abonnement actif est nécessaire pour accéder à ce contenu.
            </NoSubscriptionMessage>
            <FlexRow style={{ alignItems: 'center' }}>
              <WatchButton
                color="green"
                onClick={() =>
                  history.push('/auth/login', {
                    background: location,
                  })
                }
              >
                Connexion
              </WatchButton>
              <NoSubscriptionMessage style={{ margin: 5 }}>ou</NoSubscriptionMessage>
              <WatchButton color="green" onClick={() => goTo('/?sectionId=homepage_form-ref')}>
                Inscription
              </WatchButton>
            </FlexRow>
          </FlexCenteredColumn>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Wrapper ref={playerWrapperRef}>
        <Player
          src={src}
          onPlay={onPlay}
          onEnded={onEnded}
          // onCanPlay={onCanPlay}
          onLoadMetaData={onCanPlay}
          onRefReceive={(ref) => setPlayerRef(ref)}
          onDurationChange={onDurationChange}
          onError={onError}
          attachments={currentEpisode?.attachments}
        />
        {initOverlayShown && (
          <PlayerOverlay>
            <StartPlayingButton />
            <EpisodeName>{currentEpisode?.title}</EpisodeName>
          </PlayerOverlay>
        )}
      </Wrapper>
    </>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setEpisodeError: (err) => dispatch(setEpisodeErrorAction(err)),
  };
}

const mapStateToProps = createStructuredSelector({
  course: makeSelectCourse(),
  homePage: makeSelectHomePage(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CoursePlayer);

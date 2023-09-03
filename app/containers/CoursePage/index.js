/**
 *
 * CoursePage
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import makeSelectCoursePage from './selectors';
import PageContainer from '../../components/PageContainer';
import makeSelectHomePage from '../HomePage/selectors';
import { colors } from '../../utils/colors';
import {
  getCourseAction,
  getCourseInfoAction,
  getCourseWatchedEpisodesAction,
  setCourseWatchedEpisodesAction,
  setSelectedCoachAction,
  setSelectedCourseAction,
} from '../HomePage/actions';
import { BASE_URL } from '../../config/env';
import { setEpisodeAction, setEpisodeErrorAction, toggleLikeAction } from './actions';
import useQuery from '../../hooks/useQuery';
import makeSelectAuth from '../Auth/selectors';
import { FlexColumn, FlexRow } from '../../global-styles';
import ListOfEpisodes from '../../components/ListOfEpisodes';
import ProfilePicture from '../../components/ProfilePicture';
import CoursePlayer from '../../components/CoursePlayer';
import history from '../../utils/history';
import useWindowSize from '../../hooks/useWindowSize';
import { fullName } from '../../utils/formatters';
import { Category } from '../../components/CategorySelector';
import { getEpisode } from '../../store/course/course.slice';
import makeSelectCourse from '../../store/course/course.selectors';
import { sendUserState } from '../../components/ConnectionsTrackerSignalR';
import CourseInfo from '../../components/CourseInfo/course-info';
import Comments from '../../components/Comments/comments';
import Tabs from '../../components/Tabs';
import CourseListItem from '../../components/CourseListItem';
import Certif from '../../images/icons/quality1.png';
import Modal from '../../components/Modal';
import { modalStyles } from '../../components/CategoryDropdownSearch';

const Wrapper = styled(FlexColumn)`
  width: 100%;
  padding: 50px;
  background-color: #F8F7FB;
  @media screen and (max-width: 920px) {
    margin-top: 130px;
    padding: 8px;
`;
const Column = styled(FlexColumn)``;
const Row = styled(FlexRow)`
  width: 100%;
`;
const ColumnToMobileRow = styled(Column)`
  @media screen and (max-width: 920px) {
    flex-direction: row;
  }
`;
const RowToMobileColumn = styled(Row)`
  @media screen and (max-width: 920px) {
    flex-direction: column;
  }
`;
const PlayerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 30px;
  @media screen and (max-width: 920px) {
    flex-direction: column;
  }
`;
const PlayerWrapper = styled.div`
  position: relative;
  flex: 3;
  width: 100%;
  padding-right: 10px;
  border-radius: 10px;

  @media screen and (max-width: 920px) {
    flex: unset;
  }
`;
const EpisodesColumn = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
  ::-webkit-scrollbar {
    width: 2px;
  }
  @media screen and (max-width: 920px) {
    overflow-y: hidden;
    overflow-x: auto;
    flex: unset;
    margin: auto;
    ::-webkit-scrollbar {
      width: 2px;
    }
  } ;
`;

const OverFlow = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  margin-left: 30px;
  box-shadow: 0px 5px 14px rgba(8, 15, 52, 0.1);
  background-color: white;
  // padding: 8px;
  // margin: 10px;
  @media screen and (max-width: 900px) {
    margin-left: 0px;
  }
`;
const CoursesColumn = styled(EpisodesColumn)`
  max-height: 850px;
  padding: 0 10px;
  margin-left: 15px;
  align-items: center;
`;
const TextWhite = styled.p`
  font-size: 16px;
  color: ${colors.lilac};
  @media screen and (max-width: 920px) {
  }
`;
const CourseInfoWrapper = styled(RowToMobileColumn)`
  flex: 1;
`;
const Title = styled(TextWhite)`
  font-weight: 700;
  font-size: 35px;
  text-align: left;
  margin-bottom: 10px;
  text-transform: uppercase;
  @media screen and (max-width: 920px) {
    margin-top: 15px;
    font-size: 18px;
  }
`;
const Title1 = styled(Title)`
  display: none;
  @media screen and (max-width: 920px) {
    display: flex;
    font-size: 15px;
  }
`;

const Title2 = styled(Title)`
  display: flex;
  @media screen and (max-width: 920px) {
    display: none;
  }
`;
const CourseDescription = styled(TextWhite)`
  font-size: 16px;
  overflow: auto;
  //width: 100%;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;
const TabBody = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px 0;

  @media screen and (max-width: 400px) {
    flex-direction: column;
    min-width: auto;
    justify-content: center;
  }
`;
const CommentWrapper = styled.div`
  width: 100%;
  margin-right: 40px;
`;
const CourseDetails = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0px 5px 14px rgba(8, 15, 52, 0.1);
  border-radius: 10px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;
const CourseCible = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;
const CoursePrerequis = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;
const CourseObjectif = styled.div``;
const CourseFirstColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
`;
const CourseSecondColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  border-left: 1px solid ${colors.lilac};
  padding-left: 20px;
  width: 30%;
  @media screen and (max-width: 900px) {
    border-left: none;
    border-top: 1px solid ${colors.lilac};
    margin-top: 20px;
    padding-top: 15px;
  }
`;

const CourseSubtitle = styled(TextWhite)`
  font-size: 18px;
  font-weight: 600;
  margin-right: 10px;
`;
const Certification = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  //padding: 10px;
  .legend {
    opacity: 0;
  }
  &:hover {
    cursor: pointer;
    .legend {
      opacity: 1;
    }
  }
`;
const CertificationLogo = styled.img`
  width: 30px;
  // position: fixed;
  // margin-top: -12px;
  // margin-left: -30px;
`;

const Legend = styled(TextWhite)`
  font-size: 10px;
  color: ${colors.mainPink};
  margin-left: 15px;
`;
const CertificationButton = styled.button`
  width: 230px;
  padding: 10px;
  margin-left: 10px;
  border-radius: 10px;
  background-color: ${colors.lilac};
  border: none;
  color: ${colors.white};
  font-weight: 300;
  margin-top: 20px;
  @media screen and (max-width: 900px) {
    width: 200px;
  }
`;

const Container = styled.div`
  display: flex;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const LinkQCM = styled.a`
  color: ${colors.lilac};
`;
const TABS = [
  { label: 'Commentaires', id: 'comments' },
  // { label: 'Description du cours', id: 'course-description' },
];

export function CoursePage({
  resetSelectedCourse,
  resetSelectedEpisode,
  homePage,
  auth,
  getEpisodeUrl,
  setChosenCourse,
  setSelectedCourse,
  resetWatchedEpisodes,
  getWatchedEpisodes,
  toggleCourseLike,
  getCoureInfos,
}) {
  const query = useQuery();
  const { width } = useWindowSize();
  const [episodeData, setEpisodeData] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [openedEpisodeIndex, setOpenedEpisodeIndex] = useState(null);
  const [playerRef, setPlayerRef] = useState(null);
  const [numberOfRetries, setNumberOfRetries] = useState(5);
  const [fetchError, setFetchError] = useState(null);
  const [playerRowHeight, setPlayerRowHeight] = useState(400);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [openedCertif, setOpenedCertif] = useState(false);
  const [openedProgram, setOpenedProgram] = useState(false);
  const playerWrapperRef = useRef();

  const courseId = `${homePage.selectedCourse?.id}`;

  useEffect(() => {
    console.log('Current height', playerRef?.offsetHeight);
    setPlayerRowHeight(playerRef?.offsetHeight);
  }, [width, playerRef]);

  useEffect(() => {
    sendUserState(true);
    !homePage.selectedCourse?.id && onNoCourseData();
    updateWatchedEpisodes();
    return () => {
      resetSelectedCourse();
      resetSelectedEpisode();
      resetWatchedEpisodes();
    };
  }, []);

  useEffect(() => {
    const initEpisodeIndex = homePage.watchedEpisodes?.[0]?.ordinalNumber || 0;
    onEpisodeChange(initEpisodeIndex);
  }, [homePage.watchedEpisodes || homePage.watchedEpisodes?.length]);

  console.log(homePage.watchedEpisodes);
  useEffect(() => {
    getEpisodeData();
    setNumberOfRetries(5);
  }, [openedEpisodeIndex, courseId]);

  const onNoCourseData = () => {
    const courseId = query.get('id');
    courseId ? setSelectedCourse(courseId) : history.replace('/');
  };

  const updateWatchedEpisodes = () => {
    const courseId = query.get('id');
    console.log(courseId);
    courseId &&
      getWatchedEpisodes({
        courseId,
        hasSubscription: !!auth.studentData.subscription?.selectedPlanId,
      });
  };

  const onEpisodeChange = (index) => {
    console.log('Episode index has changed ', index);
    setFetchError(null);
    setOpenedEpisodeIndex(index);
  };

  const getEpisodeData = (episodeIndex = openedEpisodeIndex) => {
    const episodeId = homePage.selectedCourse?.episodes?.[episodeIndex]?.id;
    const openedEpisodeHasIndex = typeof episodeIndex === 'number';
    const courseIsSelected = homePage.selectedCourse?.id;
    console.log('Getting episode data', {
      openedEpisodeHasIndex,
      courseIsSelected,
      episodeId,
      episodeIndex,
    });
    if (openedEpisodeHasIndex && courseIsSelected) {
      getEpisodeUrl({
        episodeId,
        onSuccess: (data) => {
          data?.id && setVideoPreview(`${BASE_URL}${data?.query}`);
          setEpisodeData(data);
          document.body.scrollTop = 0;
        },
        onError: (err) => {
          setFetchError(err);
          setVideoPreview('');
          document.body.scrollTop = 0;
        },
      });
    }
  };

  const goToCourse = (course) => {
    setChosenCourse(course?.courseId || course?.id);
  };

  const onLikeToggle = (courseId, liked) => {
    toggleCourseLike({ body: { courseId, liked } });
  };

  const onCanPlay = () => {
    setLoading(false);
  };

  const onError = (err, mediaErr) => {
    console.log(
      'Error occurred',
      err,
      mediaErr,
      numberOfRetries,
      numberOfRetries > 0,
      openedEpisodeIndex,
    );
    if (numberOfRetries > 0) {
      getEpisodeData(openedEpisodeIndex);
      setNumberOfRetries(numberOfRetries - 1);
    } else {
      setLoading(false);
    }
  };

  const onTabChange = (index) => {
    setActiveTab(index);
  };

  let certificationLink = homePage.selectedCourse?.certificationQCM;

  console.log(homePage.selectedCourse);
  return (
    <div>
      <Helmet>
        <title>CoursePage</title>
        <meta name="description" content="Description of CoursePage" />
      </Helmet>
      <PageContainer
        history={history}
        colorScheme="dark"
        style={{
          childrenWrapper: { display: 'flex' },
          windowContainer: {
            border: 'none',
            maxWidth: '1460px',
            padding: 0,
          },
        }}
      >
        <Wrapper>
          <CourseInfo
            course={homePage.selectedCourse}
            onLikeToggle={onLikeToggle}
            liked={homePage.selectedCourse.isLikedByMe}
            episodeData={episodeData}
            canLike={!!auth.authToken}
            auth={auth}
          />

          <CourseDetails>
            <CourseFirstColumn>
              <Title>{homePage.selectedCourse?.name}</Title>
              {/* <Certification>
                <CertificationLogo src={Certif} alt="logo"></CertificationLogo>
                <Legend className="legend">Cette formation est certifiante</Legend>
              </Certification> */}

              {/* <Title style={{ fontWeight: 700 }}> À propos de ce cours </Title> */}
              <CourseDescription
                dangerouslySetInnerHTML={{
                  __html: homePage?.selectedCourse?.description,
                }}
              />
              <Container style={{ display: 'flex' }}>
                {/* <CertificationButton onClick={() => setOpenedProgram(true)}>
                  Programme de la Formation
                </CertificationButton>
                <Modal
                  withHeader
                  isOpened={openedProgram}
                  onClose={() => setOpenedProgram(false)}
                  style={modalStyles(width)}
                >
                  <div style={{ padding: '30px' }}>
                    <p> Bientôt disponible</p>
                  </div>
                </Modal> */}
                <CertificationButton onClick={() => setOpenedCertif(true)}>
                  Passer la certification
                </CertificationButton>
                <Modal
                  withHeader
                  isOpened={openedCertif}
                  onClose={() => setOpenedCertif(false)}
                  style={modalStyles(width)}
                >
                  <div style={{ padding: '30px' }}>
                    <TextWhite style={{ textAlign: 'center', fontSize: '25px', fontWeight: '600' }}>
                      Passer la certification{' '}
                    </TextWhite>
                    <Legend style={{ fontSize: '13px', marginTop: '10px', marginBottom: '10px' }}>
                      *La réussite d’au moins 80% de ce test permet l’obtention d’une attestation de
                      formation mentionnant les objectifs, la nature et la durée de la formation,
                      ainsi que les résultats de l’évaluation des acquis de la formation.
                    </Legend>
                    <TextWhite>Lien vers le test : </TextWhite>
                    <LinkQCM>{homePage.selectedCourse?.certificationQCM}</LinkQCM>
                  </div>
                </Modal>
              </Container>
            </CourseFirstColumn>

            <CourseSecondColumn>
              <CourseCible>
                <CourseSubtitle>Public Cible : </CourseSubtitle>
                <p> {homePage.selectedCourse?.publicTargets}</p>
              </CourseCible>
              <CoursePrerequis>
                {' '}
                <CourseSubtitle>Prérequis nécessaires :</CourseSubtitle>
                <p> {homePage.selectedCourse?.prerequisite}</p>
              </CoursePrerequis>
              <CourseObjectif>
                <CourseSubtitle>Les objectifs de Formation : </CourseSubtitle>
                <p
                  dangerouslySetInnerHTML={{
                    __html: homePage.selectedCourse?.objectives,
                  }}
                ></p>
              </CourseObjectif>
            </CourseSecondColumn>
          </CourseDetails>
          <PlayerRow>
            <Column style={{ flex: 3 }}>
              <PlayerWrapper ref={playerWrapperRef}>
                <CoursePlayer
                  src={videoPreview}
                  onPlayerRefChange={(ref) => setPlayerRef(ref)}
                  currentCourse={homePage.selectedCourse}
                  currentEpisode={episodeData}
                  currentEpisodeIndex={openedEpisodeIndex}
                  onEpisodeChange={({ index }) => onEpisodeChange(index)}
                  onCanPlay={onCanPlay}
                  onEpisodeError={onError}
                  loading={loading}
                  fetchError={fetchError}
                />
              </PlayerWrapper>
            </Column>
            <Column style={{ flex: 1 }}>
              <Title1 style={{ marginBottom: 8, paddingLeft: 10 }}>MODULES DE FORMATION</Title1>
              <OverFlow>
                <EpisodesColumn>
                  <Title2
                    style={{
                      margin: '10px 10px 10px 15px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '19px',
                    }}
                  >
                    MODULES DE FORMATION
                  </Title2>
                  <ListOfEpisodes
                    style={{ maxHeight: playerRowHeight - 42 }}
                    episodes={homePage.selectedCourse?.episodes}
                    openedEpisodeIndex={openedEpisodeIndex}
                    onEpisodeChange={({ episode, index }) => onEpisodeChange(index)}
                  />
                </EpisodesColumn>
              </OverFlow>
            </Column>
          </PlayerRow>

          <CourseInfoWrapper>
            <Column style={{ flex: 3, width: width > 920 ? 'unset' : '100%' }}>
              {/* <CourseInfo
                course={homePage.selectedCourse}
                onLikeToggle={onLikeToggle}
                liked={homePage.selectedCourse.isLikedByMe}
                episodeData={episodeData}
                canLike={!!auth.authToken}
              /> */}
              <CommentWrapper>
                <Tabs
                  hideNextButton
                  useColorOverlays={false}
                  onTabChange={onTabChange}
                  activeIndex={activeTab}
                  styles={{
                    wrapper: {
                      flex: 3,
                      padding: '15px',
                      marginTop: '10px',
                      // marginRight: '40px',
                      backgroundColor: colors.backgroundDarkBlue,
                      borderRadius: '15px',
                    },
                    header: { width: '100%' },
                    tabStyle: {
                      borderBottom: 'none',
                    },
                    activeTabStyle: {
                      borderBottom: `1px solid ${colors.lilac}`,
                      padding: '5px',
                    },
                  }}
                  tabs={TABS}
                >
                  <TabBody>
                    <Comments courseId={homePage.selectedCourse?.id || query.get('id')} />
                  </TabBody>
                </Tabs>
              </CommentWrapper>
            </Column>
            <Column style={{ flex: 1 }}>
              <Title1 style={{ marginBottom: 8, paddingLeft: 10 }}>
                AUTRES FORMATIONS DE CE COACH
              </Title1>

              <OverFlow>
                <CoursesColumn>
                  <Title2
                    style={{
                      margin: '10px 30px 10px 0px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '19px',
                    }}
                  >
                    AUTRES FORMATIONS DE CE COACH
                  </Title2>
                  {homePage.selectedCourse?.coach?.courses?.map((item, i) => (
                    <CourseListItem
                      category={item.category?.name}
                      key={item.id}
                      item={item}
                      onItemClick={() => goToCourse(item)}
                      index={i}
                      size={315}
                      keys={{ name: 'name', id: 'id', image: 'photoUrl' }}
                    />
                  ))}
                </CoursesColumn>
              </OverFlow>
            </Column>
          </CourseInfoWrapper>
        </Wrapper>
      </PageContainer>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  coursePage: makeSelectCoursePage(),
  course: makeSelectCourse(),
  homePage: makeSelectHomePage(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    resetSelectedCourse: () => dispatch(setSelectedCourseAction({})),
    setSelectedCourse: (id) => dispatch(getCourseAction(id)),
    resetSelectedEpisode: () => dispatch(setEpisodeAction({})),
    getEpisodeUrl: ({ episodeId, onSuccess, onError }) =>
      dispatch(getEpisode({ episodeId, onSuccess, onError })),
    setSelectedCoach: (data) => dispatch(setSelectedCoachAction(data)),
    resetWatchedEpisodes: () => dispatch(setCourseWatchedEpisodesAction(null)),
    getWatchedEpisodes: (data) => dispatch(getCourseWatchedEpisodesAction(data)),
    setEpisodeError: (err) => dispatch(setEpisodeErrorAction(err)),
    toggleCourseLike: (data) => dispatch(toggleLikeAction(data)),
    setChosenCourse: (id) => dispatch(getCourseAction(id)),
    getCoureInfos: (id) => dispatch(getCourseInfoAction(id)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CoursePage);

/**
 *
 * CoachInfoPage
 *
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import PageContainer from '../../components/PageContainer';
import { colors } from '../../utils/colors';
import {
  getCoachAction,
  getCourseAction,
  setSelectedCoachAction,
  getCoachDocumentAction,
} from '../HomePage/actions';
import makeSelectHomePage from '../HomePage/selectors';
import { BASE_URL, API_URL } from '../../config/env';
import noUser from '../../images/no-user.png';
import messages from '../../components/messages';
import ProfilePicture from '../../components/ProfilePicture';
import { FlexCenteredColumn, FlexRow, FlexColumn } from '../../global-styles';
import { Category } from '../../components/CategorySelector';
import HorizontalSectionList from '../../components/HorizontalSectionList';
import AspectRatioContainer from '../../components/AspectRatioContainer';
import { fullName } from '../../utils/formatters';
import Modal from '../../components/Modal';
import { modalStyles } from '../../components/CategoryDropdownSearch';
import useWindowSize from '../../hooks/useWindowSize';
import CV from '../../images/images/cvtest.jpg';
import avis1 from '../../images/images/avis1.png';
import avis2 from '../../images/images/avis2.png';
import avis3 from '../../images/images/avis3.png';
import BackArrow from '../../images/icons/back-arrow.svg';
import axios from 'axios';
import { defaultHeaders } from '../../utils/requestWrapper';
import ViewRose from '../../images/icons/View.svg';
import HeartRose from '../../images/icons/Heart.png';
import IconLeft from '../../images/icons/iconGauche.png';
import IconRight from '../../images/icons/iconDroite.png';

const PictureWrapper = styled(AspectRatioContainer)`
  position: relative;
  max-width: 900px;
  margin-bottom: 25px;
  border-radius: 15px;
  overflow: hidden;
`;
const Picture = styled(ProfilePicture)`
  width: 100%;
  height: 100%;
  background: transparent;
`;
const CoachPicture = styled(ProfilePicture)`
  width: 200px;
  height: 200px;
  border-radius: 14px;
  background: url(<path-to-image>), lightgray 0px -26px / 100% 169.5% no-repeat;
`;

const ProfilePictureOverlay = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 5px;
  background: linear-gradient(transparent 60%, #1b2443eb 74%, #1b2443 75%);
  z-index: 1;
`;
const Categories = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  overflow:scroll;
  gap: 16px;
  @media screen and (max-width: 600px) {
    margin: 10px 0;
  }
`;
const CoachBio = styled.p`
align-self: stretch;
color: var(--black-grey, #191919);
font-family: Montserrat;
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;
const CoachEmail = styled.p`
align-self: stretch;
color: #E21680;

/* Texte général */
font-family: Montserrat;
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;
const TextBio = styled.div`
  @media screen and (max-width: 920px) {
    font-size: 14px;
  }
`;
const Title = styled.p`
  align-self: stretch;
  color: var(--rose, #e21680);
  font-family: Montserrat;
  font-size: 64px;
  font-style: normal;
  font-weight: 300;
  line-height: 94.023%; /* 60.175px */
  text-transform: uppercase;
  @media screen and (max-width: 900px) {
    font-size: 36px;
  }
  @media screen and (max-width: 600px) {
    font-size: 16px;
  }
`;

const DataWrapper = styled(FlexRow)`
  justify-content: center;
  margin-bottom: 30px;
  @media screen and (max-width: 600px) {
    margin-bottom: 15px;
  }
`;
const DataText = styled.p`
  font-size: 86px;
  align-items: center;
  font-weight: 200;
  text-align: center;
  line-height: 95px;
  @media screen and (max-width: 900px) {
    font-size: 66px;
    line-height: 40px;
  }
  @media screen and (max-width: 600px) {
    font-size: 36px;
    line-height: 26px;
  }
`;
const DataLabel = styled.p`
  font-size: 14px;
  align-items: center;
  font-weight: 500;
  text-align: center;
  text-transform: uppercase;
  @media screen and (max-width: 600px) {
    font-weight: 300;
  }
`;
const InfoCoachWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  margin-top: 10px;
`;
const ButtonCV = styled.button`
  display: flex;
  padding: 10px 32px;
  align-items: flex-end;
  color: ${colors.white};
  gap: 16px;
  border-radius: 14px;
  border: 1px solid var(--rose, #e21680);
  background: var(--rose, #e21680);
`;
const ButtonDiplome = styled.button`
  display: flex;
  padding: 10px 32px;
  color: ${colors.white};
  align-items: flex-end;
  gap: 16px;
  border-radius: 14px;
  border: 1px solid var(--rose, #e21680);
  background: var(--rose, #e21680);
`;

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Wrapper = styled.div`
  display: inline-flex;
  padding: 44px;
  width: 1450px;
  flex-direction: column;
  align-items: flex-start;
  gap: 70px;
  border-radius: 14px;
  border: 1px solid var(--opacity, rgba(140, 140, 148, 0.5));
  background: var(--white, #fff);
  @media screen and (max-width: 1450px) {
    margin-top: 120px;
  }
`;
const SectionCoachName = styled.div`
  display: flex;
  padding-bottom: 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid rgba(140, 140, 148, 0.5);
`;
const SectionCoach = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 24px 24px 16px;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 14px;
  border: 1px solid var(--opacity, rgba(140, 140, 148, 0.5));
  background: var(--carte, #f4f4f6);
`;
const SectionCoach1 = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 56px;
  align-self: stretch;
`;
const CoachGauche = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;
const CoachDroite = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  flex: 1 0 0;
`;
const CoachDroite1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;

`;
const CoachContact = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 12px;
align-self: stretch;
`;
const BioWrapper = styled.div`
  display: flex;
  justify-content : center
  min-width: 700px;
  max-height: 200px;
  min-height : 200px;
  overflow: hidden;
  border-radius : 15px;
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  transition: max-height 0.5s ease-in-out;
  &:hover {
    height: auto;
    -webkit-mask-image: none;
    mask-image: none;
    overflow: auto;
  }
  @media screen and (max-width: 920px) {
    justify-content : center;

    margin-bottom: 20px;
    }
`;

const TextCoach = styled.p`
transform: rotate(-90deg);
color: var(--black-grey, #191919);

position :relative;
top: 70px;
left: 50px;

font-family: Montserrat;
font-size: 40px;
font-style: normal;
font-weight: 400;
line-height: 94%; 37.6px 

`;
const PartieCoach = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;
const SousPartie1 = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;
const PartieView = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
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
const PartieLike = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const SectionButton = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  align-self: stretch;
`;
const Testimonials = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 50px;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;
const ButtonReturn = styled.button`
  width: fit-content;
  height: fit-content;
  padding: 15px;
  border-radius: 10px;
  margin-left: 20px;
  background-color: #1a2342;
  border: none;
  color: ${colors.white};
  font-weight: 300;
`;
const Return = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const ReturnsImg = styled.img`
  width: 500px;
  &:hover {
    width: 700px;
  }
`;
const IconSlide = styled.img`
width: 40px;
height: 40px;
bottom: 128px;
background: #FFF;
margin : 0 5px;
cursor: pointer;
Z-index:1;
box-shadow: 0 0 10px #999;
`;

export function CoachInfoPage({
  history,
  homePage,
  resetSelectedCoach,
  setChosenCourse,
  getCoach,
  getCoachDocuments,
}) {
  const { id: coachId } = useParams();
  const [openedCV, setOpenedCV] = useState(false);
  const [openedDiplome, setOpenedDiplome] = useState(false);
  const [diplomeOne, setDiplomeOne] = useState(false);
  const [openedAvis1, setOpendedAvis1] = useState(false);
  const [openedAvis2, setOpendedAvis2] = useState(false);
  const [openedAvis3, setOpendedAvis3] = useState(false);
  // const [allDocuments, setAllDocuments] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    getCoach(coachId);
    getCoachDocuments(coachId);
    // getAllDocuments();
    return () => resetSelectedCoach();
  }, []);

  const goToCourse = (course) => {
    setChosenCourse(course?.id);
  };

  // const getAllDocuments = () => {
  //   axios({
  //     method: 'get',
  //     url: `${API_URL}/Info/CoachDocument/${coachId}`,
  //     // data: {
  //     //   firstName: 'Fred',
  //     //   lastName: 'Flintstone'
  //     // }
  //     headers: {
  //       ...defaultHeaders(true),
  //     },
  //   }).then(function (response) {
  //     // setDiplomeOne(BASE_URL + response.data.diplomeOne);
  //     console.log('get all documents coachs : ', response);
  //   });
  // };

  const displayDiploms = () => {
    if (homePage?.selectedCoachDocuments?.diplomas) {
      if (homePage?.selectedCoachDocuments?.diplomas.length > 0) {
        return homePage?.selectedCoachDocuments?.diplomas.map((element) => {
          // console.log("element split" , element.split(".").pop());
          if (element.split('.').pop() == 'pdf') {
            return <a href={`${BASE_URL}/documents/${element}`}>Voir le Diplôme</a>;
          } else {
            return (
              <img src={`${BASE_URL}/documents/${element}`} alt={element}>
                Voir le Diplôme
              </img>
            );
          }
        });
      }
    }
    return <p>Bientôt disponible</p>;
  };

  const displayReturns = () => {
    if (homePage?.selectedCoachDocuments?.returns) {
      if (homePage?.selectedCoachDocuments?.returns.length > 0) {
        return (
          <Testimonials>
            {homePage?.selectedCoachDocuments?.returns.map((element) => (
              <ReturnsImg src={`${BASE_URL}/documents/${element}`}></ReturnsImg>
            ))}
          </Testimonials>
        );
      }
    }
    return null;
  };

  const displayCV = () => {
    if (homePage?.selectedCoachDocuments?.userCV) {
      return (
        <a href={`${BASE_URL}/documents/${homePage?.selectedCoachDocuments?.userCV}`}>
          {' '}
          Voir le CV
        </a>
      );
    }
    return <p>Bientôt disponible</p>;
  };

  return (
    <div>
      <Helmet>
        <title>CoachInfoPage</title>
        <meta name="description" content="Description of CoachInfoPage" />
      </Helmet>
      <PageContainer
        colorScheme="dark"
        style={{
          windowContainer: { border: 'none', maxWidth: '1460px', padding: 0 },
        }}
        history={history}
      >
        <Wrapper>
          <SectionCoachName>
            <Title>{fullName(homePage?.selectedCoach)}</Title>
          </SectionCoachName>
          <SectionCoach>
            <SectionCoach1>
              <CoachGauche>
                <TextCoach> COACH</TextCoach>
                <PartieCoach>
                  <CoachPicture
                    src={
                      homePage?.selectedCoach?.photoUrl
                        ? `${BASE_URL}images/${homePage?.selectedCoach?.photoUrl}`
                        : noUser
                    }
                  />
                  <SousPartie1>
                    <PartieView>
                      <IconeRose src={ViewRose} />
                      <PetitText>1 305 vues</PetitText>
                    </PartieView>
                    <PartieLike>
                      <IconeRose src={HeartRose} />
                      <PetitText> {homePage?.selectedCoach?.likesCnt || 0} likes</PetitText>
                    </PartieLike>
                  </SousPartie1>
                  <SousPartie1>
                    <DataLabel>{homePage?.selectedCoach?.courses?.length}</DataLabel>
                    <DataLabel>Cours</DataLabel>
                  </SousPartie1>
                </PartieCoach>
              </CoachGauche>
              <CoachDroite>
                <CoachDroite1>
                  <Categories>

                    {homePage?.selectedCoach?.userCategories?.map((category) => (
                      <Category style={{ background: 'transparent' }} key={category.id}>
                        {category.name}
                      </Category>
                    ))}


                  </Categories>

                </CoachDroite1>
                <BioWrapper>
                  <CoachBio
                    dangerouslySetInnerHTML={{
                      __html: homePage?.selectedCoach?.bio,
                    }}
                  />
                </BioWrapper>
                <CoachContact>
                  <CoachEmail
                    dangerouslySetInnerHTML={{
                      __html: homePage?.selectedCoach?.email,
                    }}
                  />
                </CoachContact>
              </CoachDroite>
            </SectionCoach1>
          </SectionCoach>

          <SectionButton>
            <ButtonCV onClick={() => setOpenedCV(true)}>Voir le CV</ButtonCV>
            <ButtonDiplome onClick={() => setOpenedDiplome(true)}>
              Voir les qualifications
            </ButtonDiplome>
          </SectionButton>

          <FlexCenteredColumn>
            {displayReturns()}
            {/* {homePage?.selectedCoachDocuments?.returns.length > 0? 
                <Testimonials>
                  {homePage?.selectedCoachDocuments?.diplomas.map(element => {
                    return ( <img src={`${BASE_URL}/documents/${element}`} width="400px" ></img>)
                  })}
                </Testimonials>
              : null } */}

            {/* <Testimonials>
              <img src={avis1} width="400px" onClick={() => setOpendedAvis1(true)}></img>
              <Modal
                withHeader
                isOpened={openedAvis1}
                onClose={() => setOpenedAvis1(false)}
                style={modalStyles(width)}
              >
                <img src={avis1} width="100%" style={{ padding: '30px' }}></img>
              </Modal>

              <img src={avis2} width="400px" onClick={() => setOpendedAvis2(true)}></img>
              <Modal
                withHeader
                isOpened={openedAvis2}
                onClose={() => setOpenedAvis2(false)}
                style={modalStyles(width)}
              >
                <img src={avis2} width="100%" style={{ padding: '30px' }}></img>
              </Modal>
              <img src={avis3} width="400px" onClick={() => setOpendedAvis3(true)}></img>
              <Modal
                withHeader
                isOpened={openedAvis3}
                onClose={() => setOpenedAvis3(false)}
                style={modalStyles(width)}
              >
                <img src={avis3} width="100%" style={{ padding: '30px' }}></img>
              </Modal>
            </Testimonials> */}

            {/* <CoachBio
            dangerouslySetInnerHTML={{
              __html: homePage?.selectedCoach?.bio,
            }}
          /> */}
            <HorizontalSectionList
              items={homePage?.selectedCoach?.courses}
              title={'autres formations de ce coach'}
              keys={{ name: 'name', id: 'id', image: 'photoUrl' }}
              onItemClick={(course) => goToCourse(course)}
            />

          </FlexCenteredColumn>

          {/* <Return>
            <ButtonReturn>
              <img src={BackArrow} width="20px" /> Revenir sur le cours
            </ButtonReturn>
          </Return> */}
        </Wrapper>
        <Modal
          withHeader
          backButtonHidden
          isOpened={openedCV}
          onClose={() => setOpenedCV(false)}
          headerTitle={'CV'}
          style={modalStyles(width)}
        >
          {displayCV()}
          {/* {homePage?.selectedCoachDocuments?.userCV
                ? <a href={`${BASE_URL}/documents/${homePage?.selectedCoachDocuments?.userCV}`} > Voir le CV</a>
                : <p>Bientôt disponible</p>} */}
          {/* <img src={CV} alt="cv" width="100%"></img> */}
          {/* <p>Bientôt disponible</p> */}
        </Modal>
        <Modal
          withHeader
          backButtonHidden
          isOpened={openedDiplome}
          onClose={() => setOpenedDiplome(false)}
          headerTitle={'Qualifications'}
          style={modalStyles(width)}
        >
          {displayDiploms()}

          {/* <p>Bientôt disponible</p> */}
          {/* <p>{diplomeOne}</p>
          <img src={diplomeOne} width="400px" ></img> */}
        </Modal>
      </PageContainer>
    </div>
  );
}

CoachInfoPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    resetSelectedCoach: () => dispatch(setSelectedCoachAction({})),
    setChosenCourse: (id) => dispatch(getCourseAction(id)),
    getCoach: (id) => dispatch(getCoachAction(id)),
    getCoachDocuments: (id) => dispatch(getCoachDocumentAction(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CoachInfoPage);

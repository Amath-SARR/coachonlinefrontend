/**
 *
 * CourseInfo
 *
 */

import React, { FC, useEffect, useState } from 'react';
import CourseInfoProps from './course-info.props';
import styled from 'styled-components';
import { FlexColumn, FlexRow, Text } from '../../global-styles';
import HeartEmptyImg from '../../images/icons/heart--empty--pink.svg';
import HeartFilledImg from '../../images/icons/heart--filled--pink.svg';
import { colors } from '../../utils/colors';
import { BASE_URL } from '../../config/env';
import { modalStyles } from '../CategoryDropdownSearch';
import Modal from '../Modal';
import useWindowSize from '../../hooks/useWindowSize';
import Button from '../Button';
import { fullName } from '../../utils/formatters';
import ProfilePicture from '../ProfilePicture';
import history from '../../utils/history';
import ViewRose from '../../images/icons/View.svg';
import HeartRose from '../../images/icons/Heart.png';
import Arrow from '../../images/icons/arrow.svg';
const CoachPictureSize = 200;

// margin-bottom: 20px;
// align-items: center;
// width: 100%;
const Wrapper = styled.div`
display: flex;
width:100%;
padding: 24px 24px 24px 16px;
flex-direction: column;
align-items: flex-end;
border-radius: 14px;
border: 1px solid var(--opacity, rgba(140, 140, 148, 0.50));
background: var(--carte, #F4F4F6);  

  @media screen and (max-width: 920px) {
    margin-bottom: 20px;
  }
`;
const Partie1 = styled.div`
 display: flex;
align-items: flex-start;
gap: 56px;
align-self: stretch;
@media screen and (max-width: 920px) {
    flex-direction: column;
  }
`;
const PartieTextCoach = styled.div`
display: flex;
align-items: flex-start;
gap: 16px;
`;
const PartieDesc = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 15px;
flex: 1 0 0;
`;
const GrandRow = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 12px;
align-self: stretch;
`;
const SousRow = styled.div`
display: flex;
padding-bottom: 0px;
align-items: center;
gap: 32px;
align-self: stretch;
`;
const PartieCoach = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 16px;
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
const Column = styled(FlexColumn)`
  flex: 1;
`;
const Title = styled.p`
 color: var(--black-grey, #191919);

/* Coachs H4 */
font-family: Montserrat;
font-size: 21px;
font-style: normal;
font-weight: 500;
line-height: normal;

`;
const BiographieTitle = styled.p`

align-self: stretch;
color: #E21680;

/* Texte général */
font-family: Montserrat;
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: normal;

 `;
const Contact = styled.p`
width: 1220px;
color: var(--black-grey, #191919);

/* Texte général */
font-family: Montserrat;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;

`;
export const LikeWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;
export const LikeCounter = styled.p`
  font-size: 16px;
  font-weight: 700;
  word-break: keep-all;
`;
export const IconWrapper = styled.div`
  width: 25px;
  height: 25px;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'not-allowed')};
  margin-right: 10px;
`;
export const Icon = styled.img`
  width: 100%;
  height: auto;
`;
const Row = styled(FlexRow)``;
const RowToMobileColumn = styled(Row)`
  @media screen and (max-width: 920px) {
    flex-direction: column;
  }
`;

const CourseWrapper = styled.span`
width : 100%;
height : 100%;
padding : 30px;
margin-bottom : 50px;
display : flex,
align-items : center;
background-color: white;
color: ${colors.lilac};
border-radius : 15px;
box-shadow: 0px 5px 14px rgba(8, 15, 52, 0.1);
@media screen and (max-width: 920px) {
display : block;
width : auto;
margin : auto;
}
`;

const ProfilWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 30%;
  @media screen and (max-width: 920px) {
    justify-content: center;
    margin-bottom: 20px;
  }
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
const IconArrow = styled.img`
width: 66px;
height: 38px;
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

const RightWrapper = styled.div`
display: flex,
flex-direction : column;
justify-content : center;
width : 50%;
margin : auto;
align-items : center;

@media screen and (max-width: 920px) {
width : 100%;
  margin : auto
  
  }
`;
const Attachments = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  color: ${colors.lilac};
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  max-width: 430px;
  margin: auto;
  @media screen and (max-width: 920px) {
    padding: 20px;
  }
`;
const AttachmentText = styled.p`
  color: ${colors.lilac};
  font-size: 18px;
  font-weight: 500;
  word-break: break-word;
  letter-spacing: 3px;
  text-align: left;
  margin-bottom: 20px;
  width: 100%;
`;
const AttachmentLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${colors.lilac};
  margin-bottom: 15px;
`;
const CoachPicture = styled(ProfilePicture)`
 /* width: ${CoachPictureSize}px;
  max-width: ${CoachPictureSize}px;
  height: ${CoachPictureSize}px;
  flex: 1;
  cursor: pointer;
  @media screen and (max-width: 920px) {
    margin: 0 auto 10px auto;
    flex: unset;
  }*/
  width: 200px;
height: 200px;
border-radius: 14px;
background: url(<path-to-image>), lightgray 0px -26px / 100% 169.5% no-repeat;
`;
const ProfilePictureOverlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 5px;
  //background: linear-gradient(transparent 85%, ${colors.backgroundBlackBlue}CC 100%);
  height: 100%;
  cursor: pointer;
`;

const ButtonSupport = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Links = styled.a`
  text-decoration: none;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  padding-bottom: 40px;
`;

const TextBio = styled.div`
  @media screen and (max-width: 920px) {
    font-size: 14px;
  }
`;

const InfoCoach = styled.button`
  display: flex;
  justify-content: center;
  background-color: ${colors.white};
  border: 1px solid ${colors.lilac};
  color: ${colors.lilac};
  border-radius: 10px;
  padding: 5px;
  margin: auto;
  width: 300px;
`;

const CourseInfo: FC<CourseInfoProps> = ({
  course,
  onLikeToggle,
  liked: isLiked,
  episodeData,
  canLike,
  auth,
}) => {
  const { width } = useWindowSize();
  const [liked, setLiked] = useState(false);
  const [attachmentsOpened, setAttachmentsOpened] = useState(false);
  const userLoggedIn = !!auth?.authToken;

  useEffect(() => {
    liked !== isLiked && setLiked(isLiked);
  }, [isLiked]);

  const toggleLike = (val: boolean) => {
    setLiked(val);
    onLikeToggle(course.id, val);
  };

  // Check if the user is connected and if he has access to the likes
  const asAccessToLike = (): boolean => {
    if (!userLoggedIn) return false;
    if (canLike != undefined && canLike != null) return canLike;
    return false;
  };

  const goToCoach = () => history.push(`coach/${course?.coach.id}`);

  //Show coach email only if the user is logged in and has an active subscription.
  const showEmailCoach = () => {
    const userLoggedIn = !!auth?.authToken;
    const userIsStudent = auth?.userInfo?.userRole === 'STUDENT';
    const hasTrialAccess = auth?.studentData?.trialActive;
    const hasSelectedPlan = !!auth?.studentData?.subscription?.selectedPlanId;
    const hasAccess = userLoggedIn && (!userIsStudent || hasTrialAccess || hasSelectedPlan);

    if (hasAccess) {
      return course?.coach?.email;
    }
  };

  // The userLoggedIn will check if the user is connected and if he has access at some informations
  return (
    <Wrapper>
      <Partie1>
        <PartieTextCoach>
          <TextCoach> COACH</TextCoach>
          <PartieCoach>
            <CoachPicture
              src={course?.coach?.profilePhotoUrl && `${BASE_URL}${course?.coach?.profilePhotoUrl}`}
              overlay={<ProfilePictureOverlay onClick={goToCoach} />}
            />
            <SousPartie1>
              <PartieView>
                <IconeRose src={ViewRose} />
                <PetitText>1 305 vues</PetitText>
              </PartieView>
              <PartieLike>
                <IconeRose src={HeartRose} />
                <PetitText> {course.likesCnt || 0} likes</PetitText>
              </PartieLike>
            </SousPartie1>
            <LikeWrapper>
              <IconWrapper
                clickable={asAccessToLike()}
                onClick={() => canLike && toggleLike(!liked)}
              >
                <Icon
                  checked={liked}
                  accent={colors.mainGreen}
                  src={liked ? HeartFilledImg : HeartEmptyImg}
                />
              </IconWrapper>
              <LikeCounter>{course.likesCnt || 0} likes</LikeCounter>
            </LikeWrapper>
          </PartieCoach>
        </PartieTextCoach>
        <PartieDesc>
          <GrandRow>
            <SousRow>
              <Title>
                {fullName(course?.coach)}
              </Title>
              <IconArrow src={Arrow} onClick={goToCoach} />
            </SousRow>

            <BiographieTitle>
              Biographie
            </BiographieTitle>
            {userLoggedIn == true ? (
              <BioWrapper>
                <Title style={{ fontSize: 20, fontWeight: 300, textAlign: 'justify' }}>
                  <TextBio
                    dangerouslySetInnerHTML={{
                      __html: course?.coach?.bio,
                    }}
                  />
                </Title>
              </BioWrapper>
            ) : (
              <ButtonWrapper>
                <Links href="https://www.coachs-online.net/offres-d-abonnements/" target="_blank">
                  <Button
                    style={{
                      backgroundColor: colors.mainPink,
                      color: colors.white,
                      width: 'fit-content',
                      fontSize: '20px',
                      fontWeight: '400',
                      // textTransform: 'uppercase',
                      margin: '10%',
                    }}
                  >
                    Rejoignez la plateforme
                  </Button>
                </Links>
              </ButtonWrapper>
            )}
            <BiographieTitle>
              {showEmailCoach()}
            </BiographieTitle>




            {userLoggedIn == true ? (
              <ButtonSupport>
                {!episodeData?.attachments?.length ? (
                  <p></p>
                ) : (
                  <Button
                    style={{
                      width: 'fit-content',
                      wordBreak: 'keep-all',
                      backgroundColor: colors.lilac,
                      border: 'none',
                      color: 'white',
                      padding: '20px',
                      fontSize: '22px',
                      fontWeight: '400',
                    }}
                    onClick={() => setAttachmentsOpened(true)}
                  >
                    Support de cours
                  </Button>
                )}
              </ButtonSupport>
            ) : null}


          </GrandRow>

        </PartieDesc>


      </Partie1>

      <Modal
        withHeader
        backButtonHidden
        overlayClassName="transition-position"
        style={modalStyles(width)}
        onClose={() => setAttachmentsOpened(false)}
        isOpened={attachmentsOpened}
        headerTitle={'Support de Cours'}
      >
        <Attachments>
          {episodeData?.attachments?.map((item) => (
            <AttachmentLink href={`${BASE_URL}${item.queryString}`} download target="_blank">
              {item.name}.{item.extension}
            </AttachmentLink>
          ))}
          {!episodeData?.attachments?.length && (
            <AttachmentText>Il n'y a pas de matériel pédagogique pour cet épisode</AttachmentText>
          )}
        </Attachments>
      </Modal>
    </Wrapper>
  );
};

export default CourseInfo;

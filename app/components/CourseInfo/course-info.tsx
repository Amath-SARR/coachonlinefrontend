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

const CoachPictureSize = 200;

// margin-bottom: 20px;
// align-items: center;
// width: 100%;
const Wrapper = styled.div`
  font-size: 100%;
  @media screen and (max-width: 920px) {
    margin-bottom: 20px;
  }
`;
const Column = styled(FlexColumn)`
  flex: 1;
`;
const Title = styled.p`
  font-size: 28px;
  font-weight: 700;
  margin-right: 15px;
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
  width: ${CoachPictureSize}px;
  max-width: ${CoachPictureSize}px;
  height: ${CoachPictureSize}px;
  flex: 1;
  cursor: pointer;
  @media screen and (max-width: 920px) {
    margin: 0 auto 10px auto;
    flex: unset;
  }
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
      <RowToMobileColumn style={{ alignItems: 'center' }}>
        <CourseWrapper>
          <ProfilWrapper>
            <CoachPicture
              src={course?.coach?.profilePhotoUrl && `${BASE_URL}${course?.coach?.profilePhotoUrl}`}
              overlay={<ProfilePictureOverlay onClick={goToCoach} />}
            />

            <Title
              style={{ fontSize: '1em', fontWeight: 600, textAlign: 'center', marginTop: '8px' }}
            >
              {fullName(course?.coach)}
            </Title>
            {/* <Title style={{ fontSize: 20, fontWeight: 400, textAlign: 'center' }}>
              {course.name}
            </Title> */}
          </ProfilWrapper>
          <RightWrapper>
            <Title
              style={{
                fontSize: '1em',
                fontWeight: 400,
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              Biographie
              {/* <p
                style={{
                  fontSize: '1em',
                  fontWeight: 600,
                  color: colors.lilac,
                  marginLeft: '5px',
                }}
              >
                {fullName(course?.coach)}
              </p> */}
            </Title>
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
            <Title
              style={{ fontSize: 18, fontWeight: 400, textAlign: 'center', color: colors.lilac }}
            >
              {showEmailCoach()}
            </Title>

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
            <InfoCoach onClick={goToCoach}>En savoir plus sur le coach</InfoCoach>
          </RightWrapper>
        </CourseWrapper>
      </RowToMobileColumn>
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

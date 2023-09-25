import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { fullName } from '../../utils/formatters';
// import { DispatchType } from '../../types';
// import { createStructuredSelector } from 'reselect';
// import { connect } from 'react-redux';
// import { compose } from '@reduxjs/toolkit';
import CourseCardProps from './course-card.props';
// import HeartFilledImg from '../../images/icons/heart--filled--lilac.svg';
// import HeartEmptyImg from '../../images/icons/heart--empty--pink.svg';
import { FlexRow, Text } from '../../global-styles';
import { BASE_URL } from '../../config/env';
// import { Category } from '../CategorySelector';
const ITEM_WIDTH = 354;
const Container = styled.div`
  width: 354px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0px 5px 14px rgba(8, 15, 52, 0.1);
  //margin-left: 20px;
  //margin-right: -50px;
  margin-bottom: 20px;
  margin: 10px 10px 10px 10px;
  //position: relative;
  @media screen and (max-width: 900px) {
    //width: 280px;
    //margin-right: 20px;
  }
`;

const CoverImage = styled.img`
  // width: 100%;
  // height: 100%;
  // max-width: 204px;
  // max-height: 200px;
  width: 354px;
  height: 200px;
  background-image: url();
  border-radius: 15px 15px 0px 0px;
  bottom: 32, 2%;
`;
const Title = styled.p`
  font-size: 16px;
  color: black;
  text-align: start;
  //margin-bottom: 8px;
  margin-left: 12px;
  margin-right: 8px;
  padding-top: 10px;
  //overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, white 70%, transparent 100%);
  //mask-image: linear-gradient(to bottom, white 50%, transparent 100%);
  transition: max-height 0.5s ease-in-out;
  max-height: 60px;
`;
const CoachName = styled.p`
  font-family: Montserrat;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  //line-height: normal;
  margin-top:10px;
  margin-left:250px;
  color: #000;
  //text-align: right;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 130.19px;
  cursor: pointer;
  padding-bottom: 10px;
`;

// const IconWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   width: 25px;
//   height: 25px;
//   //cursor: ${(props) => (props.clickable ? 'pointer' : 'not-allowed')};
//   margin-right: 10px;
// `;
const LikeWrapper = styled(FlexRow)`
  position: sticky;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 8px;
  //flex-direction: column;
`;
const LikeCounter = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  word-break: keep-all;
  margin-right: 20px;
  margin-left: 5px;
`;
// const Icon = styled.img`
//   width: 20px;
//   height: 20px;
//   color:#E21680;
// `;
// const CategoryContainer = styled.div`
//   display: flex;
//   width: 100%;
//   height: 100%;
//   align-items: end;
//   margin-left: 10px;
//   margin-bottom: 10px;
//   margin-top: -45px;
//   //z-index: 1;
// `;

const Index = styled(Title)`
  text-transform: uppercase;
  height: 300px;
  width: 200px;
  margin-top: -42px;
  margin-left: -2px;
  font-size: 3em;
  font-weight: 1000;
  color: #fff;
  @media screen and (max-width: 920px) {
    font-size: 14px;
    height: 30px;
  }
  `;

function CourseCard(props: CourseCardProps) {
  const { course, onLikeToggle, canLike, liked: isLiked, onItemClick, auth, index, isTodays } = props || {};
  const [liked, setLiked] = useState(false);
  const userLoggedIn = !!auth?.authToken;

  useEffect(() => {
    liked !== isLiked && setLiked(isLiked);
  }, [isLiked]);

  const toggleLike = (val: boolean) => {
    setLiked(val);
    onLikeToggle(course?.id, val);
  };

  const getCourseName = () => {
    if (course?.name) return course?.name;
    else return course?.courseName;
  };

  const getCategorieName = () => {
    if (course?.category?.name) return course?.category?.name;
    else return course?.category;
  };

  const getIndex = () => {
    return index;
  };

  const getCoursePhotoUrl = () => {
    if (course?.photoUrl) return course?.photoUrl;
    else return course?.coursePhotoUrl;
  };
  const asAccessToLike = (): boolean => {
    if (!userLoggedIn) return false;
    if (canLike != undefined && canLike != null) return canLike;
    return false;
  };

  return (
    <>
      <Container>
        <CoverImage style={{ maxWidth: '100%' }} src={`${BASE_URL}${getCoursePhotoUrl()}`} />
        <span style={{
          position: 'absolute', right: 16,
          top: 18, borderRadius: 10, border: '1px solid var(--white, #FFF)',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(2px)', display: 'flex',
          padding: '8px 16px', alignItems: 'flex-start',
          gap: '8px', color: 'var(--white, #FFF)', textAlign: 'right',
          fontFamily: 'Montserrat', fontSize: 16,
          fontStyle: 'normal', fontWeight: 300, lineHeight: '94.023%'
        }}>{getCategorieName()}</span>

        {/*
          <CategoryContainer>
            <Category style={{ backgroundColor: colors.lilac, color: 'white', zIndex: 1 }}>
              {category}
            </Category>
          </CategoryContainer> */}

        <InfoWrapper onClick={onItemClick}>
          {isTodays == "Top Cours aujourd\'hui" && (
            <Index>#{getIndex() + 1}</Index>
          )}
          <div style={{ display: 'flex', marginLeft: '8px', marginTop: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8L4 13L4 3L13 8Z" fill="#E21680" ></path>
            </svg>
            <span style={{ color: '#000' }}>1 305 vues</span>
            &nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5.59935 3.5C3.74544 3.5 2.16602 4.8862 2.16602 6.68653C2.16602 7.9285 2.74758 8.97412 3.51834 9.84028C4.28646 10.7035 5.27745 11.428 6.17333 12.0344L7.71907 13.0807C7.88836 13.1953 8.11034 13.1953 8.27962 13.0807L9.82537 12.0344C10.7213 11.428 11.7122 10.7035 12.4804 9.84028C13.2511 8.97412 13.8327 7.9285 13.8327 6.68653C13.8327 4.8862 12.2533 3.5 10.3993 3.5C9.4437 3.5 8.60279 3.94809 7.99935 4.52789C7.39591 3.94809 6.555 3.5 5.59935 3.5Z" fill="#E21680" />
            </svg>
            {/* <Icon
              style={{ filter: 'none' }}
              checked={liked}
              accent={colors.mainGreen}
              src={HeartFilledImg}
            /> */}
            <LikeCounter style={{ color: '#000' }}>{course?.likesCnt || 0} <span>j’aime</span> </LikeCounter>
          </div>
          <Title>{getCourseName()}</Title>
          <LikeWrapper>
            <CoachName>{fullName(course?.coach)}</CoachName>
            {/* <IconWrapper
              style={{ marginRight: 25 }}
              clickable={asAccessToLike()}
              onClick={() => canLike && toggleLike(!liked)}
            >
            </IconWrapper> */}
          </LikeWrapper>
        </InfoWrapper>
      </Container>
    </>

  );
}
// const mapStateToProps = createStructuredSelector({
//   homePage: makeSelectHomePage(),
// });
// function mapDispatchToProps(dispatch: DispatchType) {
//   return {
//     dispatch,
//     //getCourses: () => dispatch(getExempleCourses()),
//   };
// }

// const withConnect = connect(mapStateToProps, mapDispatchToProps);

// export default compose(withConnect)(CourseCard);

CourseCard.propTypes = {};
export default CourseCard;

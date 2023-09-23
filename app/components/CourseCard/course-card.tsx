import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { fullName } from '../../utils/formatters';
// import { DispatchType } from '../../types';
// import { createStructuredSelector } from 'reselect';
// import { connect } from 'react-redux';
// import { compose } from '@reduxjs/toolkit';
import CourseCardProps from './course-card.props';
import HeartFilledImg from '../../images/icons/heart--filled--lilac.svg';
import HeartEmptyImg from '../../images/icons/heart--empty--pink.svg';
import { FlexRow, Text } from '../../global-styles';
import { BASE_URL } from '../../config/env';
import { Category } from '../CategorySelector';
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
  margin-bottom: 8px;
  margin-left: 12px;
  margin-right: 8px;
  padding-top: 15px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, white 70%, transparent 100%);
  //mask-image: linear-gradient(to bottom, white 50%, transparent 100%);
  transition: max-height 0.5s ease-in-out;
  max-height: 50px;
`;
const CoachName = styled.p`
  font-weight: bolder;
  text-align: start;
  margin-left: 12px;
  margin-right: 8px;
  font-size: 16px;
  color: black;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 104.19px;
  cursor: pointer;
  padding-bottom: 10px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 25px;
  height: 25px;
  //cursor: ${(props) => (props.clickable ? 'pointer' : 'not-allowed')};
  margin-right: 10px;
`;
const LikeWrapper = styled(FlexRow)`
  position: sticky;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 8px;
`;
const LikeCounter = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  word-break: keep-all;
  margin-right: 20px;
  margin-left: 5px;
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
`;
const CategoryContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: end;
  margin-left: 10px;
  margin-bottom: 10px;
  margin-top: -45px;
  //z-index: 1;
`;

const Index = styled(Title)`
  text-transform: uppercase;
  height: 200px;
  width: 200px;
  margin-top: -40px;
  margin-left: -2px;
  font-size: 3em;
  font-weight: 700;
  color: #fff;
  @media screen and (max-width: 920px) {
    font-size: 14px;
    height: 30px;
  }
  `;

function CourseCard(props: CourseCardProps) {
  const { course, onLikeToggle, canLike, liked: isLiked, onItemClick, auth, index } = props || {};
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
        {/*
          <CategoryContainer>
            <Category style={{ backgroundColor: colors.lilac, color: 'white', zIndex: 1 }}>
              {category}
            </Category>
          </CategoryContainer> */}

        <InfoWrapper onClick={onItemClick}>
          <Index>#{getIndex() + 1}</Index>
          <Title>{getCourseName()}</Title>
          <LikeWrapper>
            <CoachName>{fullName(course?.coach)}</CoachName>
            <IconWrapper
              style={{ marginRight: 25 }}
            //clickable={asAccessToLike()}
            //onClick={() => canLike && toggleLike(!liked)}
            >
              <Icon
                style={{ filter: 'none' }}
                checked={liked}
                accent={colors.mainGreen}
                src={HeartFilledImg}
              />
              <LikeCounter style={{ color: colors.black }}>{course?.likesCnt || 0}</LikeCounter>
            </IconWrapper>
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

/**
 *
 * PlatformStatistics
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import makeSelectHomePage from '../../containers/HomePage/selectors';
import { getPlatformStatisticsAction } from '../../containers/HomePage/actions';
import Image from '../Image';
import { colors } from '../../utils/colors';
import messages from '../messages';
import { FlexRow } from '../../global-styles';
import makeSelectAuth from '../../containers/Auth/selectors';
const CategoriesIcon = require('../../images/icons/categories.svg');
const CoachesIcon = require('../../images/icons/coaches.svg');
const VideoMaterialIcon = require('../../images/icons/video-material.svg');
const BooksIcon = require('../../images/icons/books.svg');
import Button from '../../components/Button';

const Wrapper = styled.div`
  width: 100%;
  padding: 25px 20px;
  background: linear-gradient(90deg, #7474fc 30%, ${colors.mainPink} 100%);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 25px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  position: relative;
  @media screen and (max-width: 500px) {
    padding: 10px;
  }
`;
const DataWrapper = styled.div`
  margin: 15px;
`;
const DataText = styled.p`
  font-size: 100px;
  font-weight: 200;
  color: ${colors.white};
  text-align: center;
  @media screen and (max-width: 1150px) {
    font-size: 60px;
  }
  @media screen and (max-width: 500px) {
    font-size: 40px;
  }
`;
const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Icon = styled(Image)`
  width: 40px;
  height: auto;
  margin-right: 5px;
  @media screen and (max-width: 1150px) {
    width: 20px;
  }
  @media screen and (max-width: 500px) {
    width: 15px;
  }
`;
const Label = styled(DataText)`
  font-size: 31px;
  text-transform: lowercase;
  @media screen and (max-width: 1150px) {
    font-size: 25px;
  }
  @media screen and (max-width: 500px) {
    font-size: 20px;
  }
  @media screen and (max-width: 375px) {
    font-size: 15px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 35px;
  padding-bottom: 70px;
`;
const Links = styled.a`
  text-decoration: none;
`;
function PlatformStatistics({ homePage, getPlatformStatistics, auth }) {
  const [categoriesNumber, setCategoriesNumber] = useState(0);
  const [coachesNumber, setCoachesNumber] = useState(0);
  const [coursesNumber, setCoursesNumber] = useState(0);
  const [watchableSecondsNumber, setWatchableSecondsNumber] = useState(0);
  const userLoggedIn = !!auth.authToken;

  useEffect(() => {
    getPlatformStatistics();
  }, []);

  useEffect(() => {
    if (homePage.platformStatistics?.totalCategories > categoriesNumber) {
      setTimeout(() => setCategoriesNumber(categoriesNumber + 1), 30);
    }
  }, [homePage.platformStatistics?.totalCategories, categoriesNumber]);

  useEffect(() => {
    if (homePage.platformStatistics?.totalCoaches > coachesNumber) {
      setTimeout(() => setCoachesNumber(coachesNumber + 1), 30);
    }
  }, [homePage.platformStatistics?.totalCoaches, coachesNumber]);

  useEffect(() => {
    if (homePage.platformStatistics?.totalCourses > coursesNumber) {
      setTimeout(() => setCoursesNumber(coursesNumber + 1), 30);
    }
  }, [homePage.platformStatistics?.totalCourses, coursesNumber]);

  useEffect(() => {
    if (homePage.platformStatistics?.totalMediaTime > watchableSecondsNumber) {
      setTimeout(() => setWatchableSecondsNumber(watchableSecondsNumber + 3600), 20);
    }
  }, [homePage.platformStatistics?.totalMediaTime, watchableSecondsNumber]);

  return (
    <div style={{ marginLeft: '40px', marginRight: '30px' }}>
      <Wrapper>
        <DataWrapper>
          <DataText>{categoriesNumber}</DataText>
          <LabelWrapper>
            <Icon src={CategoriesIcon} />
            <Label>
              <FormattedMessage {...messages.categories} />
            </Label>
          </LabelWrapper>
        </DataWrapper>
        <DataWrapper>
          <DataText>{coachesNumber}</DataText>
          <LabelWrapper>
            <Icon src={CoachesIcon} />
            <Label>
              <FormattedMessage {...messages.coaches} />
            </Label>
          </LabelWrapper>
        </DataWrapper>
        <DataWrapper>
          <DataText>{coursesNumber}</DataText>
          <LabelWrapper>
            <Icon src={VideoMaterialIcon} />
            <Label>formations</Label>
          </LabelWrapper>
        </DataWrapper>
        <DataWrapper>
          <DataText>
            {Math.round(watchableSecondsNumber / 60 / 60)}
            H+
          </DataText>
          <LabelWrapper>
            <Icon style={{ filter: 'invert(1)', opacity: 0.9 }} src={BooksIcon} />
            <Label>
              <FormattedMessage {...messages.videoMaterial} />
            </Label>
          </LabelWrapper>
        </DataWrapper>
      </Wrapper>
      {/* <ButtonWrapper>
        {!userLoggedIn && (
          <Links href="https://www.coachs-online.net/offres-d-abonnements/" target="_blank">
            <Button
              style={{
                backgroundColor: colors.mainPink,
                color: colors.white,
                width: 'fit-content',
                fontSize: '20px',
                fontWeight: '400',
                textTransform: 'uppercase',
              }}
            >
              Commencer l'expérience
            </Button>
          </Links>
        )}{' '}
      </ButtonWrapper> */}
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getPlatformStatistics: () => dispatch(getPlatformStatisticsAction()),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  homePage: makeSelectHomePage(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(PlatformStatistics);

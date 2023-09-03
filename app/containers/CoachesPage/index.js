/**
 *
 * SearchResultPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import PageContainer from '../../components/PageContainer';
import makeSelectHomePage from '../HomePage/selectors';
import styled from 'styled-components';
import { CoachItem } from '../../components/CoachesSectionList';
import { readFromStorage } from '../../utils/storage';
import history from '../../utils/history';
import { useLocation } from 'react-router-dom';

const CoachesGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const CoachesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  @media screen and (max-width: 1366px) {
    justify-content: center;
  }
`;

export function CoachesPage({ homePage }) {
  const location = useLocation();

  const goToCoach = (id) => {
    const authToken = readFromStorage('authToken');
    if (authToken) {
      history.push(`coach/${id}`);
    } else {
      history.push('/auth/login', { background: location });
    }
  };

  const filterCoaches = (list) =>
    list
      ?.filter((coach) => coach.courses?.length > 0)
      ?.sort((a, b) => b.courses?.length - a.courses?.length);

  return (
    <div>
      <Helmet>
        <title>Search results</title>
        <meta name="description" content="Description of ProfilePage" />
      </Helmet>
      <PageContainer
        colorScheme="dark"
        style={{
          windowContainer: { border: 'none', maxWidth: '1460px', padding: 0 },
        }}
      >
        <CoachesGridWrapper>
          <CoachesGrid>
            {filterCoaches(homePage.coaches)?.map((coach, index) => (
              <CoachItem
                key={coach.userId}
                item={coach}
                index={index}
                onItemClick={() => goToCoach(coach.userId)}
              />
            ))}
          </CoachesGrid>
        </CoachesGridWrapper>
      </PageContainer>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CoachesPage);

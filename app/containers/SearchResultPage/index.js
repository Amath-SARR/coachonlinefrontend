/**
 *
 * SearchResultPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import PageContainer from '../../components/PageContainer';
import useQuery from '../../hooks/useQuery';
import CoursesGrid from '../../components/CoursesGrid';
import makeSelectHomePage from '../HomePage/selectors';
import { getCourseAction, searchAction, setHomePageFilterAction } from '../HomePage/actions';

export function SearchResultPage({ homePage, setChosenCourse, search, setSearchValue }) {
  const query = useQuery();
  const searchValue = query.get('value');
  const searchType = query.get('type');

  useEffect(() => {
    onSearchValueChange(searchValue);
  }, [searchValue]);

  const onSearchValueChange = (val) => {
    const encodedVal = encodeURIComponent(val);
    search({ value: encodedVal, type: searchType });
    setSearchValue(encodedVal);
  };

  const goToCourse = (course) => {
    console.log('Course to go to ', course);
    setChosenCourse(course?.courseId || course?.id);
  };

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
        <CoursesGrid
          title={searchValue}
          onCancel={() => null}
          items={homePage.course}
          onItemClick={(course) => goToCourse(course)}
        />
      </PageContainer>
    </div>
  );
}

SearchResultPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setChosenCourse: (id) => dispatch(getCourseAction(id)),
    search: (value) => dispatch(searchAction(value)),
    setSearchValue: (value) => dispatch(setHomePageFilterAction(value)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SearchResultPage);

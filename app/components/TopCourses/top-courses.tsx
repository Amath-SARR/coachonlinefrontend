import React, { useEffect, memo, useState } from 'react';
import styled from 'styled-components';
import { Category } from '../CategorySelector';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import makeSelectDashboard from '../../containers/Dashboard/selectors';
import makeSelectHomePage from '../../containers/HomePage/selectors';
import makeSelectAuth from '../../containers/Auth/selectors';
import { getCategoriesAction } from '../../containers/Dashboard/actions';
import {
  getTrendingCoursesAction,
  getCourseAction,
  getSuggestedCoursesAction,
} from '../../containers/HomePage/actions';
import TopCoursesProps from './top-courses.props';
import CourseCard from '../CourseCard/course-card';
import history, { replaceWithBackground } from '../../utils/history';
import Button from '../Button';
import HorizontalSectionList from '../HorizontalSectionList';
import { colors } from '../../utils/colors';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //padding: 50px;
  @media screen and (max-width: 900px) {
    margin-top: 50px;
  }
`;
const Title = styled.p`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
`;
const Subtitle = styled.p`
  font-size: 18px;
  margin-bottom: 15px;
  @media screen and (max-width: 900px) {
    font-size: 13px;
    text-align: center;
  }
`;
const CategoryContainer = styled.div`
  display: flex;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 50px;
  @media screen and (max-width: 900px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(5, 0.5fr);
    grid-gap: 10px;

    box-sizing: border-box;
  }
`;

const Category1 = styled(Category)`
  @media screen and (max-width: 900px) {
    width: 120px;
    text-align: center;
    word-break: keep-all;
  }
`;

const CoursesContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: wrap;
  overflow-x: scroll;
  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const ListItem = styled(CourseCard)`
  width: auto;
  padding-right: -200px;
`;

function TopCourses(
  props: TopCoursesProps,
  keys = { name: 'courseName', id: 'courseId', image: 'coursePhotoUrl' },
  withIndexes = false,
  selected: any,
  onChange = (category) => null,
) {
  const { dashboard, getCategories, homePage, setChosenCourse, auth, getSuggestedCourses } =
    props || {};
  useEffect(() => {
    getCategories();
    getSuggestedCourses();
  }, []);

  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(selected);

  useEffect(() => {
    setSelectedCategory(selected);
  }, [selected?.id]);

  const onCategorySelect = (category) => {
    // console.log("category selected : ", homePage?.courses
    //  .filter((cat: any) => category?.id === cat?.categoryId)
    //   );
    if (category.id != selectedCategory?.id) {
      setShowAll(true);
    }
    // This section would display all the courses for the categories
    // Problem with the display all categories and sections for it

    // if (category.id == selectedCategory?.id) {
    //   setShowAll(false);
    // }
    // const selectedCat = selectedCategory?.id === category?.id;
    // if (!selectedCat) {
    //   console.log("category check false", showAll, selectedCategory?.id, category?.id)
    //   setShowAll(showAll);
    // }
    // if (selectedCat) {
    //   console.log("category check true", showAll, selectedCategory?.id, category?.id)
    //   setShowAll(!showAll);
    // }
    setSelectedCategory(category);
    onChange(category);
  };

  const goToCourse = (course) => {
    const hasAccess =
      auth.userInfo?.userRole !== 'STUDENT' ||
      !!auth.studentData?.trialActive ||
      !!auth.studentData?.subscription?.selectedPlanId;
    if (auth.authToken && !hasAccess) {
      return replaceWithBackground({ path: '/subscription/subscriptionChoice', history, location });
    }
    if (!auth.authToken || !hasAccess) {
      const forms = document.querySelector('#homepage_subs');
      const y = forms?.getBoundingClientRect().top + window.pageYOffset + -100;
      return window.scrollTo({
        top: y,
        behavior: 'smooth',
        // block: 'start',
      });
    }
    setChosenCourse(course?.courseId || course?.id);
  };

  return (
    <div>
      <Wrapper>
        <Title>Top Catégories</Title>
        <Subtitle>Découvrez le top 10 des catégories !</Subtitle>
        <CategoryContainer>
          {dashboard?.categories?.slice(0, 10).map((category: any) => (
            <Category1
              // style={{ marginRight: '15px' }}
              key={category?.id}
              onClick={() => onCategorySelect(category)}
              isSelected={selectedCategory?.id === category?.id}
            >
              {category.name}
            </Category1>
          ))}
        </CategoryContainer>

        {/* //try to map all the courses, but can't get some infos like photo, name... */}
        <CoursesContainer>
          {!showAll
            ? homePage?.courses.slice(0, 10).map((cat: any, i: any) => (
                <ListItem
                  key={cat[keys.id]}
                  // cat={cat}
                  course={cat}
                  onItemClick={() => goToCourse(cat)}
                  keys={{ id: 'id', name: 'name', image: 'photoUrl' }}
                  withIndex={withIndexes}
                  index={i}
                />
              ))
            : homePage?.courses
                ?.filter((cat: any) => selectedCategory?.id === cat?.categoryId)
                .map((cat: any, i: any) => (
                  <ListItem
                    key={cat[keys.id]}
                    // cat={cat}
                    course={cat}
                    onItemClick={() => goToCourse(cat)}
                    keys={{ id: 'id', name: 'name', image: 'photoUrl' }}
                    withIndex={withIndexes}
                    index={i}
                  />
                ))}
        </CoursesContainer>
      </Wrapper>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
  homePage: makeSelectHomePage(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getCategories: () => dispatch(getCategoriesAction()),
    setChosenCourse: (id) => dispatch(getCourseAction(id)),
    getSuggestedCourses: () => dispatch(getSuggestedCoursesAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, memo)(TopCourses);

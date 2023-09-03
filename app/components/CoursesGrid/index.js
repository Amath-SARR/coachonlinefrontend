/**
 *
 * CoursesGrid
 *
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import cancelIcon from '../../images/icons/cancel.svg';
import CourseListItem from '../CourseListItem';
import CourseCard from '../CourseCard/course-card';
import { colors } from '../../utils/colors';
import { SectionTitle, SectionTitleWrapper } from '../HorizontalSectionList';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const CoursesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  @media screen and (max-width: 920px) {
    justify-content: center;
    margin-top: 90px;
  }
`;
const ListItem = styled(CourseCard)``;
const Icon = styled.img`
  width: auto;
  height: 100%;
`;

function CoursesGrid({
  title,
  onCancel,
  items,
  onItemClick,
  keys = { name: 'courseName', id: 'courseId', image: 'coursePhotoUrl' },
}) {
  useEffect(() => {
    document.querySelectorAll('img[alt="Logo"]').forEach((el) => {
      el.addEventListener('click', onCancel);
    });
  }, []);
  return (
    <Wrapper>
      <SectionTitleWrapper>
        <SectionTitle>{title}</SectionTitle>
      </SectionTitleWrapper>
      <CoursesWrapper>
        {items?.map((course, i) => (
          <ListItem
            key={course[keys.id]}
            course={course}
            item={course}
            keys={keys}
            onItemClick={() => onItemClick(course)}
            index={i}
          />
        ))}
      </CoursesWrapper>
    </Wrapper>
  );
}

CoursesGrid.propTypes = {};

export default CoursesGrid;

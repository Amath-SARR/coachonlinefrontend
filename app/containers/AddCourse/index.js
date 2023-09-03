/**
 *
 * AddCourse
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import OfficeNavigator from '../../components/OfficeNavigator';
import AddCourseMainColumn from '../../components/AddCourseMainColumn';
import AddCourseSecondColumn from '../../components/AddCourseSecondColumn';
import HeadingLogo from '../../components/HeadingLogo';
import { ContainerBackoffice } from '../Dashboard';
import reducer from '../Dashboard/reducer';
import saga from '../Dashboard/saga';
import makeSelectDashboard from '../Dashboard/selectors';
import {
  addAttachmentToEpisodeAction,
  addEpisodeAction,
  addPromoEpisodeAction,
  editEpisodesAction,
  editPromoEpisodesAction,
  getCategoriesAction,
  getCourseAction,
  removeAttachmentFromEpisodeAction,
  removeCourseAction,
  removeEpisodeAction,
  removeMediaFromEpisodeAction,
  saveCourseAction,
  setLastAddedEpisodeId,
  setLastAddedEpisodeIdAction,
  submitCourseAction,
  suggestCategoryAction,
  UploadCoursePhotoAction,
} from '../Dashboard/actions';
import PageContainer from '../../components/PageContainer';

const ColumnsWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;

export function AddCourse({
  history,
  dashboard,
  saveCourse,
  submitCourse,
  addPromoEpisode,
  editPromoEpisodes,
  addEpisode,
  getCourse,
  setLastAddedEpisodeId,
  editEpisodes,
  uploadCoursePhoto,
  addAttachment,
  removeAttachment,
  removeEpisode,
  removeCourse,
  removeMedia,
  getCategories,
  suggestCategory,
}) {
  const { id } = useParams();

  useEffect(() => {
    getCourse(id);
    getCategories();
  }, []);

  // useEffect(() => {
  //   if (!dashboard.currentCourseId) {
  //     history.replace('/dashboard');
  //   }
  // }, []);

  const submitCourseWrapper = (data) => {
    submitCourse(data);
  };

  return (
    <div>
      <Helmet>
        <title>AddCourse</title>
        <meta name="description" content="Description of AddCourse" />
      </Helmet>
      <PageContainer history={history} withPanel>
        <ColumnsWrapper>
          <AddCourseMainColumn
            dashboard={dashboard}
            addPromoEpisode={addPromoEpisode}
            editPromoEpisodes={editPromoEpisodes}
            addEpisode={addEpisode}
            editEpisodes={editEpisodes}
            setLastAddedEpisodeId={setLastAddedEpisodeId}
            addAttachment={addAttachment}
            removeAttachment={removeAttachment}
            removeEpisode={removeEpisode}
            removeMedia={removeMedia}
          />
          <AddCourseSecondColumn
            dashboard={dashboard}
            saveCourse={saveCourse}
            submitCourse={submitCourseWrapper}
            uploadCoursePhoto={uploadCoursePhoto}
            removeCourse={removeCourse}
            suggestCategory={suggestCategory}
          />
        </ColumnsWrapper>
      </PageContainer>
    </div>
  );
}

AddCourse.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
});

function mapDispatchToProps(dispatch) {
  return {
    getCourse: (courseId) => dispatch(getCourseAction({ courseId })),
    saveCourse: (data) => dispatch(saveCourseAction(data)),
    submitCourse: (data) => dispatch(submitCourseAction(data)),
    addPromoEpisode: (data) => dispatch(addPromoEpisodeAction(data)),
    editPromoEpisodes: (data) => dispatch(editPromoEpisodesAction(data)),
    addEpisode: (data) => dispatch(addEpisodeAction(data)),
    setLastAddedEpisodeId: (data) => dispatch(setLastAddedEpisodeIdAction(data)),
    editEpisodes: (data) => dispatch(editEpisodesAction(data)),
    uploadCoursePhoto: (data) => dispatch(UploadCoursePhotoAction(data)),
    addAttachment: (data) => dispatch(addAttachmentToEpisodeAction(data)),
    removeAttachment: (data) => dispatch(removeAttachmentFromEpisodeAction(data)),
    removeEpisode: (data) => dispatch(removeEpisodeAction(data)),
    removeCourse: (data) => dispatch(removeCourseAction(data)),
    removeMedia: (data) => dispatch(removeMediaFromEpisodeAction(data)),
    getCategories: () => dispatch(getCategoriesAction()),
    suggestCategory: (data) => dispatch(suggestCategoryAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(AddCourse);

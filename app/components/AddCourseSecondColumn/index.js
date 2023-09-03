/**
 *
 * AddCourseSecondColumn
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from 'react-modal';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import InputSubmit from '../InputSubmit';
import AddImageIcon from '../../images/icons/addImage.svg';
import Input from '../Input';
import InputTextarea from '../InputTextarea';
import { BASE_URL } from '../../config/env';
import Button from '../Button';
import SelectInput from '../SelectInput';
import messages from '../messages';
import Image from '../Image';
import CategoriesManager from '../CategoriesManager';
import FileInput from '../FileInput';
import { colors } from '../../utils/colors';

import NoImageImg from '../../images/images/no-image.png';
import { yupValidators } from '../../utils/validate';

const ColumnWrapper = styled.div`
  flex: 1;
  padding: 0 45px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1024px) {
    padding: 0 15px;
    margin-top: 25px;
  }
`;
const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 354px;
  width: 100%;
`;
const StyledImage = styled(Image)`
  width: 100px;
  height: auto;
  margin: auto;
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const registerSchema = yup.object().shape({
  name: yupValidators.notEmpty,
  category: yup.object().pick(['value']).required(),
  subCategory: yup.object().pick(['value']),
});

function AddCourseSecondColumn({
  saveCourse,
  submitCourse,
  dashboard,
  uploadCoursePhoto,
  removeCourse,
  suggestCategory,
}) {
  const inputRef = useRef();
  const [imagePreview, setImagePreview] = useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalSubmitOpen, setModalSubmitOpen] = React.useState(false);
  const [description, setDescription] = useState(dashboard.courseData.description);
  const [imageLoading, setImageLoading] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const openSubmitModal = () => {
    onSubmit(getValues(), () => setModalSubmitOpen(true));
  };
  const closeSubmitModal = () => {
    setModalSubmitOpen(false);
  };

  const { register, handleSubmit, errors, control, getValues } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit = (data, onFinish) => {
    saveCourse({
      data: {
        ...dashboard.courseData,
        ...data,
        description,
      },
      episodes: [...dashboard.promoEpisodes, ...dashboard.episodes],
      currentCourseId: dashboard.currentCourseId,
      onFinish: onFinish,
    });
  };

  useEffect(() => {
    setDescription(dashboard.courseData.description);
  }, [dashboard.courseData.description]);

  useEffect(() => {
    if (dashboard.courseData.photoUrl) {
      setImagePreview(BASE_URL + dashboard.courseData.photoUrl);
    }
  }, [dashboard.courseData.photoUrl]);

  const onImageInput = (img) => {
    setImageLoading(true);
    uploadCoursePhoto({ base64: img, onFinish: () => setImageLoading(false) });
  };

  const removeCourseHandle = () => removeCourse({ courseId: dashboard.currentCourseId });

  const handleCourseSubmit = () => {
    let allEpisodesHaveDescriptions = true;
    let allEpisodesHaveVideos = true;
    let hasCoverPhoto = true;
    dashboard.episodes.forEach((episode) => {
      if (!episode.description) {
        allEpisodesHaveDescriptions = false;
      }
      if (!episode.mediaId) {
        allEpisodesHaveVideos = false;
      }
    });
    if (!imagePreview) {
      toast.error('Ajouter une photo au cours');
      hasCoverPhoto = false;
    }
    if (
      dashboard.episodes.length > 0 &&
      allEpisodesHaveDescriptions &&
      allEpisodesHaveVideos &&
      hasCoverPhoto
    ) {
      submitCourse({ courseId: dashboard.currentCourseId });
    } else {
      closeSubmitModal();
      toast.error('Vous devez compléter les données sur les épisodes');
    }
  };

  const shouldShowSubmitButton =
    !!dashboard.currentCourseId &&
    (dashboard.courseData?.state !== 0 || dashboard.courseData?.state !== 2);

  return (
    <ColumnWrapper>
      {shouldShowSubmitButton && (
        <Button
          disableOnFetch
          color="pink"
          onClick={openSubmitModal}
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: '15px 10px',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <FormattedMessage {...messages.submitCourse} />
        </Button>
      )}
      {/*<div style={{ textAlign: 'center' }}>*/}
      {/*  <Button*/}
      {/*    onClick={openModal}*/}
      {/*    style={{*/}
      {/*      fontSize: 13,*/}
      {/*      padding: '15px 40px',*/}
      {/*      borderColor: 'red',*/}
      {/*      backgroundColor: 'red',*/}
      {/*      margin: '10px auto',*/}
      {/*      color: colors.white,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <FormattedMessage {...messages.deleteCourse} />*/}
      {/*  </Button>*/}
      {/*</div>*/}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ position: 'relative' }}>
          <ImageWrapper>
            <FileInput
              useCropper
              loading={imageLoading}
              dark={false}
              imagePreview={imagePreview}
              onInput={onImageInput}
            >
              <StyledImage src={NoImageImg} />
            </FileInput>
          </ImageWrapper>
          <input type="file" ref={inputRef} style={{ display: 'none' }} accept="image/*" />
          <p
            style={{
              fontSize: '15px',
              color: '#00000075',
              marginBottom: '35px',
            }}
          >
            <strong>
              <FormattedMessage {...messages.advice} />{' '}
            </strong>
            <FormattedMessage {...messages.adviceDisc} />
          </p>
          <Input
            inputProps={{
              ref: register,
              name: 'name',
              defaultValue: dashboard.courseData.name,
            }}
            labelName={messages.courseName}
            error={errors.name?.message}
          />
          <CategoriesManager
            categories={dashboard.categories}
            category={dashboard.courseData?.category}
            control={control}
            suggestCategory={suggestCategory}
          />
          <InputTextarea
            editor={InlineEditor}
            inputProps={{
              defaultValue: description,
              onChange: (data) => setDescription(data),
            }}
            labelName={messages.Description}
            error={errors.Description?.message}
            textareaStyle={{ maxHeight: '200px' }}
          />
        </div>
        <div
          style={{
            textAlign: 'center',
            margin: '0 auto',
          }}
        >
          <InputSubmit
            disableOnFetch
            background={colors.mainPink}
            color={colors.white}
            value="SAUVEGARDER LES MODIFICATIONS"
            style={{ marginBottom: '10px', width: '100%' }}
            inputStyle={{ width: '100%' }}
          />
        </div>
      </form>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example"
      >
        <h2 style={{ textAlign: 'center', width: '100%' }}>
          <FormattedMessage {...messages.deleteCourseConfirm} />
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            showLoader
            onClick={removeCourseHandle}
            style={{ fontSize: 13, padding: '15px 40px', margin: '0 5px' }}
          >
            <FormattedMessage {...messages.YES} />
          </Button>
          <Button
            showLoader
            onClick={closeModal}
            style={{
              fontSize: 13,
              padding: '15px 40px',
              backgroundColor: 'white',
              color: '#E5007D',
              margin: '0 5px',
            }}
          >
            <FormattedMessage {...messages.NO} />
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={modalSubmitOpen}
        onRequestClose={closeSubmitModal}
        style={customStyles}
        contentLabel="Example"
      >
        <h2 style={{ textAlign: 'center', width: '100%' }}>
          <FormattedMessage {...messages.submitCourseConfirm} />
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => handleCourseSubmit()}
            style={{ fontSize: 13, padding: '15px 40px', margin: '0 5px' }}
          >
            <FormattedMessage {...messages.YES} />
          </Button>
          <Button
            onClick={() => closeSubmitModal()}
            style={{
              fontSize: 13,
              padding: '15px 40px',
              backgroundColor: 'white',
              color: '#E5007D',
              margin: '0 5px',
            }}
          >
            <FormattedMessage {...messages.NO} />
          </Button>
        </div>
      </Modal>
    </ColumnWrapper>
  );
}

AddCourseSecondColumn.propTypes = {};

export default AddCourseSecondColumn;

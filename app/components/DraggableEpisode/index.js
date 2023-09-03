/**
 *
 * DraggableEpisode
 *
 */

import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import PencilIcon from '../../images/icons/pencil.svg';
import InputTextarea from '../InputTextarea';
import PdfIcon from '../../images/icons/pdf.svg';
import CancelIcon from '../../images/icons/cancel.svg';
import Input from '../Input';
import { BASE_URL } from '../../config/env';
import Button from '../Button';
import messages from '../messages';
import makeSelectDashboard from '../../containers/Dashboard/selectors';
import {
  getCourseAction,
  getEpisodeAction,
  removeMediaFromEpisodeAction,
} from '../../containers/Dashboard/actions';
import EpisodeVideoUploader from '../EpisodeVideoUploader/Loadable';
import EpisodeAttachments from '../EpisodeAttachments';

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 3px solid #00000025;
  padding: 10px 25px;
  background-color: white;
  @media screen and (max-width: 900px) {
    padding: 0;
  }
`;

const EditWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  background-color: white;
  @media screen and (max-width: 1367px) {
    flex-direction: column;
    align-items: center;
  }
`;
const TextInputsWrapper = styled.div`
  flex: 1;
  padding: 0 20px;
  width: 100%;
  @media screen and (max-width: 900px) {
    padding: 0;
  }
`;
const customStyles = {
  overlay: {
    zIndex: 999,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function DraggableEpisode({
  item,
  index,
  editItem,
  dashboard,
  addAttachment,
  removeAttachment,
  setLastAddedEpisodeId,
  removeItem,
  removeMedia,
  getEpisode,
  getCourse,
}) {
  const { id } = useParams();

  const [editOpened, setEditOpened] = useState(false);
  const [videoPreview, setVideoPreview] = useState();
  const [loading, setLoading] = useState(true);
  const [episodeData, setEpisodeData] = useState(item);
  const [isRemoveEpisodeModalOpen, setRemoveEpisodeModalOpen] = useState(false);
  const [numberOfRetries, setNumberOfRetries] = useState(5);

  useEffect(() => {
    getEpisodeData();
  }, [dashboard.courseData?.id, editOpened]);

  useEffect(() => {
    dashboard.lastAddedEpisodeId === item.id && openCreatedEpisode();
  }, [dashboard.lastAddedEpisodeId]);

  const getCourseData = () => {
    getCourse(id);
  };

  const getEpisodeData = () => {
    if (editOpened && dashboard.courseData?.id) {
      getEpisode({
        episodeId: item?.id,
        onSuccess: (data) => {
          data?.query && data?.mediaId && setVideoPreview(`${BASE_URL}${data?.query}`);
          setEpisodeData(data);
        },
        onFetchEnd: () => setLoading(false),
      });
    } else {
      setLoading(false);
    }
  };

  const onError = (err, mediaErr) => {
    console.log('Error occurred', err, mediaErr, numberOfRetries, numberOfRetries > 0);
    if (numberOfRetries > 0) {
      getEpisodeData();
      setNumberOfRetries(numberOfRetries - 1);
    }
  };

  const openCreatedEpisode = () => {
    setEditOpened(true);
    setLastAddedEpisodeId({ episodeId: null });
  };

  const onMediaRemove = ({ courseId, episodeId }) => removeMedia({ courseId, episodeId });

  const convertDurationToTime = (duration) => {
    let minutes = Math.floor(duration / 60);
    const seconds = duration - minutes * 60 > 0 ? Math.floor(duration - minutes * 60) : 0;
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      minutes -= hours * 60;
    }
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <InnerWrapper>
        <div style={{ cursor: 'pointer' }} onClick={() => setEditOpened(!editOpened)}>
          <p style={{ fontSize: 14, fontWeight: 'bold', marginBottom: '8px' }}>{item.title}</p>
          <p style={{ fontSize: 14 }}>
            <FormattedMessage {...messages.durationTime} />:{' '}
            {convertDurationToTime(item.length || 0)}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            onClick={() => setEditOpened(!editOpened)}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <img src={PencilIcon} alt="edit" />
          </div>
          <div
            style={{ display: 'flex', marginLeft: '10px', cursor: 'pointer' }}
            onClick={() => setRemoveEpisodeModalOpen(true)}
          >
            <img src={CancelIcon} alt="delete" style={{ width: '16px' }} />
          </div>
        </div>
      </InnerWrapper>
      {editOpened && (
        <EditWrapper>
          <EpisodeVideoUploader
            src={videoPreview}
            courseId={dashboard.currentCourseId}
            episode={episodeData}
            loading={loading}
            onUploadFinished={getEpisodeData}
            onMediaRemove={onMediaRemove}
            onOpenError={onError}
          />
          <TextInputsWrapper>
            <Input
              inputProps={{
                name: 'name',
                value: item.title,
                onChange: (e) => editItem(index, 'title', e.target.value),
              }}
              labelName={messages.episodeName}
              error=""
            />
            <InputTextarea
              inputProps={{
                value: item.description,
                onChange: (e) => editItem(index, 'description', e.target?.value),
              }}
              labelName={messages.Description}
              textareaStyle={{ maxHeight: '70px', minHeight: '170px' }}
            />
            <EpisodeAttachments
              courseId={dashboard.currentCourseId}
              episodeId={item.id}
              onAttachmentAdd={addAttachment}
              onAttachmentRemove={removeAttachment}
              attachments={item.attachments}
            />
          </TextInputsWrapper>
        </EditWrapper>
      )}
      <Modal
        isOpen={isRemoveEpisodeModalOpen}
        onRequestClose={() => setRemoveEpisodeModalOpen(false)}
        style={customStyles}
      >
        <h2 style={{ textAlign: 'center', width: '100%' }}>
          <FormattedMessage {...messages.deleteEpisodeConfirm} />
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={removeItem}
            style={{ fontSize: 13, padding: '15px 40px', margin: '0 5px' }}
          >
            <FormattedMessage {...messages.YES} />
          </Button>
          <Button
            onClick={() => setRemoveEpisodeModalOpen(false)}
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
    </div>
  );
}

DraggableEpisode.propTypes = {};

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getCourse: (courseId) => dispatch(getCourseAction({ courseId })),
    getEpisode: (episodeId) => dispatch(getEpisodeAction(episodeId)),
    removeMedia: (data) => dispatch(removeMediaFromEpisodeAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(DraggableEpisode);

/**
 *
 * EpisodeVideoUploader
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import * as tus from 'tus-js-client';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner';
import PlayIcon from '../../images/icons/play.svg';
import AudioIcon from '../../images/icons/audio.svg';
import messages from '../messages';
import Button from '../Button';
import { BASE_URL } from '../../config/env';
import { readFromStorage } from '../../utils/storage';
import { colors } from '../../utils/colors';
import AspectRatioContainer from '../AspectRatioContainer';
// import makeSelectAuth from '../../containers/Auth/selectors';

const FileInputWrapper = styled.div`
  max-width: 50%;
  position: relative;
  min-width: 300px;
  margin-bottom: 15px;
  @media screen and (max-width: 1367px) {
    max-width: 100%;
  }
  @media screen and (max-width: 600px) {
    min-width: 100%;
    max-width: 100%;
    height: fit-content;
  }
`;
const LoaderWrapper = styled.div`
  position: absolute;
  z-index: 9;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
`;
const FileInput = styled.div`
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  cursor: pointer;
  @media screen and (max-width: 600px) {
    padding: 20px 20px;
  }
`;
const VideoWrapper = styled(AspectRatioContainer)`
  width: 100%;
  max-width: 400px;
  position: relative;
  margin-bottom: 15px;
  overflow: hidden;
`;
const VideoProcessingWrapper = styled.div`
  background-color: black;
  padding: 10px 20px;
  height: 100%;
  width: 100%;
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${colors.white};
  text-align: center;
  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`;
const FileInputIconWrapper = styled.div`
  margin: 5px;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid #00000025;
  @media screen and (max-width: 400px) {
    width: 80px;
    height: 60px;
    border: none;
  }
`;
const FileInputIcon = styled.img``;

function EpisodeVideoUploader({
  src,
  courseId,
  episode,
  onUploadFinished,
  onUploadError = (err) => null,
  onMediaRemove,
  onOpenError,
  loading,
}) {
  const inputRef = useRef();

  const [videoPreview, setVideoPreview] = useState(src);
  const [isUploading, setUploading] = useState(false);
  const [uploadingPercent, setUploadingPercent] = useState();
  const [upload, setUpload] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    onSrcUpdate(src);
  }, [src]);

  const fileChange = (e) => {
    const file = e.target?.files[0];
    if (file) {
      // Create a new tus upload
      const uploadRef = new tus.Upload(file, {
        endpoint: `${BASE_URL}video`,
        chunkSize: 15 * 1024 * 1024,
        retryDelays: [0, 3000, 5000],
        uploadDataDuringCreation: true,
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        headers: {
          secret_token: readFromStorage('authToken'),
          course_id: courseId,
          lesson_id: episode.id,
          Authorization: `Bearer ${readFromStorage('authToken')}`,
        },
        onError(error) {
          console.log(`Failed because: ${error}`);
          console.log(error.target?.value);
          setUploading(false);
          setUploadingPercent(0);
          setUploadError(error);
          onUploadError(error);
        },
        onProgress(bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log('Progress', {
            bytesUploaded,
            bytesTotal,
            percentage: `${percentage}%`,
          });
          setUploading(true);
          setUploadingPercent(percentage);
        },
        onChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
          console.log('Chunk completed', {
            chunkSize,
            bytesAccepted,
            bytesTotal,
          });
        },
        onSuccess() {
          setUploading(false);
          setUploadingPercent(102);
          onUploadFinished();
          toast.success('Les modifications ont été enregistrées correctement');
        },
      });
      setUpload(uploadRef);
      // Start the upload
      uploadRef.start();
    }
  };

  const removeMediaHandler = async () => {
    upload ? upload?.abort() : onMediaRemove({ courseId, episodeId: episode.id });
    onSrcUpdate(null);
    setUploading(false);
  };

  const onSrcUpdate = (src) => {
    setVideoPreview(null);
    setTimeout(() => setVideoPreview(src), 200);
  };

  const shouldShowOverlay = isUploading;

  const renderOverlayInfo = (state) => {
    if (isUploading) {
      return (
        <Overlay>
          <FormattedMessage {...messages.uploading} />: {uploadingPercent}%
        </Overlay>
      );
    }
    /**
     * State is enum
     * 0 - BEFORE_UPLOAD
     * 1 - UPLOADED
     * 2 - BEFORE_CONVERSION
     * 3 - CONVERTED
     * 4 - ERROR_WITH_CONVERSION
     */
    switch (state) {
      case 0:
      case 3:
        return;
      case 1:
      case 2:
        return (
          <Overlay>
            <FormattedMessage {...messages.videoIsBeingConverted} />
          </Overlay>
        );
      case 4:
        return (
          <Overlay>
            <FormattedMessage {...messages.videoConversionFailed} />
          </Overlay>
        );
      default:
    }
  };

  const Overlay = ({ children }) => <VideoProcessingWrapper>{children}</VideoProcessingWrapper>;

  return (
    <FileInputWrapper>
      {loading && (
        <LoaderWrapper>
          <Loader type="Oval" color="white" height={35} width={25} />
        </LoaderWrapper>
      )}
      <VideoWrapper heightRatio={0.5625}>
        {!videoPreview && !shouldShowOverlay && (
          <FileInput onClick={() => inputRef?.current?.click()}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FileInputIconWrapper>
                <FileInputIcon src={PlayIcon} alt="play icon" />
              </FileInputIconWrapper>
              <FileInputIconWrapper>
                <FileInputIcon src={AudioIcon} alt="audio icon" />
              </FileInputIconWrapper>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: '#00000025',
                textAlign: 'center',
              }}
            >
              <FormattedMessage {...messages.addAudioVideo} />
            </p>
            <input
              type="file"
              accept="video/mp4,video/x-m4v,video/avi,video/*,audio/mp3,audio/mpeg,audio/mp4,audio/x-m4a"
              onChange={fileChange}
              style={{ display: 'none' }}
              ref={inputRef}
            />
          </FileInput>
        )}
        {renderOverlayInfo(episode?.episodeState)}
        {videoPreview && (
          <video controls style={{ width: '100%' }} src={videoPreview} onError={onOpenError} />
        )}
      </VideoWrapper>

      {(videoPreview || shouldShowOverlay) && (
        <Button color="pink" onClick={removeMediaHandler}>
          <FormattedMessage {...messages.remove} />
        </Button>
      )}
    </FileInputWrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  // auth: makeSelectAuth()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(EpisodeVideoUploader);

/**
 *
 * FileInput
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Loader from 'react-loader-spinner';
import { colors } from '../../utils/colors';
import CoreButton from '../Button';
import messages from '../messages';
import { BASE_URL } from '../../config/env';
import Image from '../Image';
import { StyledInputBody, StyledLabel } from '../sharedStyles';
import Modal from '../Modal';
import useWindowSize from '../../hooks/useWindowSize';
import AspectRatioContainer from '../AspectRatioContainer';
import AddImageImg from '../../images/icons/addImage.svg';
const DeleteIcon = require('../../images/icons/cancel--white.svg');

const Wrapper = styled(AspectRatioContainer)`
  margin-bottom: 15px;
  background: ${(props) => (props.dark ? colors.backgroundDarkBlue : colors.white)} !important;
  ${(props) => props.style};
`;
const LoaderWrapper = styled.div`
  position: absolute;
  z-index: 9;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
`;
const Label = styled(StyledLabel)`
  color: ${(props) => (props.dark ? colors.white : colors.black)} !important;
`;
const DeleteImageButton = styled.div`
  position: absolute;
  z-index: 3;
  left: ${(props) => props.fullscreen && '10px'};
  right: ${(props) => !props.fullscreen && '10px'};
  top: 10px;
  width: 20px;
  height: auto;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: all 0.5s ease-in-out;
  mix-blend-mode: difference;
  cursor: pointer;
`;
const DropArea = styled(StyledInputBody)`
  position: relative;
  overflow: hidden;
  border: 1px solid ${(props) => (props.dark ? colors.backgroundDarkBlue : '#00000030')};
  width: 100%;
  height: 100%;
  background: ${(props) => (props.dark ? colors.backgroundDarkBlue : colors.white)} !important;
  ${(props) => props.style};
`;

const DeleteImageIcon = styled(Image)`
  width: 100%;
  height: 100%;
`;
const PreviewImage = styled(Image)`
  width: 100%;
  position: absolute;
  object-fit: cover;
  height: auto;
  background: white;
`;
const Button = styled(CoreButton)`
  margin-bottom: 5px;
  background-color: ${(props) => (props.dark ? colors.mainGold : colors.mainPink)} !important;
  border: 1px solid ${(props) => (props.dark ? colors.mainGold : colors.mainPink)} !important;
  color: ${(props) => (!props.dark ? colors.white : colors.black)} !important;
  font-size: 10px;
  padding: 10px 20px;
  font-weight: 500;
`;
const Text = styled.p`
  margin-bottom: 5px;
  font-size: 10px;
  color: ${(props) => (props.dark ? colors.white : colors.black)} !important;
`;
const DimmedText = styled(Text)`
  opacity: 0.25;
`;
const CustomNoImageWrapper = styled.div`
  cursor: pointer;
`;
const CropperWrapper = styled.div`
  .box {
    display: inline-block;
    padding: 10px;
    box-sizing: border-box;
  }
  .img-preview {
    overflow: hidden;
  }
`;
export const modalStyles = ({ width, dark }) => ({
  overlay: {
    backgroundColor: dark ? `${colors.backgroundDarkBlue}E6` : `${colors.black}E6`,
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: dark
      ? 'linear-gradient(135deg, #1B2134 0%, #121621 100%)'
      : `linear-gradient(135deg, ${colors.white} 0%, ${colors.white} 100%)`,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: 24,
    width: 675,
    maxWidth: '100%',
  },
  headerTitle: {
    // fontSize: '43px',
    fontWeight: 800,
  },
});

function FileInput({
  label,
  children,
  fileInfoText,
  wrapperStyle,
  dropAreaStyle,
  imageStyle,
  aspectRatio = 1 / 0.52,
  dark = true,
  onInput = () => null,
  loading: loadingProp,
  imagePreview: image,
  useCropper = false,
  deleteImageButtonStyle,
}) {
  const { width } = useWindowSize();
  const inputRef = useRef();
  const [imagePreview, setImagePreview] = useState(image?.length > 7 && BASE_URL + image);
  const [deleteImageButtonShown, setDeleteImageButtonShown] = useState(false);
  const [cropperInstance, setCropperInstance] = useState(null);
  const [cropperOpened, setCropperOpened] = useState(false);
  const [notCroppedImg, setNotCroppedImg] = useState(null);
  const [imgExtension, setImgExtension] = useState(null);
  // const [wrapperWidth, setWrapperWidth] = useState(300)
  const [loading, setLoading] = useState(false);

  // useEffect(()=> {
  //
  // }, [wrapper.current?.offsetWidth])

  useEffect(() => {
    inputRef.current.addEventListener('change', onFileInput);
    console.log('Dark', dark);
  }, []);

  useEffect(() => {
    setImagePreview(image);
  }, [image]);

  const onFileInput = (event) => {
    let file;
    switch (event?.type) {
      case 'drop':
        file = event.dataTransfer.files[0];
        break;
      case 'change':
        file = event.target.files[0];
        break;
    }
    console.log('Input file', file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (useCropper) {
          setNotCroppedImg(reader.result);
          const fileNameArr = file.name.split('.');
          const extension = fileNameArr.pop();
          setImgExtension(extension);
          openCropper();
        } else {
          returnImage(stripBase64(reader.result));
        }
      };
    }
  };

  const setPreview = (src) => {
    setImagePreview(null);
    setTimeout(() => setImagePreview(src), 500);
  };

  const stripBase64 = (string) => string.split('base64,')[1];

  const returnImage = (image) => {
    onInput(image);
  };

  const removeImage = () => {
    setPreview(null);
    setDeleteImageButtonShown(false);
  };

  const onCrop = () => {
    if (typeof cropperInstance !== 'undefined') {
      const imgDataURL = cropperInstance.getCroppedCanvas().toDataURL(`image/${imgExtension}`, 0.3);
      setPreview(imgDataURL);
      returnImage(stripBase64(imgDataURL));
      closeCropper();
    }
  };

  const openCropper = () => {
    console.log('Cropper closed, opening', cropperOpened);
    setCropperOpened(true);
  };

  const closeCropper = () => {
    console.log('Cropper opened, closing', cropperOpened);
    setCropperOpened(false);
  };

  return (
    <Wrapper style={wrapperStyle} dark={dark}>
      {loadingProp && (
        <LoaderWrapper>
          <Loader type="Oval" color="white" height={35} width={25} />
        </LoaderWrapper>
      )}
      {!!label && <Label dark={dark}>{label}</Label>}
      <DropArea
        ratio={aspectRatio}
        style={dropAreaStyle}
        dark={dark}
        onDrop={(ev) => {
          ev.preventDefault();
          onFileInput(ev);
        }}
        onDragOver={(ev) => ev.preventDefault()}
      >
        <DeleteImageButton
          dark={dark}
          style={deleteImageButtonStyle}
          visible={deleteImageButtonShown}
          onMouseEnter={() => setDeleteImageButtonShown(true)}
          onClick={removeImage}
        >
          <DeleteImageIcon src={DeleteIcon} />
        </DeleteImageButton>
        {!!imagePreview && (
          <PreviewImage
            style={imageStyle}
            onMouseEnter={() => setDeleteImageButtonShown(true)}
            onMouseLeave={() => setDeleteImageButtonShown(false)}
            src={imagePreview}
          />
        )}
        {!imagePreview &&
          (children ? (
            <CustomNoImageWrapper onClick={() => inputRef.current.click()}>
              {children}
            </CustomNoImageWrapper>
          ) : (
            // <>
            //   <Text dark={dark}>
            //     <FormattedMessage {...messages.dragNDropHere} />
            //   </Text>
            //   <Text dark={dark}>
            //     <FormattedMessage {...messages.or} />
            //   </Text>
            //   <Button dark={dark} onClick={() => inputRef.current.click()}>
            //     <FormattedMessage {...messages.chooseFromDisc} />
            //   </Button>
            //   <DimmedText dark={dark}>
            //     {fileInfoText || (
            //       <FormattedMessage {...messages.eventCoverPhotoInfo} />
            //     )}
            //   </DimmedText>
            // </>
            <CustomNoImageWrapper onClick={() => inputRef.current.click()}>
              <img src={AddImageImg} />
            </CustomNoImageWrapper>
          ))}
        <input type="file" ref={inputRef} style={{ display: 'none' }} accept="image/*" />
      </DropArea>
      <Modal
        ariaHideApp={false}
        isOpened={cropperOpened}
        style={modalStyles({ width, dark })}
        onClose={closeCropper}
        overlayClassName="transition"
        backButtonHidden
      >
        <CropperWrapper dark={dark}>
          <Cropper
            style={{ height: 350, width: '100%' }}
            initialAspectRatio={1}
            preview=".img-preview"
            src={notCroppedImg}
            viewMode={1}
            minCropBoxHeight={200}
            minCropBoxWidth={200}
            aspectRatio={aspectRatio || 1 / 0.52}
            background={false}
            responsive
            guides
            autoCropArea={1}
            modal={false}
            checkOrientation // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => setCropperInstance(instance)}
          />
          <CoreButton
            style={{
              width: 'fit-content',
              margin: '10px auto',
            }}
            onClick={onCrop}
            color="pink"
          >
            Sauvegarder
          </CoreButton>
        </CropperWrapper>
      </Modal>
    </Wrapper>
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

export default compose(withConnect)(FileInput);

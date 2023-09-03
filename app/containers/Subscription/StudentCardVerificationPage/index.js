/**
 *
 * StudentVerificationPage
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import messages from '../messages';
import { uploadStudentCardAction } from '../actions';
import makeSelectSubscription from '../selectors';
import Button from '../../../components/Button';
import UploadImage from '../../../images/icons/upload.svg';
import makeSelectAuth from '../../Auth/selectors';
import { ModalInnerWrapper, ModalSubtitle, ModalTitle } from '../../../components/Modal';
import history from '../../../utils/history';
import { colors } from '../../../utils/colors';

export const InnerWrapper = styled(ModalInnerWrapper)`
  max-width: 575px;
`;
const Header = styled(ModalTitle)``;
const SubHeader = styled(ModalSubtitle)`
  margin-bottom: 30px;
`;
const InputsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 45px;
  @media screen and (max-width: 615px) {
    flex-direction: column;
    justify-content: unset;
    align-items: center;
  }
`;
const CardInput = styled.div`
  width: 100%;
  max-width: 275px;
  height: 180px;
  background-position: center center;
  background-color: #707070;
  margin: 20px 5px;
  border-radius: 10px;
  color: ${colors.white};
  font-size: 10px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
  opacity: ${(props) => (props.isPreview ? 1 : 0.5)};
  text-align: center;
  @media screen and (max-width: 460px) {
    max-width: 250px;
  }
`;
const UploadWrapper = styled.div`
  width: 50px;
  height: 50px;
  margin: 0 auto 20px auto;
  overflow: hidden;
  display: ${(props) => (props.isPreview ? 'none' : 'block')};
`;
const UploadImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const StyledButton = styled(Button)`
  width: 100%;
  max-width: 180px;
  margin-bottom: 15px;
`;
export function StudentCardVerificationPage({ subscription, uploadStudentCard }) {
  const input1Ref = useRef();
  const input2Ref = useRef();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageBase64s, setImageBase64s] = useState([]);

  useEffect(() => {
    input1Ref?.current?.addEventListener('change', (ev) =>
      onFileInput(ev.target.files[0], 0, imagePreviews, imageBase64s),
    );
    input2Ref?.current?.addEventListener('change', (ev) =>
      onFileInput(ev.target.files[0], 1, imagePreviews, imageBase64s),
    );
  }, []);

  const onFileInput = (inputFile, targetIndex, previews, base64s) => {
    if (inputFile) {
      // convert image to url for showing to the user locally
      previews[targetIndex] = URL.createObjectURL(inputFile);
      setImagePreviews(JSON.parse(JSON.stringify(previews)));

      // convert image to base64 for sending to BE
      const reader = new FileReader();
      reader.readAsDataURL(inputFile);
      reader.onload = function () {
        base64s[targetIndex] = reader.result.split(',')[1];
        setImageBase64s(JSON.parse(JSON.stringify(base64s)));
      };
    }
  };

  const uploadImage = () => {
    uploadStudentCard({
      data: imageBase64s.map((item) => ({ imgBase64: item })),
      subscriptionId: subscription.currentSubscription?.id,
    });
  };

  return (
    <InnerWrapper>
      <Header>
        <FormattedMessage {...messages.studentVerificationHeader} />
      </Header>
      <SubHeader>
        <FormattedMessage {...messages.billingChoiceSubHeader} />
      </SubHeader>
      <InputsWrapper>
        <CardInput isPreview={!!imagePreviews[0]} onClick={() => input1Ref.current.click()}>
          {!imagePreviews[0] ? (
            <UploadWrapper isPreview={!!imagePreviews[0]}>
              <UploadImg src={UploadImage} />
            </UploadWrapper>
          ) : (
            <UploadImg src={imagePreviews[0]} />
          )}
          {!imagePreviews[0] &&
            'Please upload a front side of a valid student card. Admin will verify it as soon as possible'}
        </CardInput>
        <input type="file" ref={input1Ref} style={{ display: 'none' }} />
        <CardInput isPreview={!!imagePreviews[1]} onClick={() => input2Ref.current.click()}>
          {!imagePreviews[1] ? (
            <UploadWrapper isPreview={!!imagePreviews[1]}>
              <UploadImg src={UploadImage} />
            </UploadWrapper>
          ) : (
            <UploadImg src={imagePreviews[1]} />
          )}
          {!imagePreviews[1] &&
            'Please upload a rear side of a valid student card. Admin will verify it as soon as possible'}
        </CardInput>
        <input type="file" ref={input2Ref} style={{ display: 'none' }} />
      </InputsWrapper>
      <ButtonsWrapper>
        <StyledButton
          color="green"
          disabled={!imagePreviews[0] || !imagePreviews[1]}
          showLoader
          onClick={uploadImage}
        >
          Validate
        </StyledButton>
        <StyledButton color="green" outline disableOnFetch onClick={() => history.goBack()}>
          Back
        </StyledButton>
      </ButtonsWrapper>
    </InnerWrapper>
  );
}

StudentCardVerificationPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subscription: makeSelectSubscription(),
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    uploadStudentCard: (data) => dispatch(uploadStudentCardAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(StudentCardVerificationPage);

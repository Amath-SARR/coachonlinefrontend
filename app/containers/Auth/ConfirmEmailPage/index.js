/**
 *
 * ConfirmEmailPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import MessagesImage from '../../../images/icons/message.svg';
import Button from '../../../components/Button';
import makeSelectAuth from '../selectors';
import { createAccountAction } from '../actions';
import messages from '../../../components/messages';
import { colors } from '../../../utils/colors';
import useWindowSize from '../../../hooks/useWindowSize';
import history from '../../../utils/history';
import { authModalStyles, InnerWrapper } from '../index';
import Modal, { ModalHeaderDescription, ModalHeaderTitle } from '../../../components/Modal';
import Image from '../../../components/Image';

const Wrapper = styled(InnerWrapper)`
  justify-content: center;
  height: 100%;
`;

const ImageWrapper = styled.div`
  width: 86px;
  height: 86px;
  margin: 30px auto;
`;

const InfoText = styled.p`
  font-size: 18px;
  color: ${colors.white};
  margin-bottom: 40px;
`;

export function ConfirmEmailPage({ createAccount, auth }) {
  const { width } = useWindowSize();
  const location = useLocation();
  const { accountType } = useParams();
  const [opened, setOpened] = useState(false);

  const isCoach = accountType === 'coach';

  useEffect(() => {
    setOpened(true);
    console.log(location);
  }, []);

  const closeModal = () => {
    setOpened(false);
    setTimeout(() => () => history.replace(location?.state?.background?.pathname || '/'), 100);
  };

  const modalStyle = authModalStyles(width);
  return (
    // <Modal
    //   ariaHideApp={false}
    //   isOpened={opened}
    //   style={modalStyle}
    //   onClose={closeModal}
    //   overlayClassName="transition"
    //   withHeader
    //   backButtonHidden
    //   headerTitle={<FormattedMessage {...messages.registrationDone} />}
    // >
    <Wrapper>
      <ModalHeaderTitle>
        <FormattedMessage {...messages.registrationDone} />
      </ModalHeaderTitle>
      <ImageWrapper>
        <Image src={MessagesImage} alt="Messages icon" />
      </ImageWrapper>
      <InfoText>
        <FormattedMessage {...messages.registrationDoneText} />
      </InfoText>
      <Button
        color={isCoach ? 'pink' : 'green'}
        style={{ padding: '15px 40px', fontSize: 13 }}
        onClick={() =>
          history.replace('/auth/login', {
            background: location?.state?.background,
          })
        }
      >
        <FormattedMessage {...messages.loginButton} />
      </Button>
    </Wrapper>
  );
}

ConfirmEmailPage.propTypes = {
  dispatch: PropTypes.func,
  createAccount: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    createAccount: (data) => dispatch(createAccountAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ConfirmEmailPage);

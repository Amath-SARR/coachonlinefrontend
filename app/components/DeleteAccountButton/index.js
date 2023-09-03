/**
 *
 * DeleteAccountButton
 *
 */

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { useLocation } from 'react-router-dom';
import makeSelectAuth from '../../containers/Auth/selectors';
import messages from '../messages';
import { colors } from '../../utils/colors';
import { deleteAccountAction, logoutAction } from '../../containers/Auth/actions';
import history from '../../utils/history';
import Image from '../Image';

const Wrapper = styled.div`
  font-size: 14px;
  padding: 20px;
  font-weight: 500;
  cursor: pointer;
  color: ${colors.black};
`;

const ButtonLabel = styled.div`
  opacity: 0.45;
  color: ${colors.black};
`;

function DeleteAccountButton({
  className,
  label = messages.deleteAccount,
  onDelete,
  deleteAccount,
  children,
  logout,
  style,
  labelStyle,
  color = 'white',
}) {
  const textRef = useRef();
  const location = useLocation();
  const [clicked, setClicked] = useState();

  const onAccountDelete = () => {
    if (onDelete) {
      return onDelete();
    }
    deleteAccount({
      onSuccess: () => {
        logout();
        history.replace('/');
      },
    });
  };

  const onClick = () => {
    if (clicked) {
      return onAccountDelete();
    }
    setClicked(true);
  };

  return (
    <Wrapper className={className} style={style}>
      <ButtonLabel
        onClick={onClick}
        style={labelStyle}
        ref={textRef}
        data-for="deleteWarning"
        data-tip="WARNING! <br> You are about to delete your account. <br> Click again to confirm"
        data-event="click"
        data-iscapture
        data-type="warning"
        data-clickable
      >
        {!!label && <FormattedMessage {...label} />}
        {children}
      </ButtonLabel>
      <ReactTooltip
        id="deleteWarning"
        place="bottom"
        multiline
        afterHide={() => setClicked(false)}
      />
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    deleteAccount: ({ onSuccess }) => dispatch(deleteAccountAction({ onSuccess })),
    logout: () => dispatch(logoutAction()),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(DeleteAccountButton);

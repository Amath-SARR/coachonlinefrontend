/**
 *
 * GoogleButton
 *
 */

import React from 'react';
import GoogleButtonProps from './google-button.props';
import styled from 'styled-components';
import { FlexRow, Text } from '../../global-styles';
import Button from '../Button';
import GoogleImg from '../../images/icons/google.svg';
import { API_URL, APPLICATION_URL } from '../../config/env';
import { GoogleActionType } from '../../containers/Auth/reducer.types';

const Wrapper = styled.div``;
const ButtonBody = styled(FlexRow)`
  align-items: center;
`;
const Label = styled(Text)``;
const IconWrapper = styled.div`
  width: 17px;
  margin-right: 10px;
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
`;
const Link = styled.a``;

function GoogleButton(props: GoogleButtonProps) {
  const {
    actionType,
    link,
    redirectUrl = APPLICATION_URL,
    disabled,
    label: buttonLabel,
    onClick,
  } = props;

  const externalLink =
    link ||
    `${API_URL}/Authentication/google/challange?redirectUrl=${redirectUrl}&callType=${actionType}`;

  const resolveLabel = () => {
    if (buttonLabel) {
      return buttonLabel;
    }
    switch (actionType) {
      case GoogleActionType.register:
        return "S'inscrire sur Google";
      case GoogleActionType.login:
        return 'Connectez-vous avec Google';
    }
  };

  const label = resolveLabel();

  return (
    <Wrapper>
      <Button
        as={Link}
        onClick={onClick}
        href={externalLink}
        color={'green'}
        outline
        disabled={disabled}
      >
        <ButtonBody>
          <IconWrapper>
            <Icon src={GoogleImg} />
          </IconWrapper>
        </ButtonBody>
        <Label>{label}</Label>
      </Button>
    </Wrapper>
  );
}

export default GoogleButton;

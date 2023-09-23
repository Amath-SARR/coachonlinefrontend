/**
 *
 * Input
 *
 */

import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
// import ReactTooltip from 'react-tooltip';
import EyeIcon from '../../images/icons/eye.svg';
import CrossedEyeIcon from '../../images/icons/eye-crossed.svg';
import { colors } from '../../utils/colors';
// import Image from '../Image';
import Label from '../Label';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  position: relative;
  min-width: 300px;
  max-width: 100%;
  align-items: ${(props) => (props?.style?.flexDirection === 'row' ? 'center' : 'flex-start')};
  @media screen and (max-width: 1024px) {
    min-width: unset;
  }
`;
const LabelStyled = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: ${colors.lilac};
  text-transform: capitalize;
`;
const StyledInput = styled.input`
  width: 100%;
  //border: 1px solid ${colors.lilac};
  background-color: white;
  color: ${(props) => (props.isDark ? colors.white : colors.black)};
  opacity: ${({ readOnly }) => (readOnly ? 0.7 : 1)};
  //padding: 17px 20px;
  //padding-right: 35px;
  //border-radius: 5px;
  outline: none;
`;
const TextInput = styled.input`
  width: 100%;
  flex: 1;
  font-size: 14px;
  padding: 12px 20px;
  margin: 8px;
  box-sizing: border-box;
  border: 1px solid var(--dark-grey-50, #c5c5c9);
  border-radius: 24px;
  background-color: ${colors.white};
  //border: 1px solid ${colors.lilac};
  color: ${colors.lilac};
  cursor: ${(props) => (props.readOnly ? 'default' : 'text')};
  padding: 10px 10px;
  outline: none;
  //border: none;
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    font-size: 14px;
    background-color: ${colors.white} !important;
    color: ${colors.lilac} !important;
    border: unset;
    -webkit-text-fill-color: ${colors.lilac};
    -webkit-box-shadow: 0 0 0 1000px ${colors.white} inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;
//${(props) =>
//props.isDark ? colors.secondaryBackgroundDark : colors.secondaryBackgroundLight};
const SecuredIconDiv = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 15px;
  bottom: 50%;
  cursor: pointer;
  transform: translateY(50%);
`;
const SecuredIconImg = styled.img`
  width: 100%;
  height: auto;
  filter: ${(props) => (props.isDark ? 'invert()' : '')};
`;
const Error = styled.p`
  font-size: 14px;
  color: red;
  margin-top: 5px;
`;

function Input({
  inputProps,
  // inputStyle,
  labelName,
  placeholder,
  label,
  error,
  errors,
  type,
  secured,
  alignment = 'column',
  colorScheme = 'light',
  style = {},
  redesigned = false,
  labelStyle = {},
}) {
  const [isSecured, setSecured] = useState(secured);

  const convertedError = !!error && `${error[0].toUpperCase()}${error.slice(1).replace('_', ' ')}`;
  const isDark = colorScheme === 'dark';

  return redesigned ? (
    <Wrapper style={{ ...style, flexDirection: alignment }}>
      {(!!labelName || !!label) && (
        <Label
          labelName={labelName}
          label={label}
          showIcon={!!errors?.length || error}
          tooltipData={errors?.map((err, i) => `${i + 1}. ${err}`) || error}
          dataType={'warning'}
          extraData={[errors?.length, error]}
          style={{
            marginRight: 10,
            paddingLeft: alignment === 'row' ? 0 : 10,
            wordBreak: 'break-word',
            flex: 0.4,
            minWidth: 50,
            ...labelStyle,
          }}
        />
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <TextInput
          type={!isSecured ? 'text' : type}
          readOnly={inputProps.readOnly}
          style={inputProps.style}
          placeholder={placeholder}
          {...inputProps}
        />
        {secured && (
          <SecuredIconDiv onClick={() => setSecured(!isSecured)}>
            <SecuredIconImg src={isSecured ? CrossedEyeIcon : EyeIcon} />
          </SecuredIconDiv>
        )}
      </div>
    </Wrapper>
  ) : (
    <Wrapper style={{ ...style, flexDirection: alignment }}>
      {!!labelName && (
        <LabelStyled>
          <FormattedMessage {...labelName} />
        </LabelStyled>
      )}
      <StyledInput
        isDark={isDark}
        type={!isSecured ? 'text' : type}
        readOnly={inputProps.readOnly}
        {...inputProps}
      />
      {secured && (
        <SecuredIconDiv onClick={() => setSecured(!isSecured)}>
          <SecuredIconImg isDark={isDark} src={isSecured ? CrossedEyeIcon : EyeIcon} />
        </SecuredIconDiv>
      )}
      {!!error && <Error>{convertedError}</Error>}
    </Wrapper>
  );
}

Input.propTypes = {};

export default Input;

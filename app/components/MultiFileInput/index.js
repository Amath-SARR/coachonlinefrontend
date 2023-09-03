/**
 *
 * MultiFileInput
 *
 */

import React, { useRef } from 'react';
import styled from 'styled-components';
import { StyledInputBody, StyledLabel, StyledWrapper } from '../sharedStyles';
import Button from '../Button';
import { colors } from '../../utils/colors';
import FileInput from '../FileInput';

const InputWrapper = styled.div`
  background-color: transparent;
  border: 1px solid ${colors.white};
  border-radius: 5px;
  overflow: hidden;
  height: 30px;
  max-width: 125px;
  width: 100%;
  padding: 0;
  color: ${colors.white};
`;

const InputBody = styled(StyledInputBody)`
  flex-direction: row;
`;

function MultiFileInput({ label, maxFiles = 3 }) {
  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < maxFiles; i++) {
      inputs.push(
        <InputWrapper key={i}>
          <FileInput
            deleteImageButtonStyle={{
              width: '10px',
              height: '10px',
              top: '2px',
              right: '5px',
            }}
            dropAreaStyle={{
              minHeight: 'unset',
              padding: '5px',
              cursor: 'pointer',
            }}
          >
            +
          </FileInput>
        </InputWrapper>,
      );
    }
    return inputs;
  };

  return (
    <StyledWrapper>
      <StyledLabel>{label}</StyledLabel>
      <InputBody>{renderInputs()}</InputBody>
    </StyledWrapper>
  );
}

export default MultiFileInput;

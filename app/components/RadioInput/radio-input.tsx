/**
 *
 * RadioButton
 *
 */

import React, { useState } from 'react';
import RadioInputProps, { RadioInputOption } from './radio-input.props';
import styled from 'styled-components';
import { colors } from '../../utils/colors';

interface WrapperProps {
  direction: 'row' | 'column';
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: ${(props: WrapperProps) => props.direction};
`;

const OptionWrapper = styled.div`
  display: flex;
  cursor: pointer;
  margin: 0 10px 10px 0;
  align-items: center;
`;
interface InputProps {
  accent: string;
  checked: boolean;
}
const OptionInput = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin-right: 5px;
  border: 2px solid ${(props: InputProps) => props.accent};
  background-color: ${(props: InputProps) => (props.checked ? props.accent : 'transparent')};
`;
const OptionLabel = styled.div`
  color: ${colors.black};
`;

function RadioInput(props: RadioInputProps) {
  const {
    options,
    defaultOption = options[0],
    accent = colors.mainGreen,
    direction = 'column',
    onChange = () => null,
  } = props;
  const [selected, setSelected] = useState(defaultOption);

  const onSelect = (option: RadioInputOption) => {
    setSelected(option);
    onChange(option);
  };

  return (
    <Wrapper direction={direction}>
      {options?.map((option) => (
        <OptionWrapper key={option.id} onClick={() => onSelect(option)}>
          <OptionInput checked={option.id === selected.id} accent={accent} />
          <OptionLabel>{option.label}</OptionLabel>
        </OptionWrapper>
      ))}
    </Wrapper>
  );
}

export default RadioInput;

/**
 *
 * IncrementableInput
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { StyledInputBody, StyledLabel, StyledWrapper } from '../sharedStyles';
import Image from '../Image';

const Wrapper = styled(StyledWrapper)``;
const Label = styled(StyledLabel)``;
const Box = styled.div`
  border: 1px solid ${colors.white};
  border-radius: 10px;
  padding: 10px;
  min-width: 119px;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${props => props.style};
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const InputBody = styled(StyledInputBody)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`;
const Icon = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;
const Text = styled.p`
  color: ${colors.white};
  font-size: 10px;
`;
const Value = styled(Text)`
  font-size: 28px;
`;
const Input = styled.input`
  background: transparent;
  border: 1px solid white;
  border-radius: 5px;
  outline: none;
  box-shadow: none;
  font-size: 12px;
  color: ${colors.white};
  padding: 5px;
  width: 60px;
  margin-right: 10px;
  text-align: center;
`;
const IncrementButtons = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid white;
  border-radius: 5px;
  font-size: 12px;
  overflow: hidden;
`;
const IncreaseButton = styled.div`
  border-right: 1px solid ${colors.white};
  padding: 5px;
  width: 26px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: ${colors.mainOrange};
  }
`;
const DecreaseButton = styled(IncreaseButton)`
  border-right: none;
`;

function IncrementableInput({
  icon,
  units,
  value: currentValue = 0,
  onChange,
  label,
  boxStyle,
}) {
  const [value, setValue] = useState(currentValue);
  const [maskedValue, setMaskedValue] = useState(
    `${units || ''}${currentValue}`,
  );

  useEffect(() => {
    value !== currentValue && setValue(currentValue);
    value !== currentValue && setMaskedValue(`${units || ''}${currentValue}`);
  }, [currentValue]);

  const onValueChange = value => {
    const MIN = 0;
    const MAX = 9999;
    const arrayFromString = value.toString()?.split(' ');
    const rawValue = Number(
      arrayFromString[0] === units
        ? arrayFromString[1]
        : arrayFromString[0] || arrayFromString[1],
    );
    const regexp = /^[0-9]*$/;
    if (
      rawValue.toString().match(regexp) &&
      rawValue >= MIN &&
      rawValue <= MAX
    ) {
      setValue(rawValue);
      setMaskedValue(`${units || ''}${rawValue}`);
      onChange && onChange(rawValue);
    }
  };

  const renderEditableState = () => (
    <>
      <Label>{label}</Label>
      <InputBody>
        <Icon>{!!icon && <Image src={icon} />}</Icon>
        <Input
          value={maskedValue}
          onChange={ev => onValueChange(ev.target.value)}
        />
        <IncrementButtons>
          <IncreaseButton onClick={() => onValueChange(Number(value) + 1)}>
            +
          </IncreaseButton>
          <DecreaseButton onClick={() => onValueChange(Number(value) - 1)}>
            -
          </DecreaseButton>
        </IncrementButtons>
      </InputBody>
    </>
  );
  const renderDisplayableState = () => (
    <Box style={boxStyle}>
      <Row>
        <Icon>{!!icon && <Image src={icon} />}</Icon>
        <Value>{maskedValue}</Value>
      </Row>
      <Text>{label}</Text>
    </Box>
  );
  return (
    <Wrapper>
      {onChange ? renderEditableState() : renderDisplayableState()}
    </Wrapper>
  );
}

export default IncrementableInput;

/**
 *
 * CheckBox
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
`;
const CheckBoxLabel = styled.p`
  color: ${colors.lilac};
  font-size: 12px;
  font-weight: 400;
  padding-top: 5px;
`;

interface CheckBoxProps {
  checked?: boolean;
  readOnly?: boolean;
  accent?: string;
  dark?: boolean;
}
const StyledCheckBox = styled.div`
  height: 14px;
  width: 14px;
  min-width: 14px;
  border-radius: 4px;
  border: 1px solid
    ${(props: CheckBoxProps) => (props.checked ? colors.mainGreen : colors.lilac)};
  cursor: ${(props: CheckBoxProps) => (props.readOnly ? 'not-allowed' : 'pointer')};
  background: ${(props: { checked: boolean }) => (props.checked ? props.accent : 'transparent')};
  margin-right: 5px;
`;

function CheckBox(props: {
  label: string | React.Component;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  checkboxStyle?: React.CSSProperties;
  dark?: boolean;
}) {
  const {
    label,
    checked: isChecked,
    onChange: onChangeProp,
    readOnly,
    style,
    accent = colors.mainGreen,
    labelStyle,
    checkboxStyle,
    dark = true,
  } = props;
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    checked !== isChecked && setChecked(isChecked);
  }, [isChecked]);

  const onChange = () => {
    if (!readOnly) {
      setChecked(!checked);
      onChangeProp(!checked);
    }
  };

  return (
    <CheckBoxWrapper style={style}>
      <StyledCheckBox
        accent={accent}
        readOnly={readOnly}
        checked={checked}
        onClick={onChange}
        style={checkboxStyle}
        dark={dark}
      />
      <CheckBoxLabel style={labelStyle}>{label}</CheckBoxLabel>
    </CheckBoxWrapper>
  );
}

export default CheckBox;

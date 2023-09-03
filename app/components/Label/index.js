/**
 *
 * Label
 *
 */

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { colors } from '../../utils/colors';
import Image from '../Image';

const WarningIcon = require('../../images/icons/warning.svg');

const TextInputLabel = styled.label`
  display: flex;
  font-size: 14px;
  font-weight: normal;
  flex-direction: column;
  margin-bottom: 5px;
  color: ${colors.lilac};
  padding-left: 10px;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'unset')};
`;
const WarningIconContainer = styled.div`
  //margin-left: 5px;
  //width: 15px;
  //height: 15px;
  //filter: invert(0.5);
`;
const Error = styled.p`
  color: goldenrod;
  padding: 5px 0;
`;

function Label({
  labelName: labelTx,
  label,
  icon = WarningIcon,
  showIcon,
  tooltipData,
  dataType = '',
  position = 'right',
  extraData = [],
  onClick,
  className,
  dark = true,
  style,
}) {
  const warningRef = useRef();

  // useEffect(() => {
  //   reloadTooltip();
  // }, [...extraData]);
  //
  // const reloadTooltip = (show = true) => {
  //   ReactTooltip.rebuild();
  //   show && ReactTooltip.show(warningRef.current);
  //   show && setTimeout(() => ReactTooltip.hide(warningRef.current), 5000);
  // };

  return (
    <TextInputLabel className={className} style={style} onClick={onClick}>
      {!!labelTx && <FormattedMessage {...labelTx} />}
      {label}
      {/*{showIcon && (*/}
      {/*  <WarningIconContainer*/}
      {/*    ref={warningRef}*/}
      {/*    data-for="validationErrors"*/}
      {/*    data-tip={tooltipData}*/}
      {/*    data-type={dataType}*/}
      {/*  >*/}
      {/*    <Image src={icon} />*/}
      {/*  </WarningIconContainer>*/}
      {/*)}*/}
      {showIcon && (
        <WarningIconContainer>
          <Error>{tooltipData}</Error>
        </WarningIconContainer>
      )}
      {/*<ReactTooltip id="validationErrors" place={position} />*/}
    </TextInputLabel>
  );
}

export default Label;

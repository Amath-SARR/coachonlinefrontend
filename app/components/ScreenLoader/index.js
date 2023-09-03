/**
 *
 * ScreenLoader
 *
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
// import LogoIcon from '../../images/logo/icon.png';
import LogoIcon from '../../images/logo/new_logo_solo.png';
import { colors } from '../../utils/colors';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #fff 0%, #fff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
`;
export const Logo = styled.img`
  max-height: 100px;
  animation: ${rotate} 3s ease-out infinite;
  opacity: 0.8;
`;

function ScreenLoader({ className }) {
  return (
    <LoadingWrapper className={className}>
      <Logo src={LogoIcon} alt="Logo" />
    </LoadingWrapper>
  );
}

ScreenLoader.propTypes = {};

export default ScreenLoader;

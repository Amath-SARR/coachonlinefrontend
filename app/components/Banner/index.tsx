/**
 *
 * Banner
 *
 */

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  position: absolute;
  z-index: 0;
`;
const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

function Banner(props) {
  const { src, className, children } = props;
  return (
    <Wrapper className={className}>
      <Image src={src} />
      {children}
    </Wrapper>
  );
}

export default Banner;

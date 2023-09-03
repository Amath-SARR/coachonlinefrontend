/**
 *
 * AspectRatioContainer
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useWindowSize from '../../hooks/useWindowSize';

const Wrapper = styled.div`
  width: 100%;
  height: ${props => `${props.height}px` || 'unset'};
`;

// heightRatio indicates height to width percentage eg. heightRatio = 0.52 will give height that equals 52% of width
function AspectRatioContainer({
  reference,
  className,
  children,
  heightRatio = 0.52,
}) {
  const { width } = useWindowSize();
  const wrapperRef = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const containerWidth = (reference || wrapperRef).current?.offsetWidth || 0;
    setHeight(containerWidth * heightRatio);
  }, [width]);
  return (
    <Wrapper
      ref={reference || wrapperRef}
      className={className}
      height={height}
    >
      {children}
    </Wrapper>
  );
}

export default AspectRatioContainer;

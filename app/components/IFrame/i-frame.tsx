/**
 *
 * IFrame
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import IFrameProps from './i-frame.props';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';

const Wrapper = styled.div`
  position: relative;
`;
const Frame = styled.iframe`
  width: 100%;
  transition: height 1s ease-in-out;
`;
const LoaderWrapper = styled.div`
  position: absolute;
  z-index: 9;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  mix-blend-mode: difference;
`;

function IFrame(props: IFrameProps) {
  const {
    src,
    className,
    frameBorder = 0,
    loading = 'lazy',
    scrolling = 'no',
    height,
    initHeight = 1000,
    onLoad = () => null,
    wrapperStyle,
  } = props;
  const iframeRef = useRef();

  const [frameHeight, setFrameHeight] = useState(height || initHeight);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!height) {
      window.addEventListener('message', onMessage);
    }
  }, [src]);

  const onMessage = (e: MessageEvent) => {
    if (e.data?.source === src) {
      setFrameHeight(e.data?.documentHeight + initHeight);
    }
  };

  const onLoadFinish = () => {
    setIsLoading(false);
    onLoad();
  };

  return (
    <Wrapper style={wrapperStyle}>
      {isLoading && (
        <LoaderWrapper>
          <Loader type="Oval" color="white" height={55} width={45} />
        </LoaderWrapper>
      )}
      <Frame
        className={className}
        ref={iframeRef}
        height={frameHeight}
        loading={loading}
        src={src}
        frameBorder={frameBorder}
        scrolling={scrolling}
        onLoad={onLoadFinish}
      />
    </Wrapper>
  );
}

export default IFrame;

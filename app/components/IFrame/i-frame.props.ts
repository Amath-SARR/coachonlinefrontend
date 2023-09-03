import React from 'react';

export default interface IFrameProps {
  src: string;
  className?: string;
  height?: number;
  initHeight?: number;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  frameBorder?: number;
  scrolling?: 'no' | 'yes' | 'auto';
  wrapperStyle?: React.CSSProperties;
}

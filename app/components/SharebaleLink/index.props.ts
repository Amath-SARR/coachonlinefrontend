import React from 'react';

export interface ShareableLinkProps {
  link: string | null;
  label?: string | null;
  dark?: boolean;
  wrapperStyle?: React.CSSProperties;
  accent?: string;
}

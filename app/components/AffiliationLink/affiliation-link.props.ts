import { ShareableLinkProps } from '../SharebaleLink/index.props';
import { AffiliatorType, Coupon, LinkOptions } from '../../containers/Affiliation/reducer.types';
import React from 'react';

export default interface AffiliationLinkProps extends ShareableLinkProps {
  onLinkChange?: (link: string) => void;
  onLinkOptionsChange?: (options: { limitedPageView: boolean; couponId: string | null }) => void;
  accent?: string;
  optionsAvailable?: boolean;
  options?: LinkOptions;
  coupons?: Coupon[];
  labelStyle?: React.CSSProperties;
  affiliatorType?: AffiliatorType;
  text: string 
}

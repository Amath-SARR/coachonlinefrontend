import { ShareableLinkProps } from '../SharebaleLink/index.props';
import { AffiliatorType, Coupon, LinkOptions } from '../../containers/Affiliation/reducer.types';
import React from 'react';

export default interface PayoutsButtonProps extends ShareableLinkProps {
  userId: number;
  lastUpdateDate: number;
  dark?: boolean;
  getPayouts?: (data: any) => void;
}

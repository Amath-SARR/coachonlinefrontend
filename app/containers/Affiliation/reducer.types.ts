export enum SubscriptionTypes {
  'yearly',
  'monthly',
  'student monthly'
}

export enum RankingTypes {
  'all',
  'coaches',
  'students'
}

export enum AffiliatorType {
  'Regular',
  'Influencer'
}

export enum CouponDurationEnum {
  'once',
  'forever',
  'repeating'
}

export interface Coupon {
  id: string;
  name: string;
  duration: CouponDurationEnum;
  durationStr: keyof CouponDurationEnum;
  percentOff: number | null;
  amountOff: number | null;
  currency: number | null;
  durationInMonths: number | null;
  availableForInfluencers: boolean;
}

export interface LinkOptions {
  link: string | null;
  limitedPageView: boolean;
  couponId: string | null;
  coupon: Coupon | null;
  withTrialPlans: boolean;
}

export enum PayoutStatusEnum {
  " ",
  "Requested",
  "Rejected",
  "Withdrawn",
}

export enum PayoutTypesEnum {
  "Affiliation",
  "CoachPayout"
}

export enum PayoutProviderEnum {
  "Paypal",
  "Stripe"
}

export interface IPayment {
  id: number;
  currency: "eur";
  value: number;
  affiliateId: number;
  paymentCreationDate: string;
}

export interface IPayoutRequest {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  payPalEmail: string;
  payPalPayerId: string;
  currency: "eur";
  value: number;
  status: PayoutStatusEnum;
  statusStr: keyof PayoutStatusEnum;
  paymentType: PayoutTypesEnum;
  paymentTypeStr: keyof PayoutTypesEnum;
  payoutType: PayoutProviderEnum;
  payoutTypeStr: keyof PayoutProviderEnum;
  requestDate: string;
  updateDate: string | null;
  rejectReason: string | null;
  affiliatePaymentsTotal: number;
  paymentsRequests: IPayment[];
}

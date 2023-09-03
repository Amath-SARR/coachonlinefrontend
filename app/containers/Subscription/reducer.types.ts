export enum BillingOption {
  'NORMAL',
  'STUDENT'
}

export interface SubscriptionPrice {
  billingPlanId: number;
  stripePriceId: string;
  currency: 'eur';
  reccuring: boolean;
  amount: number;
  period: number;
  periodType: string;
  trialDays: number;
}
export interface Subscription {
  id: number;
  name: 'Monthly' | 'Yearly' | 'Student Monthly' | 'No Subscription';
  stripeProductId: string;
  description: string;
  stripePriceId: string;
  currency: 'eur';
  isActive: boolean;
  amountPerMonth: number;
  price: SubscriptionPrice;
  billingOption: BillingOption;
  billingOptionStr: keyof BillingOption;
}

export interface ActiveSubscription extends Subscription {
  activationDate: string | null; //date ISO
  billingPlanType: number;
  billingPlanTypeId: number;
  creationDate: string | null; //date ISO
  expiryDate: string | null; //date ISO
  id: number;
  isStudent: boolean;
  plannedActivationDate: string | null; //date ISO
  status: number;
  statusStr: 'ACTIVE' | 'AWAITING_ACTIVATION';
  stripeSubscriptionId: string | null;
  stripeSubscriptionScheduleId: string | null;
  studentCardData: string | null;
  studentCardRejection: string | null;
  studentCardVerificationStatus: number;
  studentCardVerificationStatusStr: string | null;
  user: string | null;
  userId: number;
}
export interface CurrentSubscription extends ActiveSubscription {}

export interface SubscriptionReducerState {
  availableSubscriptions: Subscription[];
  selected: Subscription;
  setupClientSecret: string;
  invoices: any[];
  activeSubscription: ActiveSubscription;
  currentSubscription: CurrentSubscription;
  cardInfo: any;
}

import {
  Subscription,
  SubscriptionReducerState,
} from '../../containers/Subscription/reducer.types';

export default interface SubscriptionsSelectorProps {
  subscription: SubscriptionReducerState;
  onSelect: (subscription: Subscription) => void;
  getSubscriptionPlans: () => void;
  setSubscription: (subscription: Subscription) => void;
  showFreePlan?: boolean;
}

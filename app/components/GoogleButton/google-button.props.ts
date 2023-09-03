import { GoogleActionType } from '../../containers/Auth/reducer.types';

export default interface GoogleButtonProps {
  actionType: GoogleActionType;
  link?: string;
  redirectUrl?: string;
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
}

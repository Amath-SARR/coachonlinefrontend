import { UserRole } from '../../containers/Auth/reducer.types';

export default interface RegisterFormProps {
  onSubmit: (data: any) => void;
  libraryState?: boolean;
  libraries?: any[];
  submitLabel?: string;
  accountType?: string;
  userRole?: typeof UserRole;
}

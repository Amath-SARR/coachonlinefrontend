import { B2BAccount } from '../../../containers/B2B/index.props';
import { RequestActions } from '../../../types/api.props';

export interface CompanyDataFormProps {
  company: B2BAccount | null;
  onSubmit: (data: B2BAccount) => void;
}

import { B2BCompanyService } from '../../../containers/B2B/reducer.types';
import { B2BLibrary } from '../../../containers/B2B/reducer.types';

export interface LibrarySubscriptionProps {
  services: B2BCompanyService[] | [];
  library: B2BLibrary | null;
  canModify: boolean;
  onServiceSelect: (subscription: B2BCompanyService) => void;
  onServiceCancel: (subscription: B2BCompanyService) => void;
}

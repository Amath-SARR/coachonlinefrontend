import { B2BLibrary } from '../../../containers/B2B/index.props';

export interface LibraryDataFormProps {
  library: B2BLibrary | null;
  onSubmit: (data: B2BLibrary) => void;
  onLinkSubmit: (link: string) => void;
}

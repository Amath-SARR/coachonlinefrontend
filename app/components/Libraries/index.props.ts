import { B2BLibrary, B2BState } from '../../containers/B2B/reducer.types';
import { RegisterForm } from '../CreateAccountForm/index.props';
import {
  CreateLibraryActionData,
  GetLibrariesActionData,
} from '../../containers/B2B/actions.types';

export interface CreateLibraryForm extends RegisterForm, Omit<B2BLibrary, 'email'> {
  b2bId: number;
}

export interface LibrariesSagaBody extends B2BLibrary {
  b2bId?: number;
}

export interface LibrariesProps {
  b2B: B2BState;
  getLibraries: (data: GetLibrariesActionData) => void;
  setLibrary: (data: B2BLibrary | null) => void;
  createLibrary: (data: CreateLibraryActionData) => void;
}

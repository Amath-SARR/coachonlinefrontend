import { RequestActions } from '../../types';
import { B2BAccountData, B2BCompanyService, B2BLibrary, B2BProfileData } from './reducer.types';

export interface LogInActionData {
  body: {
    login: string;
    password: string;
  };
  actions?: RequestActions;
}
export interface LogInSuccessActionData extends B2BAccountData {}
export interface GetProfileActionData {
  body: {
    token: string | null;
  };
  actions?: RequestActions;
}
export interface SetProfileActionData extends B2BProfileData {}
export interface UpdateB2BActionData {
  body: {
    form: B2BAccountData;
    token: string;
  };
  actions?: RequestActions;
}
export interface GetLibrariesActionData {
  body: {
    token: string | null;
  };
  actions?: RequestActions;
}
// export interface SetLibrariesActionData extends B2BLibrary {}
export interface GetLibraryByIdActionData {
  body: {
    token: string | null;
    id: string;
  };
  actions?: RequestActions;
}
export interface SetLibraryActionData extends B2BLibrary {}
export interface CreateLibraryActionData {
  body: {
    email: string;
    password: string;
    repeatPassword: string;
    token: string | null;
  };
  actions?: RequestActions;
}
export interface ChangeLibrarySubscriptionActionData {
  body: {
    subscription: B2BCompanyService;
    token: string;
    id: number;
  };
  actions?: RequestActions;
}
export interface CancelLibrarySubscriptionActionData {
  body: {
    subscription: B2BCompanyService;
    token: string;
    id: number;
  };
  actions?: RequestActions;
}
export interface ChangeLibraryLinkActionData {
  body: {
    token: string;
    libraryId: number;
    proposedName: string;
  };
  actions?: RequestActions;
}

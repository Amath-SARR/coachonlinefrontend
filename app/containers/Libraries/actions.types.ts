import { RequestActions } from '../../types';
import { B2BAccountData, B2BLibrary, B2BProfileData, InstitutionData } from './reducer.types';

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
    id?: number;
  };
  actions?: RequestActions;
}
export interface SetProfileActionData extends B2BProfileData {}
export interface GetLibrariesActionData {
  body: {
    token: string | null;
  };
  actions?: RequestActions;
}
// export interface SetLibrariesActionData extends B2BLibrary {}
export interface GetLibraryActionData {
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
export interface UpdateLibraryActionData {
  body: {
    form: B2BLibrary;
    token: string;
  };
  actions?: RequestActions;
}
export interface RegisterForInstitutionActionData {
  body: {
    email: string;
    secret: string;
    repeatPassword: string;
    libraryId: number;
    gender: string;
    professionId: number;
    yearOfBirth: number;
  };
  actions?: RequestActions;
}
export interface GetProfessionsActionData {
  actions?: RequestActions;
}
export interface GetInstitutionActionData {
  body: {
    id: string;
  };
  actions?: RequestActions;
}
export interface SetInstitutionActionData extends InstitutionData {}
export interface GetLibraryStatisticsActionData {
  body: {
    id?: number;
    end?: string;
    start?: string;
    token: string;
  };
  actions?: RequestActions;
}
export interface SetLibraryStatisticsActionData {
  body: {
    id: string;
  };
  actions?: RequestActions;
}

export interface GetLibraryConnectionStatisticsActionData {
  body: {
    id: number;
    key: string;
    from?: string;
    to?: string;
    token: string;
  };
  actions?: RequestActions;
}

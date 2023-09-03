import { B2BAccount, B2BSalesPerson } from '../../../containers/B2B/index.props';
import { RequestActions } from '../../../types/api.props';

export interface SalesPersonSagaBody extends B2BSalesPerson {
  accountId?: string | number;
  personId?: string | number;
}

export interface LibraryReferentSagaBody extends SalesPersonSagaBody {}

export interface SalesPersonsProps {
  salesPersons: B2BSalesPerson[] | [];
  company: B2BAccount | null;
  createPerson: (data: { body: SalesPersonSagaBody; actions?: RequestActions }) => void;
  updatePerson: (data: { body: SalesPersonSagaBody; actions?: RequestActions }) => void;
  deletePerson: (data: { body: { personId: number | string }; actions?: RequestActions }) => void;
  onFinish?: (data?: any) => void;
}

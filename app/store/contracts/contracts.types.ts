export enum ContractsTypes {
  'Agreement',
  'PrivacyPolicy',
  'GeneralConditionsOfUsage',
  'TermsAndConditions'
}

export interface Contract {
  contractBody: string | null;
  contractId: number | undefined;
  contractName: string | null;
  type: ContractsTypes | null;
}

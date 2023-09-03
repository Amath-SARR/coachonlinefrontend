export enum FaqTypes {
  'Agreement',
  'PrivacyPolicy',
  'GeneralConditionsOfUsage',
  'TermsAndConditions'
}

export interface Category {
  categoryId: number;
  categoryName: string;
  topics?: Topic[];
}

export interface Topic {
  topicName: string;
  topicId?: number
  categoryId?: number;
  topicBody?: string;
  tags?: string;
}

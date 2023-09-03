export interface UserStateInfo {
  authToken: string | null;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  localization?: string | null;
  courseOpened?: boolean | null;
}

export interface ActiveOnAnotherDeviceEventData
  extends Omit<UserStateInfo, 'authToken' | 'courseOpened'> {
  userId: number;
}

export interface UserLocalizationData {
  authToken: string | null;
  userUrl: string;
}

export interface QuestionnaireResponse {
  id: number;
  otherResponse: boolean;
  response: string;
}

export interface QuestionnaireEventData {
  id: number;
  qustion: string;
  responses: QuestionnaireResponse[];
}

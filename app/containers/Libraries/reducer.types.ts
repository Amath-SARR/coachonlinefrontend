export interface B2BAccountData {
  accountType: 0;
  accountTypeStr: 'B2B_ACCOUNT';
  authToken: string;
}
export interface B2BSalesPerson {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  phoneNo: string;
  photoUrl: string;
}
export interface B2BPricingPeriod {
  value: 0 | 1 | 2 | 3;
  description: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
}
export interface B2BPricingAccessType {
  value: 0 | 1 | 2;
  description: 'FULL' | 'COURSES' | 'PLATFORM';
}
export interface B2BCompanyService {
  serviceId: number;
  pricingName: string;
  numberOfActiveUsers: number;
  timePeriod: B2BPricingPeriod['value'];
  price: number;
  currency: 'eur' | 'pln';
  accessType: B2BPricingAccessType['value'];
  timePeriodStr: B2BPricingPeriod['description'];
  accessTypeStr: B2BPricingAccessType['description'];
  comission: number;
  comissionCurrency: 'eur' | 'pln';
  subscriptionEnd?: string; // ISO
  subscriptionStart?: string; // ISO
  status: 1;
  statusStr: 'ACTIVE';
}
export interface B2BProfileData {
  accountName: string;
  accountSalesPersons: B2BSalesPerson[];
  availableServices: B2BCompanyService[];
  email: string;
  phoneNo: string;
  city: string;
  comission: number;
  comissionCurrency: string;
  contractSignDate: string;
  contractSigned: boolean;
  country: string;
  id: number;
  login: string;
  photoUrl: string; // only file nam, no uri provided
  postalCode: string;
  street: string;
  streetNo: string;
  website: string;
}
export interface B2BLibrary {
  id: number;
  b2BAccountId: number;
  b2BAccountName: string;
  email: string | null;
  phoneNo: string | null;
  libraryName: string | null;
  institutionLink: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  street: string | null;
  streetNo: string | null;
  photoUrl: string | null;
  website: string | null;
  referents: B2BSalesPerson[];
  booksNo: number | null;
  readersNo: number | null;
  cdsNo: number | null;
  videosNo: number | null;
  sigbName: string | null;
  activeSubscription: null;
  allSubscriptions: B2BCompanyService[];
}

export interface B2BState {
  b2bAuthToken: string | null;
  accountData: B2BAccountData | null;
  profileData: B2BProfileData | null;
  libraries: B2BLibrary[] | null;
}

export interface InstitutionProfession {
  id: number;
  name: string;
}

export interface InstitutionData {
  id: number;
  email: string;
  libraryName: string;
  photoUrl: string | null;
  website: string;
}
export interface LibraryStatisticsBaseData {
  totalRegisteredUsers: number;
  totalConnections: number;
  connectionsTotalTime: number;
  connectrionsAverageTime: number;
}

export interface LibraryStatisticsByProfession extends LibraryStatisticsBaseData {
  professionId: number;
  professionName: string;
}
export interface LibraryStatisticsByYearOfBirth extends LibraryStatisticsBaseData {
  fromAge: number;
  toAge: number;
}
export interface LibraryStatisticsByGender extends LibraryStatisticsBaseData {
  gender: 'Female' | 'Male';
}
export interface LibraryStatistics {
  totalRegisteredUsers: number;
  currentlyConnected: number;
  totalConnections: number;
  connectionsTotalTime: number;
  connectrionsAverageTime: number;
  byProfession: LibraryStatisticsByProfession[];
  byYearOfBirth: LibraryStatisticsByYearOfBirth[];
  byGender: LibraryStatisticsByGender[];
}

export interface LibraryConnectionStatistics
  extends Omit<LibraryStatistics, 'byGender' | 'byProfession' | 'byYearOfBirth'> {
  key: string;
  data: LibraryStatisticsBaseData[] & { id: number; name: string }[];
}

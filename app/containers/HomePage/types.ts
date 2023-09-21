export interface CourseCategory {
  adultOnly: boolean;
  id: number;
  name: string;
  parentId: number | null;
  parentName: string | null;
  parentsChildren: CourseCategory[] | null;
}

export interface CoachCategory {
  id: number;
  name: string;
}
export interface CourseCoach {
  bio: string | null;
  country: string | null;
  courses: Course[] | null;
  email: string;
  firstName: string | null;
  gender: string | null;
  id: number;
  lastName: string | null;
  photoUrl: string | null; // <hash>.<extension>
  profilePhotoUrl: string | null; // images/<hash>.<extension>
  userCategories: CoachCategory[];
  yearOfBirth: number | null;
}

export interface EpisodeAttachment {
  added: number; // milliseconds
  episodeId: number;
  extension: string;
  hash: string;
  id: number;
  name: string;
  queryString: string;
  userTokenPermission: null;
}
export interface CourseEpisode {
  attachments: EpisodeAttachment[];
  courseId: number;
  created: number; // milliseconds
  description: string;
  episodeState: number;
  episodeStateStr: string;
  id: number;
  isPromo: boolean;
  lastOpenedSecond: number;
  length: number;
  mediaId: string;
  needConversion: boolean;
  ordinalNumber: number;
  query: string | null;
  title: string;
}

export enum CourseState {
  'PENDING',
  'REJECTED',
  'APPROVED',
  'UNPUBLISHED',
  'BLOCKED'
}
export interface Course {
  bannerPhotoUrl: string | null;
  category: CourseCategory;
  coach: CourseCoach;
  created: number; // milliseconds
  description: string;
  episodes: CourseEpisode[];
  id: number;
  isFlagged: boolean | null;
  isLikedByMe: boolean;
  likesCnt: number;
  name: string;
  orderNo: number | null;
  photoUrl: string | null;
  rejectionsHistory: string[];
  state: number;
  courseName: string;
  coursePhotoUrl: any;
}

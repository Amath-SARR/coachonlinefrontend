import { defineMessages } from 'react-intl';
import React from 'react';
export const LogoForm = require('../../app/images/images/logo1.png');
export const Yoga = require('../../app/images/images/yoga.png');
export const Union = require('../../app/images/images/union.png');
export const Obama = require('../../app/images/images/obama.png');
export const Ia = require('../../app/images/images/ia.png');

export const scope = 'app.components.Language';

export default defineMessages({
  account: {
    id: `${scope}.account`,
    defaultMessage: 'Account',
  },
  accountSettings: {
    id: `${scope}.accountSettings`,
    defaultMessage: 'Paramètres du compte',
  },
  accountName: {
    id: `${scope}.accountName`,
    defaultMessage: 'Nom de distributeur',
  },
  commission: {
    id: `${scope}.commission`,
    defaultMessage: 'Commission',
  },
  invoices: {
    id: `${scope}.invoices`,
    defaultMessage: 'Invoices',
  },
  example: {
    id: `${scope}.example`,
    defaultMessage: 'example',
  },
  contact: {
    id: `${scope}.contact`,
    defaultMessage: 'Contact',
  },
  courses: {
    id: `${scope}.courses`,
    defaultMessage: 'Courses',
  },
  cantFindCategory: {
    id: `${scope}.cantFindCategory`,
    defaultMessage: "Can't find your category?",
  },
  deleteAccount: {
    id: `${scope}.deleteAccount`,
    defaultMessage: 'Delete account',
  },
  suggestCategory: {
    id: `${scope}.suggestCategory`,
    defaultMessage: 'Click here to suggest it.',
  },
  suggestNewCategory: {
    id: `${scope}.suggestNewCategory`,
    defaultMessage: 'Suggest a new category',
  },
  adminWillReviewIt: {
    id: `${scope}.adminWillReviewIt`,
    defaultMessage:
      'Administrator will review it and you will receive a feedback as soon as possible',
  },
  pleaseSelectParentCategory: {
    id: `${scope}.pleaseSelectParentCategory`,
    defaultMessage: 'Please select the parent category',
  },
  pleaseProvideCategoryName: {
    id: `${scope}.pleaseProvideCategoryName`,
    defaultMessage: 'Please provide a name of your category',
  },
  createCourse: {
    id: `${scope}.createCourse`,
    defaultMessage: 'Create your course',
  },
  coachInfo: {
    id: `${scope}.coachInfo`,
    defaultMessage: 'Coach info',
  },
  coaches: {
    id: `${scope}.coaches`,
    defaultMessage: 'Coaches',
  },
  videoMaterial: {
    id: `${scope}.videoMaterial`,
    defaultMessage: 'video material',
  },
  comingSoon: {
    id: `${scope}.comingSoon`,
    defaultMessage: 'COMING SOON!',
  },
  comingSoonDesc: {
    id: `${scope}.comingSoonDesc`,
    defaultMessage:
      'Coachs-online is a web platform with online courses provided by best specialist in France and world-wide.',
  },
  comingSoonBottom1: {
    id: `${scope}.comingSoonBottom1`,
    defaultMessage: 'Sign up now, create your courses and don’t miss',
  },
  comingSoonBottom2: {
    id: `${scope}.comingSoonBottom2`,
    defaultMessage: 'opportunity to become our community!',
  },
  comingSoonRegister: {
    id: `${scope}.comingSoonRegister`,
    defaultMessage: 'REGISTER',
  },
  comingSoonDays: {
    id: `${scope}.comingSoonDays`,
    defaultMessage: 'DAYS',
  },
  comingSoonHour: {
    id: `${scope}.comingSoonHour`,
    defaultMessage: 'HOUR',
  },
  comingSoonMinutes: {
    id: `${scope}.comingSoonMinutes`,
    defaultMessage: 'MINUTES',
  },
  comingSoonSeconds: {
    id: `${scope}.comingSoonSeconds`,
    defaultMessage: 'SECONDS',
  },
  episodes: {
    id: `${scope}.episodes`,
    defaultMessage: 'episodes',
  },
  welcome: {
    id: `${scope}.welcome`,
    defaultMessage: 'Welcome',
  },
  logInto: {
    id: `${scope}.logInto`,
    defaultMessage: 'Log your',
  },
  forgotPassword: {
    id: `${scope}.forgotPassword`,
    defaultMessage: 'Forgot password',
  },
  registerNewAccount: {
    id: `${scope}.registerNewAccount`,
    defaultMessage: 'Register a new account',
  },
  registerAsCoach: {
    id: `${scope}.registerAsCoach`,
    defaultMessage: 'Register as Coach',
  },
  registerAsStudent: {
    id: `${scope}.registerAsStudent`,
    defaultMessage: 'Register as Subscriber',
  },
  registrationTitle: {
    id: `${scope}.registrationTitle`,
    defaultMessage: 'Registration',
  },
  signUpInto: {
    id: `${scope}.signUpInto`,
    defaultMessage: 'Sign up into your account',
  },
  skip: {
    id: `${scope}.skip`,
    defaultMessage: 'Skip',
  },
  registrationDone: {
    id: `${scope}.registrationDone`,
    defaultMessage: 'Registration done!',
  },
  registrationDoneText: {
    id: `${scope}.registrationDoneText`,
    defaultMessage:
      'We’ve sent you a confirmation email! Click on the link in the email and confirm your registration.',
  },
  loginButton: {
    id: `${scope}.loginButton`,
    defaultMessage: 'Log in',
  },
  logOut: {
    id: `${scope}.logOut`,
    defaultMessage: 'Log out',
  },
  listOfCourses: {
    id: `${scope}.listOfCourses`,
    defaultMessage: 'LIST OF CURRENT COURSES',
  },
  createNewCourse: {
    id: `${scope}.createNewCourse`,
    defaultMessage: 'CREATE NEW COURSE',
  },
  createNewLiveEvent: {
    id: `${scope}.createNewLiveEvent`,
    defaultMessage: 'CREATE NEW LIVE EVENT',
  },
  coursesTableName: {
    id: `${scope}.coursesTableName`,
    defaultMessage: 'Name',
  },
  coursesTableCover: {
    id: `${scope}.coursesTableCover`,
    defaultMessage: 'Cover photo',
  },
  coursesTableCategory: {
    id: `${scope}.coursesTableCategory`,
    defaultMessage: 'Category',
  },
  coursesTableSubCategory: {
    id: `${scope}.coursesTableSubCategory`,
    defaultMessage: 'Sous-catégorie',
  },
  coursesTableCreated: {
    id: `${scope}.coursesTableCreated`,
    defaultMessage: 'Created',
  },
  coursesTableStatus: {
    id: `${scope}.coursesTableStatus`,
    defaultMessage: 'Status',
  },
  noCourses: {
    id: `${scope}.noCourses`,
    defaultMessage:
      "You haven't submitted any course yet. To submit your first course click on the button bellow",
  },
  noLiveEvents: {
    id: `${scope}.noLiveEvents`,
    defaultMessage: 'You have not created any live events yet...',
  },
  submitButton: {
    id: `${scope}.submitButton`,
    defaultMessage: 'SUBMIT',
  },
  dashboard: {
    id: `${scope}.dashboard`,
    defaultMessage: 'Dashboard',
  },
  billing: {
    id: `${scope}.billing`,
    defaultMessage: 'Billing',
  },
  ranking: {
    id: `${scope}.ranking`,
    defaultMessage: 'Ranking',
  },
  profile: {
    id: `${scope}.profile`,
    defaultMessage: 'Profile',
  },
  profession: {
    id: `${scope}.profession`,
    defaultMessage: 'Profession',
  },
  createCourseDesc: {
    id: `${scope}.createCourseDesc`,
    defaultMessage:
      'Create and manage your course here to bring best experience to your students. Remember to keep the high quality of provided content.',
  },
  editYourCourse: {
    id: `${scope}.editYourCourse`,
    defaultMessage: 'Edit your course',
  },
  editPromoEpisode: {
    id: `${scope}.editPromoEpisode`,
    defaultMessage: 'Edit promo episode',
  },
  addNewEpisode: {
    id: `${scope}.addNewEpisode`,
    defaultMessage: 'Add new episode',
  },
  address: {
    id: `${scope}.address`,
    defaultMessage: 'Adresse',
  },
  addAudioVideo: {
    id: `${scope}.addAudioVideo`,
    defaultMessage: 'add audio/video file',
  },
  uploading: {
    id: `${scope}.uploading`,
    defaultMessage: 'Uploading',
  },
  uploaded: {
    id: `${scope}.uploaded`,
    defaultMessage: 'Your clips has been uploaded correctly',
  },
  remove: {
    id: `${scope}.remove`,
    defaultMessage: 'Remove Video',
  },
  durationTime: {
    id: `${scope}.durationTime`,
    defaultMessage: 'duration time',
  },
  addMaterials: {
    id: `${scope}.addMaterials`,
    defaultMessage: '+ Add studying materials to lesson',
  },
  saveCourseDisclaimer: {
    id: `${scope}.saveCourseDisclaimer`,
    defaultMessage: 'You will be able to submit your course after meeting all requirements',
  },
  advice: {
    id: `${scope}.advice`,
    defaultMessage: 'Advice:',
  },
  adviceDisc: {
    id: `${scope}.adviceDisc`,
    defaultMessage:
      'In order to keep the best experience of your course cover photo please make sure it has size 1920x1080',
  },
  submitCourse: {
    id: `${scope}.submitCourse`,
    defaultMessage: 'SUBMIT COURSE',
  },
  submitCourseConfirm: {
    id: `${scope}.submitCourseConfirm`,
    defaultMessage: 'Are you sure that you want to submit your course for review?',
  },
  useParentCategory: {
    id: `${scope}.useParentCategory`,
    defaultMessage: 'Use parent category',
  },
  deleteCourse: {
    id: `${scope}.deleteCourse`,
    defaultMessage: 'DELETE COURSE',
  },
  deleteCourseConfirm: {
    id: `${scope}.deleteCourseConfirm`,
    defaultMessage: 'Are you sure that you want to delete this course?',
  },
  deleteEpisodeConfirm: {
    id: `${scope}.deleteEpisodeConfirm`,
    defaultMessage: 'Are you sure that you want to delete this episode?',
  },
  YES: {
    id: `${scope}.YES`,
    defaultMessage: 'YES',
  },
  NO: {
    id: `${scope}.NO`,
    defaultMessage: 'NO',
  },
  courseName: {
    id: `${scope}.courseName`,
    defaultMessage: 'Course Name',
  },
  category: {
    id: `${scope}.category`,
    defaultMessage: 'Category',
  },
  categories: {
    id: `${scope}.categories`,
    defaultMessage: 'Categories',
  },
  subCategory: {
    id: `${scope}.subCategory`,
    defaultMessage: 'Sous-catégorie',
  },
  subCategories: {
    id: `${scope}.subCategories`,
    defaultMessage: 'Sous-catégories',
  },
  Description: {
    id: `${scope}.Description`,
    defaultMessage: 'Description',
  },
  episodeName: {
    id: `${scope}.episodeName`,
    defaultMessage: 'Episode Name',
  },
  Gender: {
    id: `${scope}.Gender`,
    defaultMessage: 'Gender',
  },
  Female: {
    id: `${scope}.Female`,
    defaultMessage: 'Femme',
  },
  Male: {
    id: `${scope}.Male`,
    defaultMessage: 'Homme',
  },
  Bio: {
    id: `${scope}.Bio`,
    defaultMessage: 'Bio',
  },
  firstName: {
    id: `${scope}.firstName`,
    defaultMessage: 'First Name',
  },
  Surname: {
    id: `${scope}.Surname`,
    defaultMessage: 'Surname',
  },
  birthDate: {
    id: `${scope}.birthDate`,
    defaultMessage: 'Year of birth',
  },
  country: {
    id: `${scope}.country`,
    defaultMessage: 'Country',
  },
  City: {
    id: `${scope}.City`,
    defaultMessage: 'City',
  },
  Category: {
    id: `${scope}.Category`,
    defaultMessage: 'Category',
  },
  Cv: {
    id: `${scope}.Cv`,
    defaulteMessage: 'Votre CV',
  },
  currentPassword: {
    id: `${scope}.currentPassword`,
    defaultMessage: 'Current password',
  },
  currentBalance: {
    id: `${scope}.currentBalance`,
    defaultMessage: 'Current balance',
  },
  decreasedBy: {
    id: `${scope}.decreasedBy`,
    defaultMessage: 'Decreased by',
  },
  month: {
    id: `${scope}.month`,
    defaultMessage: 'month',
  },
  year: {
    id: `${scope}.year`,
    defaultMessage: 'year',
  },
  earnedPreviousMonth: {
    id: `${scope}.earnedPreviousMonth`,
    defaultMessage: 'Earned previous month',
  },
  earnedCurrentMonth: {
    id: `${scope}.earnedCurrentMonth`,
    defaultMessage: 'Earned current month',
  },
  increasedBy: {
    id: `${scope}.increasedBy`,
    defaultMessage: 'Increased by',
  },
  moneyToWithdraw: {
    id: `${scope}.moneyToWithdraw`,
    defaultMessage: 'Money to withdraw',
  },
  totalEarningsThisMonth: {
    id: `${scope}.totalEarningsThisMonth`,
    defaultMessage: 'Total earnings this month',
  },
  totalMinutesThisMonth: {
    id: `${scope}.totalMinutesThisMonth`,
    defaultMessage: 'Total minutes this month',
  },
  totalMinutesPreviousMonth: {
    id: `${scope}.totalMinutesPreviousMonth`,
    defaultMessage: 'Total minutes previous month',
  },
  newPassword: {
    id: `${scope}.newPassword`,
    defaultMessage: 'Enter your new password',
  },
  newPasswordRepeat: {
    id: `${scope}.newPasswordRepeat`,
    defaultMessage: 'Confirm your new password',
  },
  Email: {
    id: `${scope}.Email`,
    defaultMessage: 'E-mail',
  },
  Password: {
    id: `${scope}.Password`,
    defaultMessage: 'Password',
  },
  PasswordRepeat: {
    id: `${scope}.PasswordRepeat`,
    defaultMessage: 'Password repeat',
  },
  changePicture: {
    id: `${scope}.changePicture`,
    defaultMessage: 'Change picture',
  },
  privacyPolicyAgreementPt1: {
    id: `${scope}.privacyPolicyAgreementPt1`,
    defaultMessage: 'I accept ',
  },
  privacyPolicyAgreementPt2: {
    id: `${scope}.privacyPolicyAgreementPt2`,
    defaultMessage: 'of coachs-online platform',
  },
  privacyPolicyAgreementLink: {
    id: `${scope}.privacyPolicyAgreementLink`,
    defaultMessage: 'terms and conditions ',
  },
  phoneNo: {
    id: `${scope}.phoneNo`,
    defaultMessage: 'Numéro de téléphone',
  },
  postalCode: {
    id: `${scope}.postalCode`,
    defaultMessage: 'Post code',
  },
  resetYourPassword: {
    id: `${scope}.resetYourPassword`,
    defaultMessage: 'Reset your password',
  },
  videoUploadFailed: {
    id: `${scope}.videoUploadFailed`,
    defaultMessage:
      'Sorry, video upload has failed. Please check the file format and your connection, then try again',
  },
  videoIsBeingConverted: {
    id: `${scope}.videoIsBeingConverted`,
    defaultMessage:
      "Your video is in process to be converted please add all your episodes don't forget to record and submit your lessons. Your video will be displayed in a delay of maximum 24 hours",
  },
  videoConversionFailed: {
    id: `${scope}.videoConversionFailed`,
    defaultMessage:
      "There's been an error converting your video. Please try a different format or contact the administrator",
  },
  watched: {
    id: `${scope}.watched`,
    defaultMessage: 'watched',
  },
  studentSection: {
    id: `${scope}.studentSection`,
    defaultMessage: 'Student section',
  },
  liveEvents: {
    id: `${scope}.liveEvents`,
    defaultMessage: 'Live events',
  },
  startDate: {
    id: `${scope}.startData`,
    defaultMessage: 'Start date',
  },
  duration: {
    id: `${scope}.duration`,
    defaultMessage: 'Duration',
  },
  dragNDropHere: {
    id: `${scope}.dragNDropHere`,
    defaultMessage: 'Glisser-déposer',
  },
  or: {
    id: `${scope}.or`,
    defaultMessage: 'ou',
  },
  chooseFromDisc: {
    id: `${scope}.chooseFromDisc`,
    defaultMessage: 'Choisir depuis le disque',
  },
  eventCoverPhotoInfo: {
    id: `${scope}.eventCoverPhotoInfo`,
    defaultMessage: 'Taille des fichiers max 4MB, résolution 1920 x 1080',
  },
  next: {
    id: `${scope}.next`,
    defaultMessage: 'Next',
  },
  name: {
    id: `${scope}.name`,
    defaultMessage: 'Name',
  },
  coverPhoto: {
    id: `${scope}.coverPhoto`,
    defaultMessage: 'Cover photo',
  },
  date: {
    id: `${scope}.date`,
    defaultMessage: 'Date',
  },
  numberOfParticipants: {
    id: `${scope}.numberOfParticipants`,
    defaultMessage: 'Number of participants',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  login: {
    id: `${scope}.login`,
    defaultMessage: 'Login',
  },
  website: {
    id: `${scope}.website`,
    defaultMessage: 'Site web',
  },
});

export default interface TopCoursesProps {
  getCategories: () => void;
  dashboard: any;
  homePage: any;
  auth: any;
  onItemClick: () => void;
  setChosenCourse: () => void;
  getCourses: () => void;
  getSuggestedCourses: () => void;
}

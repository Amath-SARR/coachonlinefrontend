import { Course } from '../../containers/HomePage/types';

export default interface CategoryCardProps {
  getCategories: () => void;
  dashboard: any;
  course: Course;
}

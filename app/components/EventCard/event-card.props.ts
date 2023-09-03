import { Course } from '../../containers/HomePage/types';

export default interface EventCardProps {
  getCategories: () => void;
  dashboard: any;
  course: Course;
}

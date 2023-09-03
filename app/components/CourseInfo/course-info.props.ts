import { Course } from '../../containers/HomePage/types';

export default interface CourseInfoProps {
  course: Course;
  onLikeToggle: (courseId: Course['id'], value: boolean) => void;
  liked: boolean;
  canLike?: boolean;
}

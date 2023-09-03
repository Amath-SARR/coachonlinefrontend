import { Course } from '../../containers/HomePage/types';

export default interface CourseCardProps {
  course: Course;
  onLikeToggle: (courseId: Course['id'], value: boolean) => void;
  liked: boolean;
  canLike: boolean;
  onItemClick: () => void;
  category: any;
  style: any;
  index: any;
  withIndex: boolean;
  thumbnailWrapperStyle: any;
  auth: any;
}

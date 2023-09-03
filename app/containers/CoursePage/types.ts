export interface CommentEntity {
  children: CommentEntity[];
  commentId: number;
  commentText: string;
  courseId: number;
  creationDate: string; //iso
  email: string;
  fullName: string;
  isCourseAuthorComment: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  isMyComment: boolean;
  lastUpdateDate: string; //iso
  userId: number;
}

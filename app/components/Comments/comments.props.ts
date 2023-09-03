import { CommentEntity } from '../../containers/CoursePage/types';

export interface CommentInputProps {
  userData: unknown;
  onCommentCreate: (data: { commentTxt: string; onSuccess?: () => void }) => void;
  onCancel?: () => void;
  isChild?: boolean;
  comment?: CommentEntity;
}

export interface CommentProps {
  comment: CommentEntity;
  userData: unknown;
  onReplySubmit: (data: { commentId: number; commentTxt: string; onSuccess?: () => void }) => void;
  onEdit: (data: { commentId: number; commentTxt: string; onSuccess?: () => void }) => void;
  onDelete: (data: { commentId: number; onSuccess?: () => void }) => void;
  isChild?: boolean;
  canReply?: boolean;
}

export default interface CommentsProps {
  courseId: number;
  auth?: unknown;
}

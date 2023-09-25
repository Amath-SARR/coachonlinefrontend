/**
 *
 * Comments
 *
 */

import React, { FC, useEffect, useRef, useState } from 'react';
import CommentsProps, { CommentInputProps, CommentProps } from './comments.props';
import styled from 'styled-components';
import { DispatchType } from '../../types';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import {
  createCommentAction,
  deleteCommentAction,
  editCommentAction,
  getCommentsAction,
  replyToCommentAction,
} from '../../containers/CoursePage/actions';
import { CommentEntity } from '../../containers/CoursePage/types';
import ProfilePicture from '../ProfilePicture';
import { FlexColumn, FlexRow, Text } from '../../global-styles';
import { BASE_URL } from '../../config/env';
import { createStructuredSelector } from 'reselect';
import makeSelectAuth from '../../containers/Auth/selectors';
import InputTextarea from '../InputTextarea';
import Button from '../Button';
import { colors } from '../../utils/colors';
import Picker from 'emoji-picker-react';
import { Icon, IconWrapper } from '../CourseInfo/course-info';
import EmojiImg from '../../images/icons/happy.png';
import PencilImg from '../../images/icons/pencil.svg';
import CancelImg from '../../images/icons/cancel.svg';
import useOuterClick from '../../hooks/useOuterClick';
import messages from '../messages';
import ReactTooltip from 'react-tooltip';

const Wrapper = styled.div`
  width: 100%;
`;
const CommentWrapper = styled.div`
 /* flex-direction: column;
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;*/
  display: flex;
width: 100%;
padding: 32px;
flex-direction: column;
align-items: center;
gap: 26px;
border-radius: 14px;
border: 1px solid var(--dark-grey-50, #C5C5C9);
background: var(--carte, #F4F4F6);
`;

const CommentWrapper1 = styled.div`
display: flex;
align-items: center;
gap: 16px;
align-self: stretch;
`;
const CommentWrapper2 = styled.div`
align-self: stretch;
color: #000;
font-family: Montserrat;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;
const ButtonReponse = styled.div`
display: flex;
padding: 10px 16px;
align-items: center;
gap: 16px;
border-radius: 14px;
border: 1px solid var(--dark-grey-50, #C5C5C9);
background: var(--carte, #F4F4F6);
`;
const CommentInputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  position: relative;
  margin-bottom: 10px;
  @media screen and (max-width: 920px) {
    padding: 12px 5px;
    width: auto;
    margin : auto;
  }

`;
const CommentPlaceholder = styled.text`
color: var(--black-grey, #191919);
font-family: Montserrat;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;
const EmojiWrapper = styled.div`
  position: absolute;
  transform: translateY(45%);
  z-index: 2;
  .emoji-picker-react {
    background-color: ${colors.inputBlue};
  }
  .emoji-picker-react .emoji-group {
    &::before {
      background-color: ${colors.inputBlue};
    }
  }
  .emoji-search {
    background-color: ${colors.backgroundBlue};
    color: ${colors.lilac};
  }
  .emoji-categories {
    filter: invert(1);
  }
`;
const Column = styled(FlexColumn)`
  flex: 1;
`;
const Row = styled(FlexRow)`
  transition: height 0.5s ease-in-out;
`;
const BaseText = styled(Text)`
color: var(--black-grey, #191919);
font-family: Montserrat;
font-size: 21px;
font-style: normal;
font-weight: 500;
line-height: normal;
flex: 1 0 0;
`;
const IconsWrapper = styled(Row)``;

const CommentInput: FC<CommentInputProps> = ({
  userData,
  onCommentCreate,
  isChild,
  onCancel,
  comment,
}) => {
  const inputRef = useRef();

  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(comment?.commentText || '');
  const [emojiShown, setEmojiShown] = useState(false);
  const emojiWrapperRef = useOuterClick(() => emojiShown && setEmojiShown(false));

  const pictureSize = isChild ? 42 : 64;

  const onChange = (val: string) => {
    setText(val);
  };

  const onSave = () => {
    onCommentCreate({
      commentTxt: text,
      onSuccess: () => {
        setText('');
        inputRef.current?.blur();
      },
    });
  };

  const cancel = () => {
    setText('');
    inputRef.current?.blur();
    !!onCancel && onCancel();
  };

  const onEmojiClick = (ev, emojiObject) => setText(`${text}${emojiObject.emoji}`);

  const toggleEmoji = () => setEmojiShown(!emojiShown);

  return (
    <CommentInputWrapper>
      <Column>
        <CommentPlaceholder> Ecrivez un commentaire</CommentPlaceholder>
        <InputTextarea
          ref={inputRef}
          redesigned
          inputProps={{
            //placeholder: 'Écrivez un commentaire...',
            rows: 2,
            defaultValue: text,
            value: text,
            onChange: (ev) => onChange(ev.target.value),
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
          }}
          style={{
            width: '100%',
            height: '70px',
            border: '1px solid var(--dark-grey-50, #C5C5C9)',
            BorderRadius: '14px',
            background: 'var(--carte, #F4F4F6)'
          }}
          textareaStyle={{ verticalAlign: 'top', whiteSpace: 'pre-wrap', padding: 7, color: 'black' }}
        />
        <Row style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconWrapper onClick={toggleEmoji}>
            <Icon src={EmojiImg} style={{ filter: 'invert(1)' }} />
          </IconWrapper>
          {emojiShown && (
            <EmojiWrapper ref={emojiWrapperRef}>
              <Picker onEmojiClick={onEmojiClick} />
            </EmojiWrapper>
          )}
          <Row style={{ height: !!text ? 40 : 0, overflow: 'hidden', justifyContent: 'flex-end' }}>
            <Button
              color={'light'}
              style={{ display: 'flex', padding: '10px 16px', gap: '16px', width: 'fit-content', color: 'black' }}
              onClick={cancel}
            >
              Annuler
            </Button>
            <Button color={'pink'} style={{ width: 'fit-content', padding: '10px 32px' }} onClick={onSave}>
              Commenter
            </Button>
          </Row>
        </Row>
      </Column>
    </CommentInputWrapper>
  );
};

const Comment: FC<CommentProps> = ({
  comment,
  isChild,
  onReplySubmit,
  userData,
  onDelete,
  onEdit,
  canReply,
}) => {
  const [childrenShown, setChildrenShown] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [editing, setEditing] = useState(false);
  const pictureSize = isChild ? 42 : 64;

  const toggleChildren = () => setChildrenShown(!childrenShown);

  const onReplyPress = (comment: CommentEntity) => {
    !childrenShown && toggleChildren();
    setReplyCommentId(comment.commentId);
  };

  const onEditPress = () => setEditing(true);

  const onReplySend = ({ commentTxt, onSuccess }) => {
    onReplySubmit({
      commentId: replyCommentId,
      commentTxt,
      onSuccess: () => {
        !!onSuccess && onSuccess();
        setReplyCommentId(null);
      },
    });
  };

  const onCommentEdit = ({ commentTxt, onSuccess }) => {
    onEdit({
      commentId: comment.commentId,
      commentTxt,
      onSuccess: () => {
        setEditing(false);
        !!onSuccess && onSuccess();
      },
    });
  };

  const onDeleteClick = () => {
    if (deleteClicked) {
      return onCommentDelete();
    }
    setDeleteClicked(true);
  };

  const onCommentDelete = () => {
    onDelete({
      commentId: comment.commentId,
      commentTxt: comment.commentText,
      onSuccess: () => {
        setDeleteClicked(false);
      },
    });
  };
  const onReplyCancel = () => setReplyCommentId(null);
  const onEditCancel = () => setEditing(false);

  return !editing ? (

    <CommentWrapper>
      <CommentWrapper1>
        <ProfilePicture
          dark
          style={{
            margin: '0 10px 0 0', width: '54px', height: '53px'
          }}
          src={`${BASE_URL}images/${comment.coachPhotoUrl}`}
        />

        <BaseText
          style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: 'black' }}
        >
          {comment.fullName}
        </BaseText>

        {!!comment.children?.length && (
          <Button
            color={'transparent'}
            style={{ fontSize: 12, width: 'fit-content', padding: 0, color: 'black' }}
            onClick={toggleChildren}
          >
            {childrenShown ? 'Hide comments' : `Voir ${comment.children.length} commentaires`}
          </Button>
        )}
        {canReply && (
          <Button
            color={'transparent'}
            style={{
              fontSize: 12,
              width: 'fit-content',
              // padding: 0,
              color: 'black',
              textTransform: 'uppercase',
              display: 'flex',
              padding: '10px 16px',
              gap: '16px',
              border: '1px solid var(--dark-grey-50, #C5C5C9)',

            }}
            onClick={() => onReplyPress(comment)}
          >
            Répondre
          </Button>
        )}

      </CommentWrapper1>
      <CommentWrapper2>
        {comment.commentText}

        {comment.isMyComment && (
          <IconsWrapper>
            <IconWrapper clickable style={{ width: 15, opacity: 0.4 }} onClick={onEditPress}>
              <Icon src={PencilImg} style={{ filter: 'invert(1)' }} />
            </IconWrapper>
            <IconWrapper
              clickable
              style={{ width: 15, opacity: 0.4 }}
              onClick={onDeleteClick}
              data-for="deleteWarning"
              data-tip="WARNING! <br> You are about to delete this comment. <br> Click again to confirm"
              data-event="click"
              data-iscapture
              data-type="warning"
              data-clickable
            >
              <Icon src={CancelImg} style={{ filter: 'invert(1)' }} />
            </IconWrapper>
            <ReactTooltip id="deleteWarning" place="bottom" multiline />
          </IconsWrapper>
        )}

        {childrenShown && (
          <Column style={{ width: '100%', marginTop: 10 }}>
            {comment.children?.map((commentChild) => (
              <Comment
                userData={userData}
                comment={commentChild}
                onReplySubmit={onReplySubmit}
                onEdit={onEdit}
                onDelete={onDelete}
                isChild
              />
            ))}
          </Column>
        )}
        {!!replyCommentId && canReply && (
          <CommentInput
            isChild
            userData={userData}
            onCommentCreate={onReplySend}
            onCancel={onReplyCancel}
          />
        )}
      </CommentWrapper2>

    </CommentWrapper>
    /* <CommentWrapper>
       <Row style={{ alignItems: 'flex-start', width: '100%' }}>
         <ProfilePicture
           dark
           style={{
             margin: '0 10px 0 0', width: '54px', height: '53px'
           }}
           src={`${BASE_URL}images/${comment.coachPhotoUrl}`}
         />
         <Column style={{ width: '100%' }}>
           <Row style={{ position: 'relative', justifyContent: 'space-between' }}>
             <BaseText
               style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: 'black' }}
             >
               {comment.fullName}
             </BaseText>
             {!!comment.children?.length && (
               <Button
                 color={'transparent'}
                 style={{ fontSize: 12, width: 'fit-content', padding: 0, color: 'black' }}
                 onClick={toggleChildren}
               >
                 {childrenShown ? 'Hide comments' : `Voir ${comment.children.length} commentaires`}
               </Button>
             )}
             {canReply && (
               <Button
                 color={'transparent'}
                 style={{
                   fontSize: 12,
                   width: 'fit-content',
                   // padding: 0,
                   color: 'black',
                   textTransform: 'uppercase',
                   display: 'flex',
                   padding: '10px 16px',
                   gap: '16px',
                   border: '1px solid var(--dark-grey-50, #C5C5C9)',
 
                 }}
                 onClick={() => onReplyPress(comment)}
               >
                 Répondre
               </Button>
             )}
             {comment.isMyComment && (
               <IconsWrapper>
                 <IconWrapper clickable style={{ width: 15, opacity: 0.4 }} onClick={onEditPress}>
                   <Icon src={PencilImg} style={{ filter: 'invert(1)' }} />
                 </IconWrapper>
                 <IconWrapper
                   clickable
                   style={{ width: 15, opacity: 0.4 }}
                   onClick={onDeleteClick}
                   data-for="deleteWarning"
                   data-tip="WARNING! <br> You are about to delete this comment. <br> Click again to confirm"
                   data-event="click"
                   data-iscapture
                   data-type="warning"
                   data-clickable
                 >
                   <Icon src={CancelImg} style={{ filter: 'invert(1)' }} />
                 </IconWrapper>
                 <ReactTooltip id="deleteWarning" place="bottom" multiline />
               </IconsWrapper>
             )}
           </Row>
 
           <Column style={{ width: '100%', marginTop: 5 }}>
             <Row>
               <BaseText style={{ fontSize: 15 }}>{comment.commentText}</BaseText>
             </Row>
 
             {childrenShown && (
               <Column style={{ width: '100%', marginTop: 10 }}>
                 {comment.children?.map((commentChild) => (
                   <Comment
                     userData={userData}
                     comment={commentChild}
                     onReplySubmit={onReplySubmit}
                     onEdit={onEdit}
                     onDelete={onDelete}
                     isChild
                   />
                 ))}
               </Column>
             )}
             {!!replyCommentId && canReply && (
               <CommentInput
                 isChild
                 userData={userData}
                 onCommentCreate={onReplySend}
                 onCancel={onReplyCancel}
               />
             )}
           </Column>
         </Column>
       </Row>
     </CommentWrapper>*/
  ) : (
    <CommentInput
      userData={userData}
      onCommentCreate={onCommentEdit}
      onCancel={onEditCancel}
      comment={comment}
    />
  );
};

const Comments: FC<CommentsProps> = ({
  courseId,
  auth,
  createComment,
  getComments,
  replyToComment,
  editComment,
  deleteComment,
}) => {
  const userData = auth.userInfo?.userRole === 'COACH' ? auth.userDataFetched : auth.studentData;
  const [comments, setComments] = useState<CommentEntity[] | []>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    getComments({
      body: { courseId },
      actions: {
        onSuccess: (data: CommentEntity[]) => setComments(data),
      },
    });
  };

  const onCommentReply = ({ commentId, commentTxt, onSuccess }) => {
    replyToComment({
      body: { courseId, commentId, commentTxt },
      actions: {
        onSuccess: () => {
          fetchComments();
          !!onSuccess && onSuccess();
        },
      },
    });
  };
  const onCommentEdit = ({ commentId, commentTxt, onSuccess }) => {
    editComment({
      body: { courseId, commentId, commentTxt },
      actions: {
        onSuccess: () => {
          fetchComments();
          !!onSuccess && onSuccess();
        },
      },
    });
  };
  const onCommentDelete = ({ commentId, commentTxt, onSuccess }) => {
    deleteComment({
      body: { courseId, commentId, commentTxt },
      actions: {
        onSuccess: () => {
          fetchComments();
          !!onSuccess && onSuccess();
        },
      },
    });
  };

  const onCommentCreate = ({ commentTxt, onSuccess }) => {
    createComment({
      body: { courseId, commentTxt },
      actions: {
        onSuccess: () => {
          fetchComments();
          !!onSuccess && onSuccess();
        },
      },
    });
  };

  return (
    <Wrapper>
      {!!auth.authToken && <CommentInput userData={userData} onCommentCreate={onCommentCreate} />}
      {comments
        .filter((comment: CommentEntity) => !comment.isDeleted)
        .map((comment: CommentEntity) => (
          <Comment
            userData={userData}
            comment={comment}
            onReplySubmit={onCommentReply}
            onDelete={onCommentDelete}
            onEdit={onCommentEdit}
            canReply={!!auth.authToken}
          />
        ))}
    </Wrapper>
  );
};

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    createComment: (data) => dispatch(createCommentAction(data)),
    getComments: (data) => dispatch(getCommentsAction(data)),
    replyToComment: (data) => dispatch(replyToCommentAction(data)),
    editComment: (data) => dispatch(editCommentAction(data)),
    deleteComment: (data) => dispatch(deleteCommentAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Comments);

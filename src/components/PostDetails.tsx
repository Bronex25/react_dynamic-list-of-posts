/* eslint-disable react/display-name */
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import { deleteComment, getComments } from '../utils/functions';

type Props = {
  selectedPost: Post | null;
};

export const PostDetails: React.FC<Props> = memo(({ selectedPost }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const [isOpenCommentFm, setIsOpenCommentFm] = useState(false);
  const [commentsErrorMessage, setCommentsErrorMessage] = useState(false);
  const [writeAComment, setWriteAComment] = useState(false);
  const [noCommentsMess, setNoCommentsMess] = useState(false);
  const [commentsLoader, setCommentsLoader] = useState(false);

  const [actionError, setActionError] = useState('');

  const onClickAddComment = () => {
    setWriteAComment(false);
    setIsOpenCommentFm(true);
  };

  const updateComments = useCallback((newComment: Comment) => {
    setComments(prev => [...prev, newComment]);
    setNoCommentsMess(false);
  }, []);

  const handleDeleteComment = async (id: number) => {
    try {
      setComments(prev => {
        const result = prev.filter(com => com.id !== id);

        if (result.length === 0) {
          setNoCommentsMess(true);
        }

        return result;
      });
      await deleteComment(id);
    } catch (error) {
      setActionError('Unable to delete comment');
    }

    if (comments.length === 0) {
      setNoCommentsMess(true);
    }
  };

  useEffect(() => {
    setCommentsLoader(true);
    setNoCommentsMess(false);
    if (selectedPost) {
      getComments(selectedPost.id)
        .then(fetchedComments => {
          setComments(fetchedComments);
          setWriteAComment(true);
          if (fetchedComments.length === 0) {
            setNoCommentsMess(true);
          }
        })
        .catch(() => setCommentsErrorMessage(true))
        .finally(() => {
          setCommentsLoader(false);
        });
    }

    return () => {
      setIsOpenCommentFm(false);
      setComments([]);
    };
  }, [selectedPost]);

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">{`#${selectedPost?.id}: ${selectedPost?.title}`}</h2>

          <p data-cy="PostBody">{selectedPost?.body}</p>
        </div>

        <div className="block">
          {commentsLoader && <Loader />}

          {commentsErrorMessage && (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          )}

          {actionError && (
            <div className="notification is-danger" data-cy="CommentsError">
              {actionError}
            </div>
          )}

          {noCommentsMess && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {comments.length !== 0 && <p className="title is-4">Comments:</p>}

          {comments.map(comment => (
            <article
              className="message is-small"
              data-cy="Comment"
              key={comment.id}
            >
              <div className="message-header">
                <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                  {comment.name}
                </a>
                <button
                  data-cy="CommentDelete"
                  type="button"
                  className="delete is-small"
                  aria-label="delete"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  delete button
                </button>
              </div>

              <div className="message-body" data-cy="CommentBody">
                {comment.body}
              </div>
            </article>
          ))}

          {isOpenCommentFm && (
            <NewCommentForm
              selectedPostId={selectedPost?.id}
              updateComments={updateComments}
            />
          )}

          {writeAComment && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={onClickAddComment}
            >
              Write a comment
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

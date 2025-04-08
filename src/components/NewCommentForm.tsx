import React, { useRef, useState } from 'react';
import { addComment } from '../utils/functions';
import cn from 'classnames';
import { Comment } from '../types/Comment';

type Props = {
  selectedPostId: number | undefined;
  updateComments: (newComment: Comment) => void;
};

export const NewCommentForm: React.FC<Props> = ({
  selectedPostId,
  updateComments,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [errorMessage, setErrorMEssage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validate(name: string, email: string, body: string) {
    let isValid = true;

    if (name === '') {
      setNameError(true);
      isValid = false;
    }

    if (email === '') {
      setEmailError(true);
      isValid = false;
    }

    if (body === '') {
      setBodyError(true);
      isValid = false;
    }

    return isValid;
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setNameError(false);
    setEmailError(false);
    setBodyError(false);
    setErrorMEssage('');

    const name = nameRef.current?.value.trim() || '';
    const email = emailRef.current?.value.trim() || '';
    const body = bodyRef.current?.value.trim() || '';

    if (!selectedPostId || !validate(name, email, body)) {
      return;
    }

    const newComment = { postId: selectedPostId, name, body, email };

    setIsLoading(true);

    try {
      await addComment(newComment);
      if (bodyRef.current) {
        bodyRef.current.value = '';
      }
    } catch (error) {
      setErrorMEssage('Unable add a comment');
    } finally {
      updateComments({ id: 0, ...newComment });
      setIsLoading(false);
    }
  };

  const onClickClear = () => {
    setNameError(false);
    setBodyError(false);
    setEmailError(false);
    if (nameRef.current && emailRef.current && bodyRef.current) {
      nameRef.current.value = '';
      bodyRef.current.value = '';
      emailRef.current.value = '';
    }
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={onSubmit}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            ref={nameRef}
            id="comment-author-name"
            placeholder="Name Surname"
            className={cn('input', { 'is-danger': nameError })}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {nameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {nameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={cn('input', { 'is-danger': emailError })}
            ref={emailRef}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {emailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {emailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={cn('textarea', { 'is-danger': bodyError })}
            ref={bodyRef}
          />
        </div>

        {bodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={cn('button is-link', { 'is-loading': isLoading })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={onClickClear}
          >
            Clear
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="notification is-danger" data-cy="CommentsError">
          {errorMessage}
        </div>
      )}
    </form>
  );
};

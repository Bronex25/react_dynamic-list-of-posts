/* eslint-disable no-console */
import cn from 'classnames';
import { User } from './types/User';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import React, { useEffect, useState } from 'react';
import { getPosts, getUsers } from './utils/functions';
import { Post } from './types/Post';

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [mainErrorMessage, setMainErrorMessage] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [mainLoader, setMainLoader] = useState(false);
  const [noPostsMess, setNoPostsMess] = useState(false);

  const onClickPostButton = (post: Post) => {
    if (post.id !== selectedPost?.id) {
      setSelectedPost(post);
    } else {
      setSelectedPost(null);
    }
  };

  const handelUserSelect = (user: User) => {
    setPosts([]);
    setSelectedPost(null);
    setSelectedUser(user);
    setMainLoader(true);
    setNoPostsMess(false);
  };

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      getPosts(selectedUser.id)
        .then(fetchedPosts => {
          setPosts(fetchedPosts);
          if (fetchedPosts.length === 0) {
            setNoPostsMess(true);
          }
        })
        .catch(() => setMainErrorMessage(true))
        .finally(() => {
          setMainLoader(false);
        });
    }
  }, [selectedUser]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  handleUserSelect={handelUserSelect}
                  selectedUser={selectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {mainLoader && <Loader />}

                {mainErrorMessage && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {noPostsMess && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {posts.length !== 0 && (
                  <PostsList
                    posts={posts}
                    onClickPostButton={onClickPostButton}
                    selectedPost={selectedPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={cn('tile', 'is-parent', 'is-8-desktop', 'Sidebar', {
              'Sidebar--open': selectedPost,
            })}
          >
            {selectedPost && (
              <div className="tile is-child box is-success ">
                <PostDetails selectedPost={selectedPost} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

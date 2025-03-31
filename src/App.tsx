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

  const [errorMessage, setErrorMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [loader, setLoader] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(false);

  const handleOpenDropdown = () => {
    setOpenDropdown(prev => !prev);
  };

  const handelUserSelect = (user: User) => {
    setSelectedUser(user);
    handleOpenDropdown();
    setLoader(true);
  };

  useEffect(() => {
    if (selectedUser) {
      getPosts(selectedUser.id)
        .then(setPosts)
        .catch(() => setErrorMessage(true))
        .finally(() => setLoader(false));
    }
  }, [selectedUser]);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(e => console.log(e));
  }, [users]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  openDropdown={openDropdown}
                  handleOpenDropdown={handleOpenDropdown}
                  handleUserSelect={handelUserSelect}
                  selectedUser={selectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                <p data-cy="NoSelectedUser">
                  {!selectedUser && ' No user selected'}
                </p>

                {loader && <Loader />}

                {errorMessage && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {posts.length !== 0 ? (
                  <PostsList posts={posts} />
                ) : (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={cn(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              'Sidebar--open',
            )}
          >
            <div className="tile is-child box is-success ">
              <PostDetails selectedPost={selectedPost} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

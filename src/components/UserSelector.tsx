import React from 'react';
import { User } from '../types/User';

type Props = {
  users: User[];
  selectedUser: User | null;
  openDropdown: boolean;
  handleOpenDropdown: () => void;
  handleUserSelect: (user: User) => void;
};

export const UserSelector: React.FC<Props> = ({
  users,
  openDropdown,
  handleUserSelect,
  handleOpenDropdown,
  selectedUser,
}) => {
  return (
    <div data-cy="UserSelector" className="dropdown is-active">
      <div className="dropdown-trigger" onClick={handleOpenDropdown}>
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <span>{selectedUser ? selectedUser.name : 'Select user'}</span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      {openDropdown && (
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {users.map(user => (
              <a
                href={`#user-${user.id}`}
                className="dropdown-item"
                key={user.id}
                onClick={() => handleUserSelect(user)}
              >
                {user.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

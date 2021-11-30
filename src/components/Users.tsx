import React, {useState} from 'react';

import Badge from './Badge';
import {useUsers} from '../hooks/useUsers';

import {IUser} from '../models/users';
import {View} from '../models/view.enum';

export const Users = ({
    setView,
    setSelectedUser,
}: {
    setView: (view: View) => void;
    setSelectedUser: (userId: string) => void;
}) => {
    const users = useUsers();
    const [filterKey, setFilterKey] = useState('');

    const setActiveUser = (user: IUser) => () => {
        setSelectedUser(user.userId);
        setView(View.Conversation);
    };

    const search = (items) => {
        return items.filter(
            (user) =>
                !user.self &&
                user.userName.toLowerCase().includes(filterKey.toLowerCase()),
        );
    };
    return (
        <div className="flex-column" style={{height: '100%', width: '300px'}}>
            <div className="search-box">
                <div className="input-wrapper">
                    <i className="fa fa-search"></i>
                    <input
                        type="search"
                        value={filterKey}
                        onChange={(e) => setFilterKey(e.target.value)}
                        className="input"
                        placeholder="Search users..."
                    />
                </div>
            </div>
            <div className="flex-column">
                {/* TODO: Remove two search method calls. This way search gets called twice for every render  */}
                {search(users).length > 0 ? (
                    search(users).map((user) => (
                        <button
                            key={user.userName}
                            className={`user on-hover on-focus ${
                                user.isActive ? 'is-active' : ''
                            }`}
                            onClick={setActiveUser(user)}>
                            <div className="flex">
                                <Badge
                                    color={user.color}
                                    initial={user.initial}
                                    status={user.status}
                                />
                                <span className="text">{user.userName}</span>
                            </div>
                            {user.hasNewMessages ? (
                                <span className="unread-messages"></span>
                            ) : null}
                        </button>
                    ))
                ) : (
                    <span className="text">No users available!</span>
                )}
            </div>
        </div>
    );
};
export default Users;

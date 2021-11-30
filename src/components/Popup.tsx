import React from 'react';

import {useUsers} from '../hooks/useUsers';
import {useUpdateView, useView} from '../hooks/useView';
import {useSelectedUserId, useUpdateSelectedUserId} from '../hooks/useUserId';

import Users from './Users';
import Conversation from './Conversation';
import Badge from './Badge';
import {View} from '../models/view.enum';

export const Popup = ({
    setIsOpen,
}: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const users = useUsers();
    const view = useView();
    const setView = useUpdateView();
    const selectedUserId = useSelectedUserId();
    const updateSelectedUserId = useUpdateSelectedUserId();
    const selectedUser = users.find((_) => _.userId === selectedUserId);

    const setUser = (userId: string) => {
        updateSelectedUserId(userId);
    };

    return (
        <div className="flex-column" style={{height: '100%'}}>
            <div className="header">
                <div className="left">
                    {view !== View.Users && (
                        <i
                            className="fa fa-arrow-left pointer action-icon"
                            onClick={() => setView(View.Users)}></i>
                    )}
                    {view === View.Users && (
                        <span className="title">
                            {`Online (${
                                users.filter((_) => !_.self && _.status > 0)
                                    .length
                            })`}
                        </span>
                    )}
                    {view === View.Conversation && (
                        <span className="user-title">
                            <Badge
                                color={selectedUser.color}
                                initial={selectedUser.initial}
                                status={selectedUser.status}
                            />
                            {selectedUser.userName}
                        </span>
                    )}
                </div>
                <div className="right">
                    {view !== View.Settings && (
                        <i
                            className="fa fa-cog pointer action-icon"
                            onClick={() => setView(View.Settings)}></i>
                    )}
                    <i
                        className="fa fa-times pointer action-icon"
                        onClick={() => setIsOpen(false)}></i>
                </div>
            </div>
            <div className="flex overflow-scroll">
                {view === View.Users && (
                    <Users setView={setView} setSelectedUser={setUser} />
                )}
                {view === View.Conversation && selectedUser && (
                    <Conversation target={selectedUser} />
                )}
            </div>
        </div>
    );
};

export default Popup;

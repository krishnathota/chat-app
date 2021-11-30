import React, {useContext, useState} from 'react';

import {useAddMessage, useMessages} from '../hooks/useMessages';
import {useUpdateUserHasNewMessages, useUsers} from '../hooks/useUsers';
import {globals} from '../hooks/useGlobals';

import {SocketContext} from './Socket';
import Bubble from './Bubble';
import {useComponentDidMount, useComponentDidUpdate} from './Utils';

import {IUser} from '../models/users';

export const Conversation = ({target}: {target: IUser}): JSX.Element => {
    const socket = useContext(SocketContext);
    const users = useUsers();
    const messages = useMessages(target.userId);
    const addMessage = useAddMessage();
    const [text, setText] = useState('');
    const updateUserHasNewMessages = useUpdateUserHasNewMessages();
    const [userAttributes, setUserAttributes] = useState({});
    const updateUserAttributesFromMessages = () => {
        const _userIds = new Set(globals.userId);
        messages.forEach((_) => {
            _userIds.add(_.from);
            _userIds.add(_.to);
        });

        const _usersAttributes = {};
        users
            .filter((_) => _userIds.has(_.userId))
            .forEach(
                (_) =>
                    (_usersAttributes[_.userId] = {
                        color: _.color,
                        initial: _.initial,
                        status: _.status,
                    }),
            );
        setUserAttributes(_usersAttributes);
    };

    useComponentDidMount(() => {
        updateUserAttributesFromMessages();
        updateUserHasNewMessages(target.userId, false);
    });

    useComponentDidUpdate(() => {
        updateUserAttributesFromMessages();
    }, [target]);

    const handleSubmit = () => {
        if (text) {
            socket.emit('private message', {
                content: text,
                to: target.userId,
            });

            addMessage(target.userId, {
                content: text,
                fromSelf: true,
                from: globals.userId,
                to: target.userId,
            });
            setText('');
        }
    };

    return (
        <div className="flex-column" style={{height: '100%', width: '300px'}}>
            <div className="conversations flex-column">
                {messages.map((message, index) => {
                    const isFirst =
                        index === 0 ||
                        messages[index - 1].fromSelf !== message.fromSelf;
                    const isLast =
                        index === messages.length - 1 ||
                        messages[index + 1].fromSelf !== message.fromSelf;
                    return (
                        <Bubble
                            key={index}
                            userAttributes={userAttributes[message.from]}
                            message={message}
                            isFirst={isFirst}
                            isLast={isLast}></Bubble>
                    );
                })}
            </div>
            <div className="footer">
                <input
                    type="text"
                    placeholder="Enter message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                />
                <button onClick={handleSubmit}>
                    <i className="fa fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default Conversation;

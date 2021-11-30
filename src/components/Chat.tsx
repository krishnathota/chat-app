import React, {useContext, useState} from 'react';
import './Chat.scss';

import {
    useAddUsers,
    useUpdateUserHasNewMessages,
    useUpdateUserStatusOffline,
    useUsers,
} from '../hooks/useUsers';
import {useAddMessage} from '../hooks/useMessages';
import {useIsOpen, useUpdateIsOpen} from '../hooks/useIsOpen';
import {useView} from '../hooks/useView';
import {useSelectedUserId} from '../hooks/useUserId';

import {
    useComponentDidMount,
    useComponentDidUpdate,
    useComponentWillUnmount,
} from './Utils';

import Popup from './Popup';
import {SocketContext} from './Socket';

import {IUser} from '../models/users';
import {IMessage} from '../models/message';
import {View} from '../models/view.enum';
import {globals} from '../hooks/useGlobals';

export const Chat = ({ophubAPI}: {ophubAPI: any}) => {
    const socket = useContext(SocketContext);
    const users = useUsers();
    const addUsers = useAddUsers();
    const addMessage = useAddMessage();
    const isOpen = useIsOpen();
    const setIsOpen = useUpdateIsOpen();
    const view = useView();
    const selectedUserId = useSelectedUserId();
    const updateUserHasNewMessages = useUpdateUserHasNewMessages();

    const setOffline = useUpdateUserStatusOffline();
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string>(undefined);

    if (ophubAPI) {
        globals.config.serviceURL = 'http://ironman-dev.htclab.ge.com:3002/';
    } else {
        globals.config.serviceURL = 'http://localhost:3001';
    }

    useComponentDidMount(() => {
        //TODO: Fetch current logged in user
        if (ophubAPI) {
            ophubAPI.subscribe('userInfo', (name: string, userInfo: any) => {
                setToken(userInfo.token);
                setIsLoading(false);
            });
        } else {
            // TODO: Remove this
            const token =
                'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vaXJvbm1hbi1kZXYuaHRjbGFiLmdlLmNvbS91YWEvdG9rZW5fa2V5cyIsImtpZCI6ImtleS1pZC0xIiwidHlwIjoiSldUIn0.eyJqdGkiOiJiYWJkNGQ1YzE3MTU0NjE4OGY1NTk0YjM0NDJmZWI3YyIsInN1YiI6IjM3ZDM2ZWJlLWU2ZWEtNDY1Yy1iY2I4LThjM2EyNmQyZDRlNyIsInNjb3BlIjpbIm1lcy5hcHByb3ZhbF9jb2NrcGl0LnVzZXIiLCJtZXMucm91dGVfbWFuYWdlbWVudC51c2VyIiwibWVzLnNlY3VyaXR5X21hbmFnZW1lbnQudXNlciIsIm1lcy5ib21fZWRpdG9yLnVzZXIiLCJyb2xlcyIsIm1lcy5wcm9wZXJ0eV9kZWZpbml0aW9uLnVzZXIiLCJ1c2VyX2F0dHJpYnV0ZXMiLCJpcXAuY2xvdWR1c2VyIiwibWVzLmRvd250aW1lLnVzZXIiLCJtZXMucmVjZWl2aW5nX2luc3BlY3Rpb24udXNlciIsIm1lcy5vcGVyYXRpb25zLnVzZXIiLCJtZXMuYW5hbHlzaXMudXNlciIsIm1lcy5yZXBvcnRzLnVzZXIiLCJtZXMubXlfbWFjaGluZXMudXNlciIsIndlYmhtaS51c2VyIiwibWVzLmFjdGl2aXRpZXMudXNlciIsIm1lcy50aW1lX2Jvb2tpbmcudXNlciIsIm9wZW5pZCIsImlxcC51c2VyIiwibWVzLmdlbmVhbG9neS51c2VyIiwibWVzLmFkbWluaXN0cmF0b3IudXNlciIsIndlYmhtaS5hZG1pbmlzdHJhdG9yIiwicGFzc3dvcmQud3JpdGUiLCJtZXMubmNtX21hbmFnZW1lbnQudXNlciIsIm1lcy5jb25maWd1cmF0aW9uX21hbmFnZW1lbnQudXNlciIsIm1lcy53YXN0ZS51c2VyIiwibWVzLmVxdWlwbWVudC51c2VyIiwibWVzLndvcmtfcXVldWUudXNlciIsIm1lcy5wcm9jZXNzX29yZGVycy51c2VyIiwiaXFwLmRldmVsb3BlciIsIm1lcy5vcmRlcl9tYW5hZ2VtZW50LnVzZXIiXSwiY2xpZW50X2lkIjoiaXFwLWRldiIsImNpZCI6ImlxcC1kZXYiLCJhenAiOiJpcXAtZGV2IiwicmV2b2NhYmxlIjp0cnVlLCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwidXNlcl9pZCI6IjM3ZDM2ZWJlLWU2ZWEtNDY1Yy1iY2I4LThjM2EyNmQyZDRlNyIsIm9yaWdpbiI6InVhYSIsInVzZXJfbmFtZSI6IkNvbXhjbGllbnQiLCJlbWFpbCI6IkNvbXhjbGllbnRAeHguY29tIiwiYXV0aF90aW1lIjoxNjM3NjQ4OTE3LCJyZXZfc2lnIjoiNjRhZGEzM2QiLCJpYXQiOjE2Mzc2NDg5MTcsImV4cCI6MTYzNzY5MjExNywiaXNzIjoiaHR0cHM6Ly9pcm9ubWFuLWRldi5odGNsYWIuZ2UuY29tL3VhYS9vYXV0aC90b2tlbiIsInppZCI6InVhYSIsImF1ZCI6WyJtZXMuYWN0aXZpdGllcyIsIm1lcy5yb3V0ZV9tYW5hZ2VtZW50IiwiaXFwIiwibWVzLm15X21hY2hpbmVzIiwibWVzLmVxdWlwbWVudCIsIm1lcy50aW1lX2Jvb2tpbmciLCJtZXMuYWRtaW5pc3RyYXRvciIsImlxcC1kZXYiLCJwYXNzd29yZCIsIm1lcy5ib21fZWRpdG9yIiwibWVzLmFuYWx5c2lzIiwibWVzLm9wZXJhdGlvbnMiLCJtZXMucHJvcGVydHlfZGVmaW5pdGlvbiIsIm1lcy5hcHByb3ZhbF9jb2NrcGl0IiwibWVzLmRvd250aW1lIiwib3BlbmlkIiwibWVzLnJlY2VpdmluZ19pbnNwZWN0aW9uIiwibWVzLnJlcG9ydHMiLCJtZXMud2FzdGUiLCJtZXMub3JkZXJfbWFuYWdlbWVudCIsIm1lcy5nZW5lYWxvZ3kiLCJtZXMuY29uZmlndXJhdGlvbl9tYW5hZ2VtZW50IiwibWVzLnByb2Nlc3Nfb3JkZXJzIiwibWVzLndvcmtfcXVldWUiLCJtZXMubmNtX21hbmFnZW1lbnQiLCJtZXMuc2VjdXJpdHlfbWFuYWdlbWVudCIsIndlYmhtaSJdfQ.NJ23pLIfLAjC5UmVE1e8UDrpApKw85uOskIIN3Q7NSv9SXULZBLdxTDOPPb-HJHeqpdObtob02Xs_AaIokq_SI6DkiPoJYYpAh0uIeVm9OiyPdTSK9FlTyoJ-mTCuCswlljCSC5ktxt6li4iHtc9zn9XXe5pSxMb00KBuehP4G3W74bw-9falX1QFTWVia78mEAcwRYII9coKVH7wg0Ee49r2Mc3gW2f0wMQl_UUkDP7yzpz8SQOaxwVEBWO87F2BY7npsbaksfBlXq-cm79sUmkOvwdW9wQB1fyHDBIjNUckKZc6hzoFLNJZZ7eR4cOUwyvMJzgWMPQYNc1xneikA';

            setToken(token);
            setIsLoading(false);
        }
    });

    //#region Socket
    useComponentWillUnmount(() => {
        socket.off('connect_error');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('users');
        socket.off('user connected');
        socket.off('user disconnected');
        socket.off('private message');
    });

    useComponentDidUpdate(() => {
        if (token) {
            socket.onAny(onAny);
            socket.on('session', onSession);
            socket.on('users', (users: IUser[]) => addUsers(users));
            socket.on('user connected', (user: IUser) => addUsers([user]));
            socket.on('user disconnected', setOffline);
            socket.on(
                'private message',
                ({
                    content,
                    from,
                    to,
                    timestamp,
                }: {
                    content: string;
                    from: string;
                    to: string;
                    timestamp: string;
                }) => {
                    const fromSelf = globals.userId === from;
                    const _userId = fromSelf ? to : from;
                    const _message: IMessage = {
                        content,
                        fromSelf,
                        from,
                        to,
                        timestamp: new Date(timestamp),
                    };

                    addMessage(_userId, _message);
                    if (
                        !(view === View.Conversation && selectedUserId === from)
                    ) {
                        updateUserHasNewMessages(from, true);
                    }
                },
            );

            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
                socket.auth = {token, sessionId};
            } else {
                socket.auth = {token};
            }
            socket.connect();
        }
    }, [token]);

    const onAny = (event, ...args) => {
        console.log(event, args);
    };

    const onSession = ({
        sessionId,
        userId,
    }: {
        sessionId: string;
        userId: string;
    }) => {
        // attach the session ID to the next reconnection attempts
        socket.auth = {...socket.auth, sessionId};
        // store it in the localStorage
        localStorage.setItem('sessionId', sessionId);
        // save the ID of the user
        socket['userId'] = userId;
        globals.userId = userId;
    };

    //#endregion

    return (
        <div className="container">
            <div
                className="chat-container flex-column"
                style={{display: isOpen ? 'block' : 'none'}}>
                <Popup setIsOpen={setIsOpen} />
            </div>
            {
                !isLoading ? (
                    <div className="icon">
                        <i
                            className="fa fa-comments"
                            onClick={() => setIsOpen(!isOpen)}></i>
                        {!isOpen && users.some((_) => _.hasNewMessages) ? (
                            <span className="unread-notification"></span>
                        ) : null}
                    </div>
                ) : null //Show Spinner
            }
        </div>
    );
};

export default Chat;

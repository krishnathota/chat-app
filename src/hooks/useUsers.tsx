import {useCallback} from 'react';

import {useTrackedState, useSetDraft} from '../store';
import {globals} from '../hooks/useGlobals';

import {IUser} from '../models/users';

export const useUsers = () => {
    const state = useTrackedState();
    return state.users;
};

export const useUser = () => {
    const state = useTrackedState();
    return useCallback(
        (userId: string) => {
            return state.users.find((_) => _.userId === userId);
        },
        [state.users],
    );
};

/** Add user or update user's status and messages if exists*/
export const useAddUsers = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (users: IUser[]) => {
            setDraft((draft) => {
                users.forEach((user) => {
                    const _existing = draft.users.find(
                        (_) => _.userId === user.userId,
                    );
                    user.messages = user.messages.map((message) => ({
                        ...message,
                        fromSelf:
                            message.fromSelf || message.from === globals.userId,
                    }));

                    if (_existing) {
                        _existing.status = user.status;
                        _existing.messages = [...user.messages];
                    } else {
                        user = {
                            ...user,
                            ...getUserMetaData(user, globals.userId),
                        };
                        draft.users.push(user);
                    }
                });
            });
        },
        [setDraft],
    );
};

export const useUpdateUserStatusOffline = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (userId: string) => {
            setDraft((draft) => {
                const _existing = draft.users.find((_) => _.userId === userId);
                if (_existing) {
                    _existing.status = 0;
                }
            });
        },
        [setDraft],
    );
};

export const useUpdateUserHasNewMessages = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (userId: string, hasNewMessages = true) => {
            setDraft((draft) => {
                const _existing = draft.users.find((_) => _.userId === userId);
                if (_existing) {
                    _existing.hasNewMessages = hasNewMessages;
                }
            });
        },
        [setDraft],
    );
};

const getUserMetaData = (user: IUser, currentUserId: string) => ({
    initial: initial(user.userName),
    color: randomColor(),
    self: user.userId === currentUserId,
});

const randomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}deg, 28%, 28%)`;

const initial = (userName: string): string => {
    const _split = userName.replace(/([A-Z])/g, ' $1').match(/(\b\S)?/g);
    if (_split) {
        const _initial = _split.join('').match(/(^\S|\S$)?/g);
        if (_initial) return _initial.join('').toUpperCase();
    }
    return '';
};

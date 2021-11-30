import {useSetDraft, useTrackedState} from '../store';
import {IMessage} from '../models/message';
import {useCallback} from 'react';
import {globals} from '../hooks/useGlobals';

export const useMessages = (userId: string) => {
    const state = useTrackedState();
    return state.users.find((user) => user.userId === userId).messages;
};

export const useAddMessage = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (targetUserId: string, message: IMessage) => {
            setDraft((draft) => {
                message.fromSelf =
                    message.fromSelf || message.from === globals.userId;
                const user = draft.users.find((_) => _.userId === targetUserId);
                user.messages.push(message);
            });
        },
        [setDraft],
    );
};

import {useSetDraft, useTrackedState} from '../store';
import {useCallback} from 'react';

export const useUserId = () => {
    const state = useTrackedState();
    return state.userId;
};

export const useSetUserId = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (userId: string) => {
            setDraft((draft) => {
                draft.userId = userId;
            });
        },
        [setDraft],
    );
};

export const useSelectedUserId = () => useTrackedState().selectedUserId;

export const useUpdateSelectedUserId = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (selectedUserId: string) => {
            setDraft((draft) => {
                draft.selectedUserId = selectedUserId;
            });
        },
        [setDraft],
    );
};

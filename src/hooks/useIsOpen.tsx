import {useSetDraft, useTrackedState} from '../store';
import {useCallback} from 'react';

export const useIsOpen = () => useTrackedState().isOpen;

export const useUpdateIsOpen = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (isOpen: boolean) => {
            setDraft((draft) => {
                draft.isOpen = isOpen;
            });
        },
        [setDraft],
    );
};

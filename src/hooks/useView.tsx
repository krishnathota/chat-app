import {useSetDraft, useTrackedState} from '../store';
import {View} from '../models/view.enum';
import {useCallback} from 'react';

export const useView = () => useTrackedState().view;

export const useUpdateView = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (view: View) => {
            setDraft((draft) => {
                draft.view = view;
            });
        },
        [setDraft],
    );
};

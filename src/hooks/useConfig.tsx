import {useSetDraft, useTrackedState} from '../store';
import {Config} from '../models/config';
import {useCallback} from 'react';

export const useConfig = () => useTrackedState().config;

export const useUpdateConfig = () => {
    const setDraft = useSetDraft();
    return useCallback(
        (config: Config) => {
            setDraft((draft) => {
                draft.config = {...draft.config, ...config};
            });
        },
        [setDraft],
    );
};

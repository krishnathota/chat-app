import {useState, useCallback} from 'react';
import {createContainer} from 'react-tracked';
import produce, {Draft} from 'immer';
import {IUser} from './models/users';
import {View} from './models/view.enum';
import {Config} from './models/config';

export type State = {
    users: IUser[];
    view: View;
    isOpen: boolean;
    userId: string;
    selectedUserId: string;
    config: Config;
};

const initialState: State = {
    users: [],
    view: View.Users,
    isOpen: false,
    selectedUserId: undefined,
    userId: 'test',
    config: {serviceURL: 'http://localhost:3001'},
};

const useValue = () => useState(initialState);

const {
    Provider,
    useTrackedState,
    useUpdate: useSetState,
} = createContainer(useValue);

// * Implemented state using -> https://react-tracked.js.org/docs/tutorial-03/
const useSetDraft = () => {
    const setState = useSetState();
    return useCallback(
        (draftUpdater: (draft: Draft<State>) => void) => {
            setState(produce(draftUpdater));
        },
        [setState],
    );
};

export {Provider, useTrackedState, useSetDraft};

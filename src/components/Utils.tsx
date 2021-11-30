/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef} from 'react';

export const useComponentDidMount = (handler) => useEffect(() => handler(), []);

export const useComponentDidUpdate = (handler, deps) => {
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        return handler();
    }, deps);
};

export const useComponentWillUnmount = (handler) =>
    useEffect(() => handler, []);

export const cloneDeep = (object: any) => JSON.parse(JSON.stringify(object));

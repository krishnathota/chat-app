import {Provider} from './store';
import React from 'react';
import ReactDOM from 'react-dom';
import Chat from './components/Chat';
import {SocketContext, socket} from './components/Socket';
import {globals} from './hooks/useGlobals';

let ophubAPI: any;
try {
    ophubAPI = eval('EMBED');
    globals.config.serviceURL = 'http://ironman-dev.htclab.ge.com:3002/';
} catch {
    console.warn('EMBED unavailable');

    globals.config.serviceURL = 'http://localhost:3001';
}

const _element: HTMLElement[] = ophubAPI
    ? ophubAPI.getRootElement()
    : undefined;

// Rendering in an element if EMBED is not available. Used when ran independently.
const root = _element ? _element[0] : document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <SocketContext.Provider value={socket}>
            <Provider>
                <Chat ophubAPI={ophubAPI} />
            </Provider>
        </SocketContext.Provider>
    </React.StrictMode>,
    root,
);

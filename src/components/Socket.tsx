import {io} from 'socket.io-client';
import {createContext} from 'react';
import {globals} from '../hooks/useGlobals';

export const socket = io(globals.config.serviceURL, {autoConnect: false});
export const SocketContext = createContext(socket);

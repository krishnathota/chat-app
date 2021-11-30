import {IMessage} from './message';

export interface IUser {
    self: boolean;
    userName: string;
    status: number;
    initial?: string;
    color?: string;
    isActive?: boolean;
    userId: string;
    hasNewMessages: boolean;
    messages: IMessage[];
}

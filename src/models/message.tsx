export interface IMessage {
    content: string;
    from?: string;
    to?: string;
    timestamp?: Date;
    fromSelf?: boolean;
}

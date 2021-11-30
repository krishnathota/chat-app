import React from 'react';

import Badge from './Badge';

import {IMessage} from '../models/message';

const Bubble = ({
    message,
    isFirst,
    isLast,
    userAttributes,
}: {
    message: IMessage;
    isFirst: boolean;
    isLast: boolean;
    userAttributes: {color: string; initial: string; status: number};
}) => {
    return message && userAttributes ? (
        <div className={`bubble-wrapper ${message.fromSelf ? 'own' : 'other'}`}>
            {!message.fromSelf ? (
                <div className="badge-container">
                    {isFirst ? <Badge {...userAttributes} /> : null}
                </div>
            ) : null}
            <span
                className={`bubble ${message.fromSelf ? 'own' : 'other'} ${
                    isFirst ? 'first' : ''
                } ${isLast && !isFirst ? 'last' : ''}`}
                style={{backgroundColor: userAttributes.color}}>
                {message.content}
            </span>
        </div>
    ) : null;
};
export default React.memo(Bubble);

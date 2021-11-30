import React from 'react';

const Badge = ({
    color,
    status,
    initial,
}: {
    color: string;
    initial: string;
    status: number;
}) => {
    return (
        <div className="user-badge-container">
            <span
                className="user-badge"
                data-badge-initials={initial}
                data-badge-background-color={color}></span>
            <i
                className={`fa ${
                    status === 1
                        ? 'fa-check-circle status-available'
                        : status === 2
                        ? 'fa-exclamation-circle status-away'
                        : 'fa-times-circle status-offline'
                } user-status`}></i>
        </div>
    );
};
export default React.memo(Badge);

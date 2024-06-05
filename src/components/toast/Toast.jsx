import React, { useEffect, useState } from 'react';

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="toast toast-top toast-end">
            <div className="alert alert-success">
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;

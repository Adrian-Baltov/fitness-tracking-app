import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg z-50">
                <h2 className="text-xl mb-4">Are you sure you want to delete this goal?</h2>
                <div className="flex justify-end space-x-2">
                    <button onClick={onConfirm} className="btn btn-error">Yes</button>
                    <button onClick={onClose} className="btn btn-secondary">No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

import React from 'react';
import { Dialog } from 'primereact/dialog';

const ConfirmationModal = ({ isOpen = false, onClose, onConfirm }) => {

    return (
        <Dialog visible={isOpen} onHide={onClose}>
            <h2 className="text-xl mb-4">Are you sure you want to delete this?</h2>
            <div className="flex justify-end space-x-2">
                <button onClick={onConfirm} className="btn btn-error">Yes</button>
                <button onClick={onClose} className="btn btn-secondary">No</button>
            </div>
        </Dialog>
    );
};

export default ConfirmationModal;

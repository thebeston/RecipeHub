import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

function ConfirmModal({ show, onConfirm, onCancel, title, message, confirmText = "Delete", cancelText = "Cancel" }) {
  if (!show) return null;

  return (
    <>
      
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 10,
          borderRadius: '0.375rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={onCancel}
      >
        
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            maxWidth: '400px',
            width: '100%',
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
        >
          <div className="modal-content shadow-lg border-0">
            
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title d-flex align-items-center">
                <FaExclamationTriangle className="text-warning me-2" size={24} />
                {title}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onCancel}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body py-4">
              <p className="mb-0">{message}</p>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;

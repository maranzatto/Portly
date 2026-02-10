import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  };

  return (
    <div 
      className={`alert ${getAlertClass()} fade show position-fixed`} 
      style={{ 
        top: '10px', 
        right: '10px', 
        zIndex: '9999', 
        width: 'clamp(280px, calc(100vw - 20px), 520px)',
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '12px 16px',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxHeight: '80vh',
        overflow: 'auto'
      }} 
      role="alert"
    >
      <div className="d-flex align-items-start gap-3">
        <i className={`bi ${getIcon()}`} style={{ fontSize: '16px', flexShrink: 0, marginTop: '2px' }}></i>
        <div className="flex-grow-1" style={{ fontSize: '13px', fontWeight: '500', lineHeight: '1.5', minWidth: 0 }}>
          {message}
        </div>
        <button 
          type="button" 
          onClick={onClose}
          style={{ 
            background: 'none',
            border: 'none',
            padding: '4px',
            margin: '-4px -8px -4px 0',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'inherit',
            opacity: 0.6,
            transition: 'opacity 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.opacity = '0.6';
          }}
          aria-label="Fechar notificação"
        >
          <i className="bi bi-x" style={{ fontSize: '16px' }}></i>
        </button>
      </div>
    </div>
  );
};

export default Notification;

import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'error':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl border-2 ${getBgColor()} transform transition-all duration-300 scale-100 font-sans`}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="text-4xl">{getIcon()}</div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-center text-gray-800 mb-3 font-sans">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-center text-gray-600 mb-6 leading-relaxed font-sans">
          {message}
        </p>
        
        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${getButtonColor()} font-sans`}
          >
            Đã hiểu
          </button>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationModal; 
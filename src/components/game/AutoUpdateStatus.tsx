'use client';

import { useState, useEffect } from 'react';
import { FaSync, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface AutoUpdateStatus {
  isPolling: boolean;
  lastModified: number;
  lastModifiedFormatted: string;
}

export default function AutoUpdateStatus() {
  const [status, setStatus] = useState<AutoUpdateStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/auto-update');
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      }
    } catch (error) {
      console.error('❌ Lỗi lấy trạng thái auto-update:', error);
    }
  };

  const forceCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auto-update', { method: 'PATCH' });
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Force check result:', result.message);
        // Refresh status sau khi force check
        setTimeout(fetchStatus, 1000);
      }
    } catch (error) {
      console.error('❌ Lỗi force check:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh status mỗi 30 giây
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-amber-200 shadow-lg z-50">
      <div className="flex items-center space-x-2 text-xs">
        <div className="flex items-center space-x-1">
          {status.isPolling ? (
            <FaCheckCircle className="text-green-500 animate-pulse" />
          ) : (
            <FaExclamationTriangle className="text-yellow-500" />
          )}
          <span className="text-amber-700 font-medium">
            {status.isPolling ? 'Auto-Update' : 'Manual'}
          </span>
        </div>
        
        <button
          onClick={forceCheck}
          disabled={loading}
          className="p-1 rounded hover:bg-amber-100 transition-colors disabled:opacity-50"
          title="Kiểm tra thay đổi ngay lập tức"
        >
          <FaSync className={`text-amber-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {status.lastModified > 0 && (
        <div className="text-xs text-amber-600 mt-1">
          Cập nhật: {status.lastModifiedFormatted}
        </div>
      )}
    </div>
  );
} 
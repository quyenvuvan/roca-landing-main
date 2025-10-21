'use client';

import { useState } from 'react';
import { FaMobile, FaTimes, FaSearch } from 'react-icons/fa';
import { Player } from '@/types/game';

interface PhoneCheckFormProps {
  onPlayerFound: (player: Player) => void;
  onPlayerNotFound: (phone: string) => void;
  onCancel: () => void;
  onCheckPhone: (phone: string) => Promise<Player | null>;
}

export default function PhoneCheckForm({ onPlayerFound, onPlayerNotFound, onCancel, onCheckPhone }: PhoneCheckFormProps) {
  const [phone, setPhone] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    
    if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      const player = await onCheckPhone(phone.trim());
      
      if (player) {
        onPlayerFound(player);
      } else {
        onPlayerNotFound(phone.trim());
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (value: string) => {
    setPhone(value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-amber-200 font-sans">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMobile className="text-2xl text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-800 mb-2 font-sans">
            Kiểm Tra Số Điện Thoại
          </h2>
          <p className="text-gray-600 font-sans">
            Nhập số điện thoại để kiểm tra tài khoản
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 font-sans">
              <FaMobile className="inline mr-2 text-amber-700" />
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handleInputChange(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors bg-white text-gray-900 placeholder-gray-500 font-sans ${
                error ? 'border-red-500' : 'border-gray-400'
              }`}
              placeholder="Nhập số điện thoại của bạn"
              disabled={isChecking}
            />
            {error && (
              <p className="text-red-600 text-sm mt-1 font-medium font-sans">{error}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isChecking}
              className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center font-sans"
            >
              <FaTimes className="mr-2" />
              Hủy
            </button>
            <button
              type="submit"
              disabled={isChecking}
              className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center font-sans"
            >
              {isChecking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <FaSearch className="mr-2" />
                  Kiểm tra
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
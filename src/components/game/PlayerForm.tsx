'use client';

import { useState } from 'react';
import { FaUser, FaMobile, FaMapMarked, FaVenus, FaMars, FaCalendarAlt, FaTimes } from 'react-icons/fa';

interface PlayerFormProps {
  onSubmit: (playerData: {
    name: string;
    phone: string;
    address?: string;
    gender?: string;
    dateOfBirth?: string;
  }) => void;
  onCancel: () => void;
  phone?: string;
}

export default function PlayerForm({ onSubmit, onCancel, phone = '' }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: phone,
    address: '',
    gender: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Họ và tên */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3 font-sans">
          <FaUser className="inline mr-2 text-amber-700" />
          Họ và tên *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors bg-white text-gray-900 placeholder-gray-500 font-sans ${
            errors.name ? 'border-red-500' : 'border-gray-400'
          }`}
          placeholder="Nhập họ và tên của bạn"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1 font-medium font-sans">{errors.name}</p>
        )}
      </div>

      {/* Số điện thoại */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3 font-sans">
          <FaMobile className="inline mr-2 text-amber-700" />
          Số điện thoại *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors bg-white text-gray-900 placeholder-gray-500 font-sans ${
            errors.phone ? 'border-red-500' : 'border-gray-400'
          }`}
          placeholder="Nhập số điện thoại"
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mt-1 font-medium font-sans">{errors.phone}</p>
        )}
      </div>

      {/* Địa chỉ */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3 font-sans">
          <FaMapMarked className="inline mr-2 text-amber-700" />
          Địa chỉ
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors bg-white text-gray-900 placeholder-gray-500 font-sans"
          placeholder="Nhập địa chỉ (không bắt buộc)"
        />
      </div>


      {/* Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center font-sans"
        >
          <FaTimes className="mr-2" />
          Hủy
        </button>
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white py-3 rounded-lg font-bold transition-all duration-300 font-sans"
        >
          Đăng Ký
        </button>
      </div>
    </form>
  );
} 
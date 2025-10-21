"use client";

import Image from 'next/image';
import { useState } from 'react';


export default function Home() {
  const [form, setForm] = useState({ name: '', age: '', phone: '', schedule: '', description: '' });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [k: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Tên là bắt buộc';
    if (!form.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const experienceData = {
          name: form.name.trim(),
          age: form.age.trim(),
          phone: form.phone.trim(),
          schedule: form.schedule,
          description: form.description.trim(),
          timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
        };

        const response = await fetch('/api/send-experience-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(experienceData),
        });

        const result = await response.json();

        if (result.success) {
          console.log('Đăng ký trải nghiệm thành công:', form);
          alert('Cám ơn, yêu cầu của bạn đã được ghi nhận và gửi đến đội ngũ tư vấn!');
          setForm({ name: '', age: '', phone: '', schedule: '', description: '' });
        } else {
          console.error('Lỗi gửi email:', result.error);
          alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại hoặc liên hệ trực tiếp.');
        }
      } catch (error) {
        console.error('Lỗi không mong muốn:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center" style={{ background: 'var(--background)' }}>
      {/* Hero: full viewport image directly under header */}
  <figure className="relative w-full h-[40vh] m-0 rounded-2xl overflow-hidden">
        <Image src="/Screenshot 2025-10-20 160916.png" alt="Giới thiệu" fill className="object-cover object-center" priority />
      </figure>

      {/* Registration form: centered card */}
      <section id="experience-form" className="w-full flex justify-center px-4 py-10">
  <div className="w-full max-w-3xl rounded-xl shadow-xl p-6" style={{background: 'linear-gradient(135deg, #e6ffe6 60%, #fff 100%)'}}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-black">Đăng kí trải nghiệm</h2>

            <label className="block">
              <span className="block text-sm font-medium text-black">Tên</span>
              <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-3 py-2 border rounded text-black" placeholder="Tên của bạn" />
              {errors.name && <small className="text-red-600">{errors.name}</small>}
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-black">Tuổi</span>
              <input value={form.age} onChange={(e) => handleChange('age', e.target.value)} className="w-full px-3 py-2 border rounded text-black" placeholder="Tuổi" type="number" min={0} />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-black">Số điện thoại</span>
              <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full px-3 py-2 border rounded text-black" placeholder="Số điện thoại" />
              {errors.phone && <small className="text-red-600">{errors.phone}</small>}
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-black">Đặt lịch</span>
              <input value={form.schedule} onChange={(e) => handleChange('schedule', e.target.value)} className="w-full px-3 py-2 border rounded text-black" type="datetime-local" />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-black">Mô tả (triệu chứng)</span>
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full px-3 py-2 border rounded text-black" placeholder="Ví dụ: đau cổ vai gáy, đau lưng" rows={4} />
            </label>

            <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Đang gửi...' : 'Gửi đăng kí'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

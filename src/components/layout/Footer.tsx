'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isSpinWheelPage = pathname === '/spin-wheel';

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isSpinWheelPage) {
      e.preventDefault();
      window.location.href = '/';
    }
  };

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    if (isSpinWheelPage) {
      e.preventDefault();
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
  <footer id="contact" className="bg-amber-800 text-white border-t border-amber-700 rounded-2xl">
      <div className="container mx-auto px-4 py-1 md:py-4">
        <div className="flex justify-center">

          {/* Contact Info */}
          <div className="flex flex-col items-center text-center justify-center mx-auto max-w-md w-full">
            <h4 className="font-bold text-lg md:text-xl mb-4 md:mb-6 text-white">Thông Tin Liên Hệ</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              <li className="text-gray-300 flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-2">
                <span className="text-blue-400">📍</span>
                <span className="text-center md:text-left">Số 1 ngõ 13 Hoàng Diệu - Thành Đông - Hải Phòng</span>
              </li>
              <li className="text-gray-300 flex items-center justify-center space-x-2">
                <span className="text-blue-400">📞</span>
                <a href="tel:+84947858866" className="hover:text-blue-400 transition-colors">(+84) 0912. 180. 588</a>
              </li>
              <li className="text-gray-300 flex items-center justify-center space-x-2">
                <span className="text-blue-400">🕒</span>
                <span>10:00 - 22:00 hàng ngày</span>
              </li>
            </ul>
          </div>

          {/* QR Code and Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 md:mt-0 w-full max-w-4xl">
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <h5 className="font-semibold text-white mb-2">QR Code</h5>
              <Image
                src="/z7135190931177_1d545e68cd16ca8f9616f9ee6e86d443.jpg"
                alt="QR Code for location"
                width={120}
                height={120}
                className="rounded-lg"
              />
            </div>

            {/* Embedded Map */}
            <div className="flex flex-col items-center justify-center">
              <h5 className="font-semibold text-white mb-2">Bản đồ</h5>
              <div className="w-full max-w-xs md:max-w-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1234!2d106.6833!3d20.8449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7b8b8b8b8b8b%3A0x1234567890abcdef!2sVimos+Mart+c%E1%BB%ADa+h%C3%A0ng+ti%E1%BB%87n+%C3%ADch+Dr+Giang!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title="Location Map"
                ></iframe>
              </div>
              <p className="text-xs text-gray-300 mt-2 text-center">Nhấn vào bản đồ để xem chi tiết</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-6 pt-4">
          <div className="text-center">
            <div className="text-gray-400 text-base">
              <p>&copy; {currentYear} Vimos Mart Dr Giang</p>
              <p className="mt-2 text-sm">Thiết kế bởi <span className="text-blue-400">@GiftyTech</span></p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

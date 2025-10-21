'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  <footer id="contact" className="bg-amber-800 text-white border-t border-amber-700 rounded-2xl ">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-center">

          {/* Contact Info */}
          <div className="flex flex-col items-center text-center justify-center mx-auto max-w-md w-full">
            <h4 className="font-bold text-xl mb-6 text-white">Thông Tin Liên Hệ</h4>
            <ul className="space-y-4 text-base">
              <li className="text-gray-300 flex items-center justify-center space-x-2">
                <span className="text-blue-400">📍</span>
                <span>Số 1 ngõ 13 Hoàng Diệu - Thành Đông - Hải Phòng</span>
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

          {/* Special Offers */}
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
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
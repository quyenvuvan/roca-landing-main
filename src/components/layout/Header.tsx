"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
  <header className="bg-amber-800 rounded-2xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-white">
          Vimos Mart cửa hàng tiện ích Dr Giang
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-amber-100">
            Trang chủ
          </Link>
          <Link href="/products" className="text-white hover:text-amber-100">
            Sản phẩm
          </Link>
          <Link href="/combos" className="text-white hover:text-amber-100">
            Bộ sản phẩm
          </Link>
          <Link href="/#contact" className="bg-black text-white px-4 py-2 rounded">
            Liên hệ
          </Link>
        </nav>

        <button
          className="md:hidden text-white"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((s) => !s)}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-amber-700/80 border-t mt-16">
            <nav className="flex flex-col p-4 space-y-2">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-white">
                Trang chủ
              </Link>
              <Link href="/products" onClick={() => setIsOpen(false)} className="text-white font-semibold">
                Sản phẩm
              </Link>
              <Link href="/combos" onClick={() => setIsOpen(false)} className="text-white">
                Bộ sản phẩm
              </Link>
              <Link href="/#contact" onClick={() => setIsOpen(false)} className="text-white">
                Liên hệ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

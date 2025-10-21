
import Image from 'next/image';
import Link from 'next/link';

// Import product data from products page
// Import product data from products page
import { PRODUCTS } from '../products/page';

const COMBOS = [
  {
    name: "Chăm sóc Sức khỏe Hệ Vận Động Xương Khớp",
    products: [
      "Hoạt Huyết Dưỡng Não VIMOS",
      "Vượng Cốt Khí VIMOS",
      "Xịt XK VIMOS",
      "GOBI KIDS",
      "Trà Tam Thất",
      "Viên Tiểu Đêm"
    ]
  },
  {
    name: "Chăm sóc Sức khỏe Hệ Tiêu Hóa",
    products: [
      "Dạ Dày VIMOS",
      "Viên Cao GOBI",
      "Giải Độc Gan VIMOS Plus",
      "Trinh Nữ Hoàng Cung",
      "Trà Tam Thất"
    ]
  },
  {
    name: "Chăm sóc Sức khỏe Hệ Hô Hấp",
    products: [
      "Xịt Họng Keo Ong",
      "Xịt Mũi Xoang HDV",
      "Đông Trùng Ích Phế",
      "Hoạt Huyết Dưỡng Não VIMOS"
    ]
  },
  {
    name: "Chăm sóc Sức khỏe cho Phụ Nữ",
    products: [
      "Tố Nữ VIMOS",
      "Hoạt Huyết Dưỡng Não VIMOS",
      "Giải Độc Gan VIMOS Plus",
      "Trinh Nữ Hoàng Cung"
    ]
  },
  {
    name: "Chăm sóc Sức khỏe Toàn diện và Dự phòng các Bệnh Mãn tính",
    products: [
      "Viên Đường Huyết",
      "Hoạt Huyết Dưỡng Não VIMOS",
      "GOBI KIDS",
      "Trà Tam Thất",
      "Giải Độc Gan VIMOS Plus"
    ]
  },
  {
    name: "Chăm sóc Mẹ & Bé",
    products: [
      "Trinh Nữ Hoàng Cung",
      "GOBI KIDS",
      "Nutri Sữa Non",
      "Tố Nữ VIMOS"
    ]
  },
  {
    name: "Dinh Dưỡng Vimos Chăm sóc Sức Khỏe Gia Đình Thường Ngày",
    products: [
      "Nutri Sữa Non",
      "Glumilk",
      "GOBI KIDS"
    ]
  },
  {
    name: "Chăm sóc Sức Khỏe Gia Đình Thường Ngày (Khác)",
    products: [
      "Xịt Họng Keo Ong",
      "Nước Giặt Xả Cao Cấp VNapo",
      "Xịt Mũi Xoang HDV",
      "Trà Tam Thất"
    ]
  }

];

function getProductInfo(name: string) {
  return PRODUCTS.find((p: { name: string }) => p.name.toLowerCase() === name.toLowerCase());
}

export default function CombosPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Bộ sản phẩm (Combos)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {COMBOS.map((combo, idx) => {
          // Calculate total price and discount
          const productInfos = combo.products.map(getProductInfo).filter((prod): prod is { name: string; description: string; price: number; image_url: string } | { name: string; description: string; price: string; image_url: string } => !!prod);
          const total = productInfos.reduce((sum, prod) => {
            if (typeof prod.price === 'number') return sum + prod.price;
            // If price is a range, take the lower bound
            if (typeof prod.price === 'string') {
              const match = prod.price.match(/(\d+)/);
              return match ? sum + parseInt(match[1], 10) : sum;
            }
            return sum;
          }, 0);
          const discount = Math.round(total * 0.05);
          const finalPrice = total - discount;
          return (
            <section key={idx} className="border rounded-xl p-4 shadow" style={{background: 'linear-gradient(135deg, #fff 60%, #ffe0f0 100%)'}}>
              <h2 className="font-semibold text-xl mb-4 text-amber-700">{combo.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {combo.products.map((prodName, pidx) => {
                  const prod = getProductInfo(prodName);
                  if (!prod) return (
                    <div key={pidx} className="border rounded p-2 bg-gray-50 text-gray-500">{prodName}</div>
                  );
                  const price = typeof prod.price === 'number' ? prod.price.toLocaleString('vi-VN') + '₫' : prod.price;
                  const imgSrc = prod.image_url || '/vercel.svg';
                  return (
                    <article key={pidx} className="border rounded-xl p-3 shadow hover:shadow-lg transition" style={{background: 'linear-gradient(135deg, #e6ffe6 60%, #fff 100%)'}}>
                      <div className="h-32 w-full bg-gray-100 mb-2 flex items-center justify-center rounded">
                        <Image src={imgSrc} alt={prod.name} width={120} height={90} className="object-cover rounded" />
                      </div>
                      <h3 className="text-black font-semibold text-base mb-1">{prod.name}</h3>
                      <p className="text-gray-600 text-xs mb-1">{prod.description}</p>
                      <p className="text-amber-700 font-bold text-sm">{price}</p>
                      <div className="mt-2">
                        <Link href={`/products/${PRODUCTS.findIndex((p: { name: string }) => p.name === prod.name)}`} className="inline-block bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition text-xs">
                          Xem chi tiết
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
              
            </section>
          );
        })}
      </div>
    </main>
  );
}

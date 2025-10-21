import Image from 'next/image';
import Link from 'next/link';

export const PRODUCTS = [
   {
    "name": "Xịt XK VIMOS",
    "description": "Dùng xoa bóp hoặc massage ngoài da. Giúp làm ấm và nóng da nhanh chóng, góp phần đem lại cảm giác thoải mái, dễ chịu khi sử dụng.",
    "price": 150000,
    "image_url": "/xịt xk vimos.png"
  },
  {
    "name": "Dạ Dày VIMOS",
    "description": "Hỗ trợ giảm acid dịch vị dạ dày, giúp bảo vệ niêm mạc dạ dày. Hỗ trợ giảm triệu chứng: đau thượng vị, đầy bụng, ợ hơi, ợ chua do viêm loét dạ dày, tá tràng.",
    "price": 390000,
    "image_url": "/dạ dày vimos.png"
  },
  {
    "name": "GOBI KIDS",
    "description": "Giúp bổ sung canxi, acid amin, vitamin, DHA, khoáng chất và các dưỡng chất thiết yếu. Hỗ trợ giúp trẻ ăn ngon miệng, tăng cường hấp thu dưỡng chất, giúp xương, răng chắc khỏe, phát triển chiều cao, nâng cao sức đề kháng và sức khỏe.",
    "price": 230000,
    "image_url": "/gobi-kids.png"
  },
  {
    "name": "GOBI MUM",
    "description": "Giúp bổ sung vitamin, acid amin, canxi, DHA và khoáng chất. Hỗ trợ duy trì và tăng cường sức khỏe, nâng sức đề kháng, giảm nguy cơ thiếu máu cho phụ nữ chuẩn bị mang thai, giai đoạn thai kỳ cho con bú.",
    "price": 320000,
    "image_url": "/gobi-mum.png"
  },
  {
    "name": "Viên Cao GOBI",
    "description": "Bổ sung canxi và các hoạt chất từ cao xương ngựa bạch, hỗ trợ mạnh gân cốt, tăng cường sức khỏe. Hỗ trợ giảm đau nhức khớp, tê bì chân tay do viêm khớp, thoái hóa khớp",
    "price": 230000,
    "image_url": "/viên cao gobi.png"
  },
  {
    "name": "Hoạt Huyết Dưỡng Não VIMOS",
    "description": "Giúp bổ huyết, hoạt huyết, tăng cường lưu thông máu lên não. Hỗ trợ giảm nguy cơ hình thành cục máu đông. Hỗ trợ hồi phục sau tai biến mạch máu não.",
    "price": 190000,
    "image_url": "/hoạt huyết dưỡng lão vimos.png"
  },
  {
    "name": "Giải Độc Gan VIMOS Plus",
    "description": "Hỗ trợ giải độc gan. Bảo vệ tế bào gan. Hỗ trợ cải thiện các triệu chứng: mệt mỏi, vàng da, chán ăn, ăn khó tiêu, men gan cao, mẩn ngứa, mề đay, do suy giảm chức năng gan.",
    "price": 195000,
    "image_url": "/giải độc gan vimos plus.png"
  },
  {
    "name": "Vượng Cốt Khí VIMOS",
    "description": "Hỗ trợ mạnh gân cốt, lưu thông khí huyết. Hỗ trợ giảm đau mỏi xương khớp do viêm khớp, thoái hóa khớp.",
    "price": 315000,
    "image_url": "/vượng cốt khí vimos.png"
  },
  {
    "name": "Trà Tam Thất",
    "description": "Giúp thanh nhiệt giải độc, tán ứ. Giúp tăng cường sức đề kháng cho cơ thể. Giúp hành khí hoạt huyết, thông kinh hoạt lạc.",
    "price": 46000,
    "image_url": "/trà tam thất.png"
  },
  {
    "name": "Nutri Sữa Non",
    "description": "Giúp tăng sức đề kháng. Giúp xương, răng chắc khỏe. Giảm nguy cơ mắc bệnh tim mạch.",
    "price": "350000 - 620000",
    "image_url": "/nutri sữa non.png"
  },
  {
    "name": "Glumilk",
    "description": "Tăng cường sức đề kháng. Hỗ trợ giảm cholesterol. Hệ xương và răng vững chắc. Hỗ trợ ổn định đường huyết.",
    "price": "350000 - 595000",
    "image_url": "/glumilk.png"
  },
  {
    "name": "Tố Nữ VIMOS",
    "description": "Hỗ trợ cải thiện tình trạng bốc hỏa, rối loạn giấc ngủ, đổ mồ hôi ban đêm, suy giảm sinh lý.",
    "price": 465000,
    "image_url": "/tố nữ vimos.png"
  },
  {
    "name": "Dung Dịch Vệ Sinh Cao Cấp",
    "description": "Dùng vệ sinh cơ quan sinh dục ngoài. Giúp làm sạch nhẹ nhàng, khử mùi hôi. Duy trì độ ẩm và độ cân bằng PH cho da vùng kín. Bảo vệ vùng kín, giúp ngăn ngừa vi khuẩn gây viêm nhiễm, nấm ngứa.",
    "price": 160000,
    "image_url": "/dung dịch vệ sinh cao cấp.png"
  },
  {
    "name": "Xịt Cao Cấp PK",
    "description": "Giúp làm sạch nhẹ nhàng, kháng khuẩn, khử mùi hôi, làm dịu mát da vùng kín, duy trì độ ẩm và độ cân bằng pH tự nhiên cho da vùng kín. Góp phần ngăn ngừa vi khuẩn gây viêm nhiễm, nấm ngứa.",
    "price": 160000,
    "image_url": "/xịt cao cấp pk.png"
  },
  {
    "name": "Xịt Họng Keo Ong",
    "description": "Giúp ngăn ngừa sự phát triển của vi khuẩn trong khoang miệng. Giúp giảm các triệu chứng viêm đường hô hấp: ho, viêm họng, viêm amidan.",
    "price": 120000,
    "image_url": "/xịt họng keo ong.png"
  },
  {
    "name": "Nước Súc Miệng",
    "description": "Ngậm khoảng 10ml, không pha loãng, súc miệng thật kỹ trong 30 giây, không súc lại bằng nước thường. Dùng sau khi đánh răng và sau khi ăn.",
    "price": 85000,
    "image_url": "/nước súc miệng.png"
  },
  {
    "name": "Viên Tiểu Đêm",
    "description": "Hỗ trợ bổ thận, giảm tình trạng tiểu đêm, tiểu nhiều lần, tiểu rắt, tiểu không tự chủ do chức năng thận kém.",
    "price": 230000,
    "image_url": "/viên tiểu đêm.png"
  },
  {
    "name": "Đông Trùng Ích Phế",
    "description": "Hỗ trợ bổ phế, giúp giảm ho, giảm đờm, giảm đau họng, khàn tiếng do viêm họng, viêm phế quản.",
    "price": 235000,
    "image_url": "/đông trùng ích phế.png"
  },
  {
    "name": "Trinh Nữ Hoàng Cung",
    "description": "Hỗ trợ giảm sự phát triển của u xơ. Giúp giảm các biểu hiện và hạn chế nguy cơ u xơ tử cung, u xơ tuyến vú lành tính ở phụ nữ, u xơ tuyến tiền liệt ở nam giới.",
    "price": 210000,
    "image_url": "/trinh nữ hoàng cung.png"
  },
  {
    "name": "Viên Đường Huyết",
    "description": "Hỗ trợ cải thiện chỉ số đường huyết.",
    "price": 220000,
    "image_url": "/viên đường huyết.png"
  },
  {
    "name": "Xịt Mũi Xoang HDV",
    "description": "Làm giảm các triệu chứng của viêm mũi. Hỗ trợ làm giảm triệu chứng của viêm xoang. Phòng tránh viêm đường hô hấp do virus, vi khuẩn.",
    "price": 145000,
    "image_url": "/xịt mũi xoang hdv.png"
  },
  {
    "name": "Nước Giặt Xả Cao Cấp VNapo",
    "description": "Nước giặt xả cao cấp VNapo hương quyến rũ. Làm sạch sâu, an toàn cho da, mềm mại với da tay, hương thơm nhẹ nhàng.",
    "price": 195000,
    "image_url": "/nước giặt xả cao cấp.png"
  }
];

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sản phẩm</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((p, idx) => {
          // Format price
          const price = typeof p.price === 'number'
            ? p.price.toLocaleString('vi-VN') + '₫'
            : p.price;
          // Use placeholder if no image_url
          const imgSrc = p.image_url || '/vercel.svg';
          return (
            <article key={idx} className="border rounded-xl p-4 shadow hover:shadow-lg transition" style={{background: 'linear-gradient(135deg, #e6ffe6 60%, #fff 100%)'}}>
              <div className="h-40 w-full bg-gray-100 mb-4 flex items-center justify-center rounded">
                <Image src={imgSrc} alt={p.name} width={200} height={160} className="object-cover rounded" />
              </div>
              <h2 className="text-black font-semibold text-lg mb-1">{p.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{p.description}</p>
              <p className="text-amber-700 font-bold text-lg">{price}</p>
              <div className="mt-4">
                <Link href={`/products/${idx}`} className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                  Xem chi tiết
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

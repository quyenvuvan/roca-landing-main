const SERVICES = [
  {
    name: "Cổ vai gáy",
    description:
      "Liệu pháp xoa bóp giúp thư giãn vùng cổ, vai và gáy, giảm căng thẳng và cải thiện tuần hoàn máu.",
  },
  {
    name: "Xông chân",
    description:
      "Thư giãn đôi chân với thảo mộc thiên nhiên, kích thích huyệt đạo và giúp ngủ ngon, giảm stress.",
  },
  {
    name: "Xoa bóp toàn thân",
    description:
      "Trải nghiệm massage toàn thân nhẹ nhàng, giải tỏa mệt mỏi, mang lại cảm giác thư thái và cân bằng năng lượng.",
  },
  {
    name: "Gội đầu thủ thông an",
    description:
      "Kết hợp gội đầu và massage đầu chuyên sâu, giúp lưu thông khí huyết, giảm đau đầu và nuôi dưỡng mái tóc khỏe đẹp.",
  },
  {
    name: "Chăm sóc và làm đẹp da mặt từ cơ bản tới chuyên sâu",
    description:
      "Liệu trình chăm sóc da mặt chuyên nghiệp giúp làm sạch, dưỡng ẩm và phục hồi làn da sáng khỏe tự nhiên.",
  },
];

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dịch vụ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service, idx) => (
          <article
            key={idx}
            className="border rounded-xl p-6 shadow hover:shadow-lg transition bg-gradient-to-br from-green-50 to-white"
          >
            <h2 className="text-black font-semibold text-xl mb-2">
              {service.name}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {service.description}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}


const SERVICES = [
  "Cổ vai gáy",
  "Xông chân",
  "Xoa bóp toàn thân",
  "Gội đầu thủ thông an",
  "Chăm sóc và làm đẹp da mặt từ cơ bản tới chuyên sâu"
];

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dịch vụ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service, idx) => (
          <article key={idx} className="border rounded-xl p-6 shadow hover:shadow-lg transition" style={{background: 'linear-gradient(135deg, #e6ffe6 60%, #fff 100%)'}}>
            <h2 className="text-black font-semibold text-xl mb-2">{service}</h2>
            <p className="text-gray-600 text-sm">Dịch vụ chuyên nghiệp, giúp bạn thư giãn và chăm sóc sức khỏe.</p>
          </article>
        ))}
      </div>
    </main>
  );
}

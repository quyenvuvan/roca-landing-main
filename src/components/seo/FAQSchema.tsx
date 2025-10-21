'use client';

export default function FAQSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Xuyên Việt Coop ở đâu tại Hồng Hưng - Gia Phúc - Hải Phòng?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt tọa lạc tại Hồng Hưng - Gia Phúc - Hải Phòng. Hotline đặt hàng: (+84) 0888. 356. 778"
        }
      },
      {
        "@type": "Question",
        "name": "Giờ hoạt động của Xuyên Việt Coop là mấy giờ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Xuyên Việt Coop hoạt động từ 10:00 - 22:00 hàng ngày, kể cả cuối tuần và ngày lễ."
        }
      },
      {
        "@type": "Question",
        "name": "Xuyên Việt Coop có ưu đãi gì không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Xuyên Việt Coop có nhiều ưu đãi đặc biệt: MUA 2 TẶNG 1, combo đặc biệt với giá ưu đãi, và nhiều chương trình khuyến mãi khác."
        }
      },
      {
        "@type": "Question",
        "name": "Làm sao để đặt hàng tại Xuyên Việt Coop?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bạn có thể đặt hàng qua hotline (+84) 0888. 356. 778, hoặc đến trực tiếp tại Hồng Hưng - Gia Phúc - Hải Phòng. Chúng tôi cũng hỗ trợ đặt hàng online."
        }
      },
      {
        "@type": "Question",
        "name": "Xuyên Việt Coop có những sản phẩm gì đặc sắc?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Xuyên Việt Coop chuyên cung cấp các sản phẩm Việt Nam chất lượng cao, bao gồm thực phẩm, đồ uống và các sản phẩm đặc trưng của Việt Nam."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

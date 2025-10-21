'use client';

export default function BreadcrumbSchema() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://xuyenvietcoop.vn"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Sản phẩm Việt - Giá Trị Việt",
        "item": "https://xuyenvietcoop.vn#offers"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

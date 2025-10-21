'use client';

export default function StructuredData() {
  // Restaurant Schema
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt",
    "image": "https://xuyenvietcoop.vn/restaurant-image.jpg",
    "description": "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt với các sản phẩm chất lượng cao tại Hồng Hưng - Gia Phúc - Hải Phòng",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Hồng Hưng - Gia Phúc - Hải Phòng",
      "addressLocality": "Gia Lộc",
      "addressRegion": "Hải Dương",
      "postalCode": "100000",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "20.976937",
      "longitude": "105.730796"
    },
    "telephone": "+84947858866",
    "url": "https://xuyenvietcoop.vn",
    "openingHours": "Mo-Su 10:00-22:00",
    "servesCuisine": ["Vietnamese", "Local Products", "Traditional"],
    "priceRange": "$",
    "acceptsReservations": true,
    "hasMenu": {
      "@type": "Menu",
      "name": "Menu Xuyên Việt Coop",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Sản phẩm Việt Nam",
          "description": "Các sản phẩm chất lượng cao của Việt Nam"
        },
        {
          "@type": "MenuSection", 
          "name": "Đặc sản địa phương",
          "description": "Sản phẩm đặc trưng của Hải Dương và các vùng miền"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "50"
    }
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Xuyên Việt Coop",
    "image": "https://xuyenvietcoop.vn/business-photo.jpg",
    "telephone": "+84947858866",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Hồng Hưng - Gia Phúc - Hải Phòng",
      "addressLocality": "Gia Lộc",
      "addressRegion": "Hải Dương",
      "postalCode": "100000",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.976937,
      "longitude": 105.730796
    },
    "url": "https://xuyenvietcoop.vn",
    "openingHours": [
      "Mo-Su 10:00-22:00"
    ],
    "paymentAccepted": "Cash, Credit Card, Mobile Payment"
  };

  // Special Offer Schema
  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": "Ưu đãi MUA 2 TẶNG 1 Xuyên Việt Coop",
    "description": "MUA 2 TẶNG 1 - Sản phẩm Việt - Giá Trị Việt",
    "price": "0",
    "priceCurrency": "VND",
    "validFrom": "2025-01-01",
    "validThrough": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Restaurant",
      "name": "Xuyên Việt Coop"
    },
    "category": "Restaurant Promotion"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />
    </>
  );
}


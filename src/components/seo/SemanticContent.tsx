'use client';

export default function SemanticContent() {
  return (
    <>
      {/* Restaurant Info with Microdata - Hidden for SEO */}
      <div className="sr-only" itemScope itemType="https://schema.org/Restaurant">
        <h1 itemProp="name">Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt</h1>
        <div itemProp="description">
          Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt với các sản phẩm chất lượng cao tại Hồng Hưng - Gia Phúc - Hải Phòng
        </div>
        
        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="streetAddress">Hồng Hưng - Gia Phúc - Hải Phòng</span>
          <span itemProp="addressLocality">Gia Lộc</span>
          <span itemProp="addressRegion">Hải Dương</span>
          <span itemProp="addressCountry">Vietnam</span>
        </div>
        
        <span itemProp="telephone">+84947858866</span>
        <span itemProp="priceRange"></span>
        <span itemProp="servesCuisine">Vietnamese</span>
        <span itemProp="servesCuisine">Local Products</span>
        <span itemProp="servesCuisine">Traditional</span>
        
        <div itemProp="openingHours" content="Mo-Su 10:00-22:00">
          10:00 - 22:00 hàng ngày
        </div>
        
        <div itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates">
          <span itemProp="latitude">20.976937</span>
          <span itemProp="longitude">105.730796</span>
        </div>

        <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
          <span itemProp="ratingValue">4.5</span>
          <span itemProp="reviewCount">50</span>
        </div>
      </div>
      
      {/* Business Hours Microdata */}
      <div className="sr-only" itemScope itemType="https://schema.org/OpeningHoursSpecification">
        <span itemProp="dayOfWeek" content="Monday Tuesday Wednesday Thursday Friday Saturday Sunday">
          Thứ 2 - Chủ nhật
        </span>
        <span itemProp="opens" content="10:00">10:00</span>
        <span itemProp="closes" content="22:00">22:00</span>
      </div>

      {/* Special Offer Microdata */}
      <div className="sr-only" itemScope itemType="https://schema.org/Offer">
        <span itemProp="name">Ưu đãi MUA 2 TẶNG 1 Xuyên Việt Coop</span>
        <span itemProp="description">MUA 2 TẶNG 1 - Sản phẩm Việt - Giá Trị Việt</span>
        <span itemProp="price">0</span>
        <span itemProp="priceCurrency">VND</span>
        <span itemProp="validFrom">2025-01-01</span>
        <span itemProp="validThrough">2025-12-31</span>
        <span itemProp="availability" content="https://schema.org/InStock">Còn hàng</span>
      </div>
    </>
  );
}

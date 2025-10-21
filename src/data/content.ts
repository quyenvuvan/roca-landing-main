export const content = {
  brand: {
    name: 'Xuyên Việt Coop',
    logo: '/logo.png',
    primaryColor: '#2a579b',
    secondaryColor: '#dfd057'
  },
  features: {
    enableMiniGame: false,
    enableRegisterForm: true,
    enableOffersSection: true,
    enableMenuSection: false,
    enableWhyChooseSection: false,
    enableContactSection: true,
    enableStickyButtons: true,
    enableFakeNotifications: false,
  },
  seo: {
    title: 'Xuyên Việt Coop – Sản phẩm Việt - Giá Trị Việt | Duy Nhất Tại Hội Nghị',
    description: 'Sản phẩm Việt - Giá Trị Việt. Quét mã – Điền thông tin – Nhận ưu đãi ngay tại quầy! Số lượng có hạn.',
    keywords: ['Xuyên Việt Coop', 'Sản phẩm Việt', 'Giá Trị Việt', 'ưu đãi hội nghị', 'cooperative', 'Ocean Park']
  },
  hero: {
    headline: 'SẢN PHẨM VIỆT - GIÁ TRỊ VIỆT – Duy Nhất Tại Hội Nghị!',
    subheadline: 'Quét mã – Điền thông tin – Nhận ưu đãi ngay tại quầy!',
    ctaText: 'Đăng ký ngay'
  },
  sections: [
    { id: 'offer-intro', type: 'rich', title: 'Ưu đãi Xuyên Việt Coop', html: '<p>Mua 2, tặng 1 sản phẩm cùng giá hoặc thấp hơn. Chỉ áp dụng trong thời gian hội nghị. Số lượng có hạn – nhanh tay kẻo lỡ!</p>' },
    { id: 'how-to-redeem', type: 'list', title: 'Hướng dẫn nhận ưu đãi', items: ['Bước 1: Quét mã QR trên standee', 'Bước 2: Điền thông tin tại form này', 'Bước 3: Nhận ưu đãi tại quầy'] }
  ],
  form: {
    fields: ['fullName', 'phoneNumber'],
    ctaText: 'Nhận Ưu Đãi Ngay'
  },
  contact: {
    brandLine: 'Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt',
    infoLine: 'LH đặt hàng: 0947.858.866 - Khu ẩm thực San Hô 06/72 Vinhome Ocean Park 1 ( Miễn phí ship nội khu Ocean park 1 )'
  }
} as const;

export type AppContent = typeof content;





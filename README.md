# Xuyên Việt Coop Landing Page

Landing page cho chương trình khuyến mãi **MUA 2 TẶNG 1** của Xuyên Việt Coop tại hội nghị.

## 🎯 Mục đích

Landing page này được thiết kế để:
- Giới thiệu chương trình khuyến mãi MUA 2 TẶNG 1
- Thu thập thông tin khách hàng quan tâm
- Hướng dẫn khách hàng nhận ưu đãi tại quầy

## 🏗️ Cấu trúc Landing Page

### 1. Hero Section
- Logo Xuyên Việt Coop
- Tiêu đề: "SẢN PHẨM VIỆT - GIÁ TRỊ VIỆT – Duy Nhất Tại Hội Nghị!"
- Subtitle: "Quét mã – Điền thông tin – Nhận ưu đãi ngay tại quầy!"
- Nút CTA: "Đăng ký ngay"

### 2. Phần giới thiệu ưu đãi
- Mô tả chương trình MUA 2 TẶNG 1
- Countdown timer
- Số lượng ưu đãi có hạn (500 khách hàng đầu tiên)
- Progress bar hiển thị số lượng đã đăng ký

### 3. Form đăng ký nhanh
- Họ tên (bắt buộc)
- Số điện thoại (bắt buộc)
- Nút gửi: "Nhận Ưu Đãi Ngay"
- Thông báo xác nhận sau khi đăng ký

### 4. Hướng dẫn nhận ưu đãi
- Bước 1: Quét mã QR trên standee
- Bước 2: Điền thông tin tại form này
- Bước 3: Nhận ưu đãi tại quầy

### 5. Thông tin liên hệ & thương hiệu
- Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt
- LH đặt hàng: 0947.858.866
- Khu ẩm thực San Hô 06/72 Vinhome Ocean Park 1
- Miễn phí ship nội khu Ocean Park 1

## 🚀 Tính năng

- **Responsive Design**: Tương thích với mọi thiết bị
- **Form Validation**: Kiểm tra dữ liệu đầu vào
- **Countdown Timer**: Đếm ngược thời gian kết thúc ưu đãi
- **Progress Bar**: Hiển thị tiến độ đăng ký
- **Sticky Contact Buttons**: Nút liên hệ luôn hiển thị
- **SEO Optimized**: Tối ưu hóa cho công cụ tìm kiếm

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Deployment**: Vercel (recommended)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Màu sắc chủ đạo

- **Primary**: Blue (#2a579b)
- **Secondary**: Yellow (#dfd057)
- **Accent**: Blue-800 (#1e40af)
- **Background**: Gradient từ blue-50 đến blue-100

## 📋 Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Start production server
npm start
```

## 🔧 Cấu hình

Các tính năng có thể bật/tắt trong file `src/data/content.ts`:

```typescript
features: {
  enableMiniGame: false,        // Vòng quay may mắn
  enableRegisterForm: true,     // Form đăng ký
  enableOffersSection: true,    // Phần ưu đãi
  enableMenuSection: false,     // Menu
  enableWhyChooseSection: false, // Tại sao chọn chúng tôi
  enableContactSection: true,   // Thông tin liên hệ
  enableStickyButtons: true,    // Nút liên hệ sticky
  enableFakeNotifications: false, // Thông báo giả
}
```

## 📊 API Endpoints

- `/api/register` - Đăng ký khách hàng
- `/api/registration-count` - Lấy số lượng đã đăng ký

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual Build
```bash
npm run build
npm start
```

## 📝 Ghi chú

- Landing page được thiết kế đặc biệt cho chương trình khuyến mãi hội nghị
- Form chỉ thu thập thông tin cần thiết (họ tên, số điện thoại)
- Tích hợp với Google Sheets để lưu trữ dữ liệu đăng ký
- Tối ưu hóa cho trải nghiệm mobile

## 📞 Liên hệ hỗ trợ

- **Xuyên Việt Coop**: 0947.858.866
- **Địa chỉ**: San Hô 06/72 Vinhome Ocean Park 1
- **Giờ hoạt động**: 10:00 - 22:00 hàng ngày

---

© 2024 Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt. Tất cả quyền được bảo lưu.
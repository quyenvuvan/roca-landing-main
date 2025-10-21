import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsRegistrationService, RegistrationData } from '@/lib/google-sheets-registration';

// GET - Lấy danh sách đăng ký
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1000');
    
    const registrations = await GoogleSheetsRegistrationService.getRegistrations(limit);
    
    return NextResponse.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    console.error('❌ Error getting registrations:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi lấy danh sách đăng ký' },
      { status: 500 }
    );
  }
}

// POST - Thêm đăng ký mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, address, notes } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Tên và số điện thoại là bắt buộc' },
        { status: 400 }
      );
    }

    // Kiểm tra phone đã đăng ký chưa
    const phoneExists = await GoogleSheetsRegistrationService.checkPhoneExists(phone);
    if (phoneExists) {
      return NextResponse.json(
        { success: false, message: 'Số điện thoại này đã được đăng ký' },
        { status: 409 }
      );
    }

    // Tạo registration data
    const registrationData: RegistrationData = {
      timestamp: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      address: address?.trim() || '',
      notes: notes?.trim() || ''
    };

    // Thêm vào Google Sheets
    const success = await GoogleSheetsRegistrationService.addRegistration(registrationData);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Đăng ký thành công',
        data: registrationData
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Lỗi lưu đăng ký' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error adding registration:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi đăng ký' },
      { status: 500 }
    );
  }
} 
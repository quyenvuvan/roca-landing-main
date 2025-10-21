import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/email';

// Add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return addCorsHeaders(response);
}

// Generate reservation code
function generateReservationCode(): string {
  return 'ROCA' + Date.now().toString().slice(-6);
}

// Format date for Vietnam timezone
function formatVietnamDateTime(): string {
  return new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

interface CustomerRegistration {
  fullName: string;
  phoneNumber: string;
  address?: string;
  gender?: string;
  birthDate?: string;
  peopleCount?: number;
  arrivalTime?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let body: CustomerRegistration;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      const errorResponse = NextResponse.json(
        { success: false, error: 'Invalid JSON format' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    const { fullName, phoneNumber, address, gender, birthDate, peopleCount, arrivalTime } = body;

    // Validation
    if (!fullName?.trim()) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Họ và tên không được để trống' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    if (!phoneNumber?.trim()) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Số điện thoại không được để trống' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Validate phone number format
    const cleanPhoneNumber = phoneNumber.replace(/\s/g, '');
    if (!/^[0-9]{10,11}$/.test(cleanPhoneNumber)) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Số điện thoại không hợp lệ' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Set default values for optional fields
    const defaultPeopleCount = peopleCount || 1;
    const defaultArrivalTime = arrivalTime || 'TBD';

    // Validate peopleCount if provided
    if (peopleCount !== undefined && (peopleCount < 1)) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Số lượng người phải lớn hơn 0' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Validate arrivalTime format if provided (HH:mm)
    if (arrivalTime && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(arrivalTime)) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Thời gian đến không hợp lệ (định dạng HH:mm)' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Generate reservation code and timestamp
    const reservationCode = generateReservationCode();
    const timestamp = formatVietnamDateTime();

    // Send admin notification email
    const emailData = {
      fullName: fullName.trim(),
      phoneNumber: cleanPhoneNumber,
      address: address?.trim(),
      gender,
      birthDate,
      peopleCount: defaultPeopleCount,
      arrivalTime: defaultArrivalTime,
      reservationCode,
      timestamp
    };

    try {
      const emailResult = await sendAdminNotification(emailData);

      if (emailResult.success) {
        console.log('✅ Registration email sent successfully');
        const successResponse = NextResponse.json({
          success: true,
          message: 'Đăng ký thành công',
          data: {
            reservationCode,
            timestamp
          }
        });
        return addCorsHeaders(successResponse);
      } else {
        console.error('❌ Email failed:', emailResult.error);
        const errorResponse = NextResponse.json({
          success: false,
          error: 'Không thể gửi email. Vui lòng thử lại sau.',
          details: emailResult.error
        }, { status: 500 });
        return addCorsHeaders(errorResponse);
      }
    } catch (emailError) {
      console.error('❌ Email error:', emailError instanceof Error ? emailError.message : 'Unknown error');
      const errorResponse = NextResponse.json({
        success: false,
        error: 'Không thể gửi email. Vui lòng thử lại sau.'
      }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }

  } catch (error) {
    console.error('Unexpected error in registration API:', error);
    const errorResponse = NextResponse.json({
      success: false,
      error: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.'
    }, { status: 500 });
    return addCorsHeaders(errorResponse);
  }
}

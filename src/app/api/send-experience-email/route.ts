import { NextRequest, NextResponse } from 'next/server';
import { sendExperienceRegistrationEmail, ExperienceData } from '@/lib/email';
import { GoogleSheetsExperienceService } from '@/lib/google-sheets-experience';

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

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let body: ExperienceData;
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

    const { name, age, phone, schedule, description, timestamp } = body;

    // Validation
    if (!name?.trim()) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Tên không được để trống' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    if (!phone?.trim()) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Số điện thoại không được để trống' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Validate phone number format
    const cleanPhoneNumber = phone.replace(/\s/g, '');
    if (!/^[0-9]{10,11}$/.test(cleanPhoneNumber)) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Số điện thoại không hợp lệ' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Send experience registration email
    const experienceData: ExperienceData = {
      name: name.trim(),
      age: age?.trim() || '',
      phone: cleanPhoneNumber,
      schedule: schedule || '',
      description: description?.trim() || '',
      timestamp: timestamp || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    };

    const emailResult = await sendExperienceRegistrationEmail(experienceData);

    if (emailResult.success) {
      console.log('✅ Experience registration email sent successfully');

      // Sync to Google Sheets after successful email send
      try {
        console.log('📊 Syncing experience registration to Google Sheets...');
        const sheetsResult = await GoogleSheetsExperienceService.addExperienceRegistration(experienceData);

        if (sheetsResult) {
          console.log('✅ Experience registration synced to Google Sheets successfully');
        } else {
          console.warn('⚠️ Experience registration email sent but failed to sync to Google Sheets');
        }
      } catch (sheetsError) {
        console.error('❌ Error syncing to Google Sheets:', sheetsError);
        // Don't fail the request if sheets sync fails, just log it
      }

      const successResponse = NextResponse.json({
        success: true,
        message: 'Email đã được gửi thành công',
        data: {
          messageId: emailResult.messageId,
          totalRecipients: emailResult.totalRecipients
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

  } catch (error) {
    console.error('Unexpected error in experience email API:', error);
    const errorResponse = NextResponse.json({
      success: false,
      error: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.'
    }, { status: 500 });
    return addCorsHeaders(errorResponse);
  }
}

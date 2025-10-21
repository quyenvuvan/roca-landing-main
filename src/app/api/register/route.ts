import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { sendAdminNotification } from '@/lib/email';
import { promises as fs } from 'fs';
import path from 'path';

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

// File to store registration count
const REGISTRATION_COUNT_FILE = path.join(process.cwd(), 'data', 'registration-count.json');

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

// Function to get Google Sheets client
async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
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

// Function to get current registration count
async function getRegistrationCount(): Promise<number> {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(REGISTRATION_COUNT_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    const data = await fs.readFile(REGISTRATION_COUNT_FILE, 'utf-8');
    const { count } = JSON.parse(data);
    return count || 0;
  } catch (error) {
    // If file doesn't exist or is invalid, return 0
    return 0;
  }
}

// Function to increment registration count
async function incrementRegistrationCount(): Promise<number> {
  try {
    const currentCount = await getRegistrationCount();
    const newCount = currentCount + 1;
    
    // Ensure data directory exists
    const dataDir = path.dirname(REGISTRATION_COUNT_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(REGISTRATION_COUNT_FILE, JSON.stringify({ count: newCount }));
    return newCount;
  } catch (error) {
    console.error('Error updating registration count:', error);
    return 0;
  }
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

    // Check Google Sheets configuration
    if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.log('Missing Google Sheets configuration:');
      console.log('- SPREADSHEET_ID:', SPREADSHEET_ID ? 'SET' : 'MISSING');
      console.log('- CLIENT_EMAIL:', GOOGLE_CLIENT_EMAIL ? 'SET' : 'MISSING');
      console.log('- PRIVATE_KEY:', GOOGLE_PRIVATE_KEY ? 'SET' : 'MISSING');
      
      const response = NextResponse.json({
        success: false,
        error: 'Google Sheets chưa được cấu hình. Vui lòng kiểm tra environment variables trên Vercel.',
        details: {
          spreadsheetId: SPREADSHEET_ID ? 'SET' : 'MISSING',
          serviceAccountEmail: GOOGLE_CLIENT_EMAIL ? 'SET' : 'MISSING',
          privateKey: GOOGLE_PRIVATE_KEY ? 'SET' : 'MISSING'
        }
      }, { status: 500 });
      return addCorsHeaders(response);
    }

    try {
      const sheets = await getGoogleSheetsClient();
      
      // Generate reservation code
      const reservationCode = generateReservationCode();
      const timestamp = formatVietnamDateTime();

             // Prepare data for Google Sheets
       // Headers: Họ và tên | Số điện thoại | Mã đặt hàng | Thời gian đăng ký
       const rowData = [
         fullName.trim(),           // A - Họ và tên
         cleanPhoneNumber,          // B - Số điện thoại  
         reservationCode,           // C - Mã đặt hàng
         timestamp                  // D - Thời gian đăng ký
       ];

      // Add data to Google Sheets
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'dang_ky_nhan_uu_dai!A:D', // 4 columns: A to D
        valueInputOption: 'RAW',
        requestBody: {
          values: [rowData],
        },
      });

      console.log('Successfully added customer registration:', reservationCode);

      // Increment registration count
      const newCount = await incrementRegistrationCount();

             // Send admin notification email WITH timeout
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

      // Wait for email with timeout (don't want to slow down form too much)
      try {
        const emailTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout after 8 seconds')), 8000)
        );
        
        const emailPromise = sendAdminNotification(emailData);
        const emailResult = await Promise.race([emailPromise, emailTimeout]);
        
        if (emailResult && typeof emailResult === 'object' && 'success' in emailResult && emailResult.success) {
          console.log('✅ Email sent successfully');
        } else {
          console.log('⚠️ Email failed but registration completed');
        }
      } catch (emailError) {
        console.error('❌ Email error:', emailError instanceof Error ? emailError.message : 'Unknown error');
        // Don't fail the whole registration just because email failed
      }

      const successResponse = NextResponse.json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          reservationCode,
          timestamp,
          registrationCount: newCount
        }
      });

      return addCorsHeaders(successResponse);

    } catch (sheetsError) {
      console.error('Error interacting with Google Sheets:', sheetsError);
      const errorResponse = NextResponse.json({
        success: false,
        error: 'Không thể lưu thông tin. Vui lòng thử lại sau.'
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
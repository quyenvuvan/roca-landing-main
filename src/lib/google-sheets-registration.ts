import { google } from 'googleapis';

export interface RegistrationData {
  timestamp: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export class GoogleSheetsRegistrationService {
  private static readonly SPREADSHEET_ID = process.env.REGISTRATION_GOOGLE_SHEETS_ID;
  private static readonly SHEET_NAME = process.env.REGISTRATION_GOOGLE_SHEETS_NAME;
  private static readonly RANGE = `${this.SHEET_NAME}!A:F`; // Cột A đến F

  private static getAuth = () => {
    if (!process.env.REGISTRATION_GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.REGISTRATION_GOOGLE_PRIVATE_KEY) {
      throw new Error('Registration Google service account credentials are not defined in environment variables.');
    }
    return new google.auth.JWT(
      process.env.REGISTRATION_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.REGISTRATION_GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
  };

  // Thêm đăng ký mới vào Google Sheets
  static async addRegistration(data: RegistrationData): Promise<boolean> {
    console.log('📝 Adding registration to Google Sheets...');

    if (!this.SPREADSHEET_ID || !this.SHEET_NAME) {
      console.error('❌ Registration Google Sheets SPREADSHEET_ID or SHEET_NAME is not configured');
      return false;
    }

    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      // Tạo dữ liệu row
      const rowData = [
        new Date(data.timestamp).toLocaleString('vi-VN'), // Thời gian
        data.name, // Tên
        data.phone, // Số điện thoại
        data.email || '', // Email (optional)
        data.address || '', // Địa chỉ (optional)
        data.notes || '' // Ghi chú (optional)
      ];

      console.log('📊 Row data:', rowData);

      // Thêm vào sheet
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.RANGE,
        valueInputOption: 'RAW',
        requestBody: {
          values: [rowData]
        }
      });

      console.log('✅ Registration added successfully:', response.data.updates?.updatedRows);
      return true;
    } catch (error) {
      console.error('❌ Error adding registration to Google Sheets:', error);
      return false;
    }
  }

  // Kiểm tra số điện thoại đã đăng ký chưa
  static async checkPhoneExists(phone: string): Promise<boolean> {
    console.log('🔍 Checking if phone exists in registration...');

    if (!this.SPREADSHEET_ID || !this.SHEET_NAME) {
      console.error('❌ Registration Google Sheets SPREADSHEET_ID or SHEET_NAME is not configured');
      return false;
    }

    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      // Lấy tất cả dữ liệu
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.RANGE,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log('📝 No registration data found');
        return false;
      }

      // Kiểm tra cột C (index 2) cho số điện thoại
      const phoneExists = rows.some(row => row[2] === phone);
      
      console.log(`📞 Phone ${phone} exists:`, phoneExists);
      return phoneExists;
    } catch (error) {
      console.error('❌ Error checking phone in Google Sheets:', error);
      return false;
    }
  }

  // Lấy danh sách đăng ký
  static async getRegistrations(limit: number = 100): Promise<RegistrationData[]> {
    if (!this.SPREADSHEET_ID || !this.SHEET_NAME) {
      return [];
    }

    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.RANGE,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      // Bỏ qua header row, lấy data
      const dataRows = rows.slice(1);
      
      const registrations: RegistrationData[] = dataRows.map((row, index) => ({
        timestamp: new Date(row[0] || '').getTime() || Date.now(),
        name: row[1] || '',
        phone: row[2] || '',
        email: row[3] || '',
        address: row[4] || '',
        notes: row[5] || ''
      }));

      // Sort theo timestamp mới nhất trước
      registrations.sort((a, b) => b.timestamp - a.timestamp);

      return registrations.slice(0, limit);
    } catch (error) {
      return [];
    }
  }
} 
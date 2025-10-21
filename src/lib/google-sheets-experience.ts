import { google } from 'googleapis';

export interface ExperienceData {
  name: string;
  age: string;
  phone: string;
  schedule: string;
  description: string;
  timestamp: string;
}

export class GoogleSheetsExperienceService {
  private static readonly SPREADSHEET_ID = process.env.EXPERIENCE_GOOGLE_SHEETS_ID;
  private static readonly SHEET_NAME = process.env.EXPERIENCE_GOOGLE_SHEETS_NAME;
  private static readonly RANGE = `${this.SHEET_NAME}!A:F`; // Cột A đến F

  private static getAuth = () => {
    if (!process.env.EXPERIENCE_GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.EXPERIENCE_GOOGLE_PRIVATE_KEY) {
      throw new Error('Experience Google service account credentials are not defined in environment variables.');
    }
    return new google.auth.JWT(
      process.env.EXPERIENCE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.EXPERIENCE_GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
  };

  // Thêm đăng ký trải nghiệm mới vào Google Sheets
  static async addExperienceRegistration(data: ExperienceData): Promise<boolean> {
    console.log('📝 Adding experience registration to Google Sheets...');

    if (!this.SPREADSHEET_ID || !this.SHEET_NAME) {
      console.error('❌ Experience Google Sheets SPREADSHEET_ID or SHEET_NAME is not configured');
      return false;
    }

    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });

      // Tạo dữ liệu row
      const rowData = [
        data.timestamp, // Thời gian
        data.name, // Tên
        data.age, // Tuổi
        data.phone, // Số điện thoại
        data.schedule, // Đặt lịch
        data.description // Mô tả triệu chứng
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

      console.log('✅ Experience registration added successfully:', response.data.updates?.updatedRows);
      return true;
    } catch (error) {
      console.error('❌ Error adding experience registration to Google Sheets:', error);
      return false;
    }
  }

  // Kiểm tra số điện thoại đã đăng ký trải nghiệm chưa
  static async checkPhoneExists(phone: string): Promise<boolean> {
    console.log('🔍 Checking if phone exists in experience registrations...');

    if (!this.SPREADSHEET_ID || !this.SHEET_NAME) {
      console.error('❌ Experience Google Sheets SPREADSHEET_ID or SHEET_NAME is not configured');
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
        console.log('📝 No experience registration data found');
        return false;
      }

      // Kiểm tra cột D (index 3) cho số điện thoại
      const phoneExists = rows.some(row => row[3] === phone);

      console.log(`📞 Phone ${phone} exists in experience:`, phoneExists);
      return phoneExists;
    } catch (error) {
      console.error('❌ Error checking phone in experience Google Sheets:', error);
      return false;
    }
  }

  // Lấy danh sách đăng ký trải nghiệm
  static async getExperienceRegistrations(limit: number = 100): Promise<ExperienceData[]> {
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

      const registrations: ExperienceData[] = dataRows.map((row, index) => ({
        timestamp: row[0] || '',
        name: row[1] || '',
        age: row[2] || '',
        phone: row[3] || '',
        schedule: row[4] || '',
        description: row[5] || ''
      }));

      // Sort theo timestamp mới nhất trước (giả sử timestamp là string)
      registrations.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeB - timeA;
      });

      return registrations.slice(0, limit);
    } catch (error) {
      console.error('❌ Error getting experience registrations:', error);
      return [];
    }
  }
}

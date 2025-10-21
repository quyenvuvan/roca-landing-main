import { google } from 'googleapis';

export interface WheelConfig {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  probability: number;
  color: string;
  description: string;
  category: string;
}

export class GoogleSheetsService {
  private static readonly SPREADSHEET_ID = process.env.WHEEL_GOOGLE_SHEETS_ID;
  private static readonly SHEET_NAME = process.env.WHEEL_GOOGLE_SHEETS_NAME;
  private static readonly RANGE = `${this.SHEET_NAME}!A2:F`; // Dữ liệu từ cột A đến F, bắt đầu từ dòng 2
  
  // Cache để tăng tốc độ
  private static cache: {
    data: WheelConfig[] | null;
    timestamp: number;
    ttl: number;
  } = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000 // 5 phút cache
  };

  private static getAuth = () => {
    if (!process.env.WHEEL_GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.WHEEL_GOOGLE_PRIVATE_KEY) {
      throw new Error('Wheel Google service account credentials are not defined in environment variables.');
    }
    return new google.auth.JWT(
      process.env.WHEEL_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.WHEEL_GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    );
  };

  static async getWheelConfiguration(): Promise<WheelConfig[]> {
    // Kiểm tra cache trước
    const now = Date.now();
    if (this.cache.data && (now - this.cache.timestamp) < this.cache.ttl) {
      return this.cache.data;
    }

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

      const prizes: WheelConfig[] = rows.map((row, index) => {
        const probValue = parseFloat(row[4]);

        return {
          id: row[0] || `prize-${index + 1}`,
          name: row[1] || 'Phần thưởng bí mật',
          icon: row[2] || '🎁',
          imageUrl: row[3] || undefined,
          probability: isNaN(probValue) ? 5 : probValue,
          color: '#FFFFFF',
          description: row[5] || '',
          category: 'Khác',
        };
      });

      // Lưu vào cache
      this.cache.data = prizes;
      this.cache.timestamp = now;

      return prizes;
    } catch (error) {
      // Nếu có cache cũ, trả về cache
      if (this.cache.data) {
        return this.cache.data;
      }
      
      return [];
    }
  }

  // Method để clear cache (có thể gọi khi cần refresh)
  static clearCache(): void {
    this.cache.data = null;
    this.cache.timestamp = 0;
    console.log('🗑️ Cache cleared');
  }

  // Method để force refresh (bỏ qua cache)
  static async forceRefresh(): Promise<WheelConfig[]> {
    this.clearCache();
    return this.getWheelConfiguration();
  }
}
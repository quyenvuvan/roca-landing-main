import { google } from 'googleapis';
import { GoogleSheetsService } from './google-sheets';

export class GoogleSheetsAutoUpdate {
  private static lastModified: number = 0;
  private static isPolling: boolean = false;
  private static pollingInterval: NodeJS.Timeout | null = null;
  
  // Bắt đầu auto-update
  static startAutoUpdate(): void {
    if (this.isPolling) {
      console.log('🔄 Auto-update đã đang chạy');
      return;
    }
    
    this.isPolling = true;
    this.checkForUpdates();
    
    console.log('🔄 Bắt đầu auto-update Google Sheets mỗi 60 giây');
  }
  
  // Kiểm tra và cập nhật
  private static async checkForUpdates(): Promise<void> {
    if (!this.isPolling) return;
    
    try {
      console.log('🔍 Kiểm tra thay đổi Google Sheets...');
      
      // Kiểm tra credentials trước khi tiếp tục
      if (!process.env.WHEEL_GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.WHEEL_GOOGLE_PRIVATE_KEY) {
        console.warn('⚠️ Wheel Google Service Account credentials not configured, skipping auto-update');
        return;
      }
      
      const auth = this.getAuth();
      const drive = google.drive({ version: 'v3', auth });
      
      // Lấy thông tin file để check modified time
      const response = await drive.files.get({
        fileId: process.env.WHEEL_GOOGLE_SHEETS_ID,
        fields: 'modifiedTime'
      });
      
      const modifiedTime = new Date(response.data.modifiedTime || '').getTime();
      
      // Nếu có thay đổi, clear cache
      if (modifiedTime > this.lastModified) {
        console.log('🔄 Phát hiện thay đổi Google Sheets, cập nhật cache...');
        console.log(`📅 Thời gian thay đổi: ${new Date(modifiedTime).toLocaleString('vi-VN')}`);
        
        this.lastModified = modifiedTime;
        GoogleSheetsService.clearCache();
        
        console.log('✅ Cache đã được clear, dữ liệu mới sẽ được load ở lần truy cập tiếp theo');
      } else {
        console.log('✅ Không có thay đổi trên Google Sheets');
      }
    } catch (error) {
      console.error('❌ Lỗi auto-update:', error);
    }
    
    // Tiếp tục polling sau 60 giây
    this.pollingInterval = setTimeout(() => this.checkForUpdates(), 60 * 1000);
  }
  
  // Dừng auto-update
  static stopAutoUpdate(): void {
    this.isPolling = false;
    
    if (this.pollingInterval) {
      clearTimeout(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    console.log('⏹️ Dừng auto-update Google Sheets');
  }
  
  // Kiểm tra trạng thái
  static getStatus(): { isPolling: boolean; lastModified: number } {
    return {
      isPolling: this.isPolling,
      lastModified: this.lastModified
    };
  }
  
  // Force check ngay lập tức
  static async forceCheck(): Promise<boolean> {
    try {
      console.log('🔍 Force check thay đổi Google Sheets...');
      
      // Kiểm tra credentials trước khi tiếp tục
      if (!process.env.WHEEL_GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.WHEEL_GOOGLE_PRIVATE_KEY) {
        console.warn('⚠️ Wheel Google Service Account credentials not configured, cannot force check');
        return false;
      }
      
      const auth = this.getAuth();
      const drive = google.drive({ version: 'v3', auth });
      
      const response = await drive.files.get({
        fileId: process.env.WHEEL_GOOGLE_SHEETS_ID,
        fields: 'modifiedTime'
      });
      
      const modifiedTime = new Date(response.data.modifiedTime || '').getTime();
      
      if (modifiedTime > this.lastModified) {
        console.log('🔄 Phát hiện thay đổi, cập nhật cache...');
        this.lastModified = modifiedTime;
        GoogleSheetsService.clearCache();
        return true;
      }
      
      console.log('✅ Không có thay đổi');
      return false;
    } catch (error) {
      console.error('❌ Lỗi force check:', error);
      return false;
    }
  }
  
  private static getAuth() {
    if (!process.env.WHEEL_GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.WHEEL_GOOGLE_PRIVATE_KEY) {
      throw new Error('Wheel Google service account credentials are not defined');
    }
    return new google.auth.JWT(
      process.env.WHEEL_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.WHEEL_GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n'),
      [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly'
      ]
    );
  }
} 
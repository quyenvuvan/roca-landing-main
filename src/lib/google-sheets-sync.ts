import { google } from 'googleapis';
import { RecentSpin, Player } from '@/types/game';

export class GoogleSheetsSyncService {
  private static readonly SPREADSHEET_ID = process.env.SYNC_GOOGLE_SHEETS_ID;
  private static readonly SHEET_NAME = process.env.SYNC_GOOGLE_SHEETS_NAME || 'RecentSpins';
  // Thêm biến mới cho sheet người chơi riêng biệt
  private static readonly PLAYERS_SHEET_NAME = process.env.PLAYERS_GOOGLE_SHEETS_NAME || `${this.SHEET_NAME}_Players`;
  private static lastSyncTime = 0; // Lưu thời gian đồng bộ cuối cùng
  private static isSyncing = false; // Prevent concurrent syncs

  private static getAuth = () => {
    if (!process.env.SYNC_GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.SYNC_GOOGLE_PRIVATE_KEY) {
      throw new Error('Sync Google service account credentials are not defined in environment variables.');
    }
    return new google.auth.JWT(
      process.env.SYNC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.SYNC_GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
  };

  // Đồng bộ RecentSpins với logic clear + rewrite để tránh lộn xộn
  static async syncRecentSpinsToSheet(recentSpins: RecentSpin[]): Promise<boolean> {
    console.log(`🎯 [SPINS] Đồng bộ ${recentSpins.length} recent spins...`);
    
    if (!this.SPREADSHEET_ID) {
      console.error('❌ [SPINS] Missing SPREADSHEET_ID');
      return false;
    }

    // Prevent concurrent syncs
    if (this.isSyncing) {
      console.log('⏳ [SPINS] Already syncing, returning success');
      return true; // Return success for concurrent calls
    }

    this.isSyncing = true;

    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });
      console.log('✅ [SPINS] Google Sheets client created');

      // Kiểm tra xem có dữ liệu mới không
      if (recentSpins.length === 0) {
        console.log('ℹ️ [SPINS] Không có dữ liệu recent spins để đồng bộ');
        return true;
      }

      // Sort dữ liệu theo timestamp tăng dần (cũ nhất trước, mới nhất cuối)
      const sortedSpins = [...recentSpins].sort((a, b) => a.timestamp - b.timestamp);
      
      console.log('📊 [SPINS] Sample data (first 3, sorted old to new):');
      sortedSpins.slice(0, 3).forEach((spin, index) => {
        const timeStr = new Date(spin.timestamp).toLocaleString('vi-VN', { 
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false 
        });
        console.log(`  ${index + 1}. ${spin.name} (${spin.phone}) - ${spin.prizeName} - Spin ${spin.spinNumber} - ${timeStr}`);
      });

      // Chuẩn bị dữ liệu đã sort với cột số thứ tự ở đầu và cột ghi chú ở cuối
      const data = sortedSpins.map((spin, index) => [
        index + 1, // Số thứ tự (bắt đầu từ 1)
        spin.timestamp, // Timestamp
        new Date(spin.timestamp).toLocaleString('vi-VN', { 
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false 
        }), // Thời gian Việt Nam
        spin.phone, // Số điện thoại
        spin.name, // Tên người chơi
        spin.prizeName, // Tên giải thưởng
        spin.spinNumber, // Lượt quay thứ mấy
        '', // Cột ghi chú (để trống, có thể điền sau)
      ]);

      console.log(`📝 [SPINS] Prepared ${data.length} sorted rows for Google Sheets (với STT và ghi chú)`);

      // Header với cột số thứ tự ở đầu và cột ghi chú ở cuối
      const header = [
        'STT',
        'Timestamp',
        'Thời gian',
        'Số điện thoại',
        'Tên người chơi',
        'Giải thưởng',
        'Lượt quay',
        'Ghi chú'
      ];

      console.log(`🗑️ [SPINS] Clearing ${this.SHEET_NAME} sheet để tránh lộn xộn...`);

      // Clear toàn bộ sheet bao gồm tất cả các cột (A:H)
      await sheets.spreadsheets.values.clear({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `${this.SHEET_NAME}!A:H`,
      });

      console.log('📋 [SPINS] Writing header and sorted data (old to new)...');

      // Ghi header + dữ liệu đã sort trong một lần
      const allData = [header, ...data];
      await sheets.spreadsheets.values.update({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `${this.SHEET_NAME}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: allData
        }
      });

      console.log(`✅ [SPINS] Successfully synced ${data.length} recent spins (sorted old to new, với STT và ghi chú)`);
      return true;
    } catch (error) {
      console.error('💥 [SPINS] Error in syncRecentSpinsToSheet:', error);
      if (error instanceof Error) {
        console.error('📋 [SPINS] Error details:', {
          name: error.name,
          message: error.message
        });
      }
      return false;
    } finally {
      this.isSyncing = false;
      console.log('🔓 [SPINS] Sync lock released');
    }
  }

  // Đồng bộ Players sheet riêng biệt với logic bảo toàn dữ liệu và sort
  static async syncPlayersToSheet(players: Player[]): Promise<boolean> {
    console.log(`👥 [PLAYERS] Đồng bộ ${players.length} players...`);
    
    if (!this.SPREADSHEET_ID) {
      console.error('❌ [PLAYERS] Missing SPREADSHEET_ID');
      return false;
    }

    try {
      const auth = this.getAuth();
      const sheets = google.sheets({ version: 'v4', auth });
      console.log('✅ [PLAYERS] Google Sheets client created');

      // Kiểm tra xem có dữ liệu mới không
      if (players.length === 0) {
        console.log('ℹ️ [PLAYERS] Không có dữ liệu players để đồng bộ');
        return true;
      }

      // Sort players theo lastSpinAt mới nhất trước (descending), null ở cuối
      const sortedPlayers = [...players].sort((a, b) => {
        const aTime = a.lastSpinAt || 0;
        const bTime = b.lastSpinAt || 0;
        if (aTime === 0 && bTime === 0) return 0;
        if (aTime === 0) return 1; // null ở cuối
        if (bTime === 0) return -1; // null ở cuối
        return bTime - aTime; // mới nhất trước
      });

      console.log('📊 [PLAYERS] Sample data (first 3, sorted):');
      sortedPlayers.slice(0, 3).forEach((player, index) => {
        const timeStr = player.lastSpinAt 
          ? new Date(player.lastSpinAt).toLocaleString('vi-VN', { 
              timeZone: 'Asia/Ho_Chi_Minh',
              hour12: false 
            })
          : 'Chưa quay';
        console.log(`  ${index + 1}. ${player.name} (${player.phone}) - ${player.spinsUsed} spins - ${timeStr}`);
      });

      // Chuẩn bị dữ liệu người chơi đã sort với cột STT ở đầu
      const data = sortedPlayers.map((player, index) => [
        index + 1, // A: Số thứ tự (bắt đầu từ 1)
        player.phone, // B: Số điện thoại
        player.name, // C: Tên
        player.address || '', // D: Địa chỉ
        player.gender || '', // E: Giới tính
        player.dateOfBirth || '', // F: Ngày sinh
        player.spinsUsed, // G: Lượt đã quay
        player.lastSpinAt ? new Date(player.lastSpinAt).toLocaleString('vi-VN', { 
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false 
        }) : '', // H: Lần quay cuối
      ]);

      console.log(`📝 [PLAYERS] Prepared ${data.length} sorted rows for Google Sheets (với STT)`);

      // Header cho sheet người chơi với cột STT ở đầu
      const header = [
        'STT',
        'Số điện thoại',
        'Tên',
        'Địa chỉ',
        'Giới tính',
        'Ngày sinh',
        'Lượt đã quay',
        'Lần quay cuối'
      ];

      console.log(`🗑️ [PLAYERS] Clearing ${this.PLAYERS_SHEET_NAME} sheet...`);

      // Clear và rewrite để đảm bảo dữ liệu đồng nhất (bao gồm cột STT)
      await sheets.spreadsheets.values.clear({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `${this.PLAYERS_SHEET_NAME}!A:H`,
      });

      console.log('📋 [PLAYERS] Writing header and sorted data...');

      // Ghi header + dữ liệu đã sort trong một lần
      const allData = [header, ...data];
      await sheets.spreadsheets.values.update({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `${this.PLAYERS_SHEET_NAME}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: allData
        }
      });

      console.log(`✅ [PLAYERS] Successfully synced ${data.length} players to ${this.PLAYERS_SHEET_NAME} (sorted by lastSpinAt desc, với STT)`);
      return true;
    } catch (error) {
      console.error('💥 [PLAYERS] Error in syncPlayersToSheet:', error);
      if (error instanceof Error) {
        console.error('📋 [PLAYERS] Error details:', {
          name: error.name,
          message: error.message
        });
      }
      return false;
    }
  }

  // Kiểm tra và đồng bộ dữ liệu mới (một chiều từ Firebase về Google Sheets)
  static async syncNewDataOnly(recentSpins: RecentSpin[], players: Player[]): Promise<boolean> {
    try {
      // Chỉ đồng bộ nếu có dữ liệu mới
      let hasNewData = false;
      
      // Kiểm tra recent spins mới (có timestamp sau lần đồng bộ cuối)
      const newRecentSpins = recentSpins.filter(spin => spin.timestamp > this.lastSyncTime);
      
      if (newRecentSpins.length > 0) {
        await this.syncRecentSpinsToSheet(recentSpins);
        hasNewData = true;
      }

      // Kiểm tra players có thay đổi sau lần đồng bộ cuối
      const playersWithRecentActivity = players.filter(player => 
        player.lastSpinAt && player.lastSpinAt > this.lastSyncTime
      );
      
      if (playersWithRecentActivity.length > 0) {
        await this.syncPlayersToSheet(players);
        hasNewData = true;
      }

      if (hasNewData) {
        // Cập nhật thời gian đồng bộ cuối cùng
        this.lastSyncTime = Date.now();
      }

      return true;
    } catch (error) {
      console.error('❌ Lỗi đồng bộ dữ liệu mới:', error);
      return false;
    }
  }

  // Đồng bộ tất cả dữ liệu (force sync)
  static async syncAllData(recentSpins: RecentSpin[], players: Player[]): Promise<boolean> {
    try {
      const [spinsResult, playersResult] = await Promise.all([
        this.syncRecentSpinsToSheet(recentSpins),
        this.syncPlayersToSheet(players)
      ]);

      return spinsResult && playersResult;
    } catch (error) {
      console.error('❌ Lỗi đồng bộ tất cả dữ liệu:', error);
      return false;
    }
  }

  // Đồng bộ tất cả dữ liệu (force sync) với logging chi tiết
  static async syncIncrementalData(recentSpins: RecentSpin[], players: Player[]): Promise<boolean> {
    try {
      console.log('🔄 [SHEETS] Bắt đầu đồng bộ Google Sheets...');
      console.log(`📊 [SHEETS] Data to sync: ${recentSpins.length} spins, ${players.length} players`);
      
      // Kiểm tra credentials
      if (!this.SPREADSHEET_ID) {
        console.error('❌ [SHEETS] Missing SPREADSHEET_ID');
        return false;
      }

      const auth = this.getAuth();
      console.log('✅ [SHEETS] Auth created successfully');
      
      // Force sync tất cả dữ liệu (không filter theo lastSyncTime)
      const [spinsResult, playersResult] = await Promise.all([
        this.syncRecentSpinsToSheet(recentSpins),
        this.syncPlayersToSheet(players)
      ]);

      console.log(`📈 [SHEETS] Sync results: spins=${spinsResult}, players=${playersResult}`);
      
      const success = spinsResult && playersResult;
      if (success) {
        console.log('✅ [SHEETS] Đồng bộ hoàn thành thành công');
      } else {
        console.error('❌ [SHEETS] Một hoặc cả hai sync thất bại');
      }

      return success;
    } catch (error) {
      console.error('💥 [SHEETS] Exception in syncIncrementalData:', error);
      if (error instanceof Error) {
        console.error('📋 [SHEETS] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 3).join('\n')
        });
      }
      return false;
    }
  }
} 
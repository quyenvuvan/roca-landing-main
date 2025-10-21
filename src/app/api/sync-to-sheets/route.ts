import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { GoogleSheetsSyncService } from '@/lib/google-sheets-sync';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔄 [SYNC] API sync-to-sheets được gọi...');
    
    // Kiểm tra environment variables
    const requiredEnvVars = [
      'SYNC_GOOGLE_SHEETS_ID',
      'SYNC_GOOGLE_SHEETS_NAME', 
      'PLAYERS_GOOGLE_SHEETS_NAME', // Thêm biến mới cho sheet người chơi riêng biệt
      'SYNC_GOOGLE_SERVICE_ACCOUNT_EMAIL',
      'SYNC_GOOGLE_PRIVATE_KEY'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error('❌ [SYNC] Thiếu environment variables:', missingVars);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Thiếu cấu hình environment variables',
          missing: missingVars,
          available: requiredEnvVars.filter(varName => !!process.env[varName])
        },
        { status: 500 }
      );
    }

    console.log('✅ [SYNC] Environment variables OK');
    console.log('📊 [SYNC] Spreadsheet ID:', process.env.SYNC_GOOGLE_SHEETS_ID?.substring(0, 10) + '...');

    // Lấy dữ liệu từ Firebase
    console.log('🔍 [SYNC] Lấy dữ liệu từ Firebase...');
    const recentSpins = await DatabaseService.getRecentSpins(1000);
    const allPlayers = await DatabaseService.getAllPlayers();
    
    console.log(`📈 [SYNC] Firebase data: ${recentSpins.length} spins, ${allPlayers.length} players`);
    
    if (recentSpins.length === 0 && allPlayers.length === 0) {
      console.log('ℹ️ [SYNC] Không có dữ liệu để đồng bộ');
      return NextResponse.json({ 
        success: true, 
        message: 'Không có dữ liệu mới để đồng bộ',
        recentSpinsCount: 0,
        playersCount: 0
      });
    }

    // Log sample data để debug
    if (recentSpins.length > 0) {
      const latestSpin = recentSpins[0];
      console.log('🎯 [SYNC] Latest spin sample:', {
        phone: latestSpin.phone,
        name: latestSpin.name,
        prize: latestSpin.prizeName,
        spinNumber: latestSpin.spinNumber,
        timestamp: latestSpin.timestamp,
        time: new Date(latestSpin.timestamp).toLocaleString('vi-VN')
      });
    }

    // Đồng bộ lên Google Sheets
    console.log('📤 [SYNC] Bắt đầu đồng bộ lên Google Sheets...');
    const syncResult = await GoogleSheetsSyncService.syncIncrementalData(recentSpins, allPlayers);
    
    const duration = Date.now() - startTime;
    
    if (syncResult) {
      console.log(`✅ [SYNC] Đồng bộ thành công trong ${duration}ms`);
      return NextResponse.json({ 
        success: true, 
        message: 'Đồng bộ thành công',
        recentSpinsCount: recentSpins.length,
        playersCount: allPlayers.length,
        duration: `${duration}ms`
      });
    } else {
      console.error('❌ [SYNC] Sync failed - syncResult = false');
      return NextResponse.json(
        { success: false, message: 'Lỗi đồng bộ dữ liệu' },
        { status: 500 }
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('💥 [SYNC] Exception after', duration + 'ms:', error);
    
    // Log chi tiết lỗi
    if (error instanceof Error) {
      console.error('📋 [SYNC] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n')
      });
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi server khi đồng bộ',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      },
      { status: 500 }
    );
  }
} 
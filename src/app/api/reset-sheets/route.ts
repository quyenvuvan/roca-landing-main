import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsSyncService } from '@/lib/google-sheets-sync';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Reset và sync lại toàn bộ dữ liệu clean
    const recentSpins = await DatabaseService.getRecentSpins(1000);
    const allPlayers = await DatabaseService.getAllPlayers();
    
    // Force sync tất cả dữ liệu (sẽ clear và rewrite)
    const syncResult = await GoogleSheetsSyncService.syncIncrementalData(recentSpins, allPlayers);
    
    if (syncResult) {
      return NextResponse.json({ 
        success: true, 
        message: 'Reset và đồng bộ lại thành công',
        recentSpinsCount: recentSpins.length,
        playersCount: allPlayers.length
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Lỗi reset dữ liệu' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi reset' },
      { status: 500 }
    );
  }
} 
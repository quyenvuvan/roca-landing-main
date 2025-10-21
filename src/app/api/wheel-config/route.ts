import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService, WheelConfig } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra query parameter để force refresh
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    let prizes: WheelConfig[];
    
    if (forceRefresh) {
      prizes = await GoogleSheetsService.forceRefresh();
    } else {
      prizes = await GoogleSheetsService.getWheelConfiguration();
    }
    
    // Chỉ lấy 20 ô đầu tiên cho vòng quay
    const wheelPrizes = prizes.slice(0, 20);
    
    return NextResponse.json({
      success: true,
      prizes: wheelPrizes,
      totalPrizes: prizes.length
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch wheel configuration'
      },
      { status: 500 }
    );
  }
}

 
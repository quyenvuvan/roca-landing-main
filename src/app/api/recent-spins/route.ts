import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET() {
  try {
    // Lấy dữ liệu từ Firebase
    const recentSpins = await DatabaseService.getRecentSpins(1000);
    
    return NextResponse.json(recentSpins);
  } catch (error) {
    console.error('Error fetching recent spins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent spins' },
      { status: 500 }
    );
  }
} 
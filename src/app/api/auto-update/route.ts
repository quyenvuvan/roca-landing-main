import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsAutoUpdate } from '@/lib/google-sheets-auto-update';

export async function GET(request: NextRequest) {
  try {
    const status = GoogleSheetsAutoUpdate.getStatus();
    
    return NextResponse.json({ 
      success: true, 
      status: {
        isPolling: status.isPolling,
        lastModified: status.lastModified,
        lastModifiedFormatted: status.lastModified ? new Date(status.lastModified).toLocaleString('vi-VN') : 'Chưa có'
      }
    });
  } catch (error) {
    console.error('❌ Lỗi lấy trạng thái auto-update:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi lấy trạng thái auto-update' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Bắt đầu auto-update
    GoogleSheetsAutoUpdate.startAutoUpdate();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Auto-update đã được bật',
      note: 'Sẽ tự động cập nhật mỗi 60 giây khi có thay đổi trên Google Sheets'
    });
  } catch (error) {
    console.error('❌ Lỗi bật auto-update:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi bật auto-update' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Dừng auto-update
    GoogleSheetsAutoUpdate.stopAutoUpdate();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Auto-update đã được tắt'
    });
  } catch (error) {
    console.error('❌ Lỗi tắt auto-update:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi tắt auto-update' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Force check ngay lập tức
    const hasChanges = await GoogleSheetsAutoUpdate.forceCheck();
    
    return NextResponse.json({ 
      success: true, 
      message: hasChanges ? 'Phát hiện thay đổi và đã cập nhật cache' : 'Không có thay đổi',
      hasChanges: hasChanges
    });
  } catch (error) {
    console.error('❌ Lỗi force check:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi force check' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// File to store registration count
const REGISTRATION_COUNT_FILE = path.join(process.cwd(), 'data', 'registration-count.json');

// Add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return addCorsHeaders(response);
}

// Function to get current registration count
async function getRegistrationCount(): Promise<number> {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(REGISTRATION_COUNT_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    const data = await fs.readFile(REGISTRATION_COUNT_FILE, 'utf-8');
    const { count } = JSON.parse(data);
    return count || 0;
  } catch (error) {
    // If file doesn't exist or is invalid, return 0
    return 0;
  }
}

export async function GET() {
  try {
    const count = await getRegistrationCount();
    
    const response = NextResponse.json({
      success: true,
      count: count
    });
    
    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error getting registration count:', error);
    const errorResponse = NextResponse.json({
      success: false,
      error: 'Không thể lấy số lượng đăng ký',
      count: 0
    }, { status: 500 });
    return addCorsHeaders(errorResponse);
  }
} 
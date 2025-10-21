export interface Prize {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string; // Optional image URL
  probability: number;
  color: string;
  description: string;
  category: string;
}

export interface Player {
  phone: string; // Sử dụng phone làm ID chính
  name: string;
  address?: string; // Không bắt buộc
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  totalScore: number;
  spinsUsed: number;
  maxSpinsPerDay: number;
  lastSpinDate?: string; // Ngày quay cuối cùng (YYYY-MM-DD)
  prizes: string[];
  createdAt: number;
  lastSpinAt?: number;
}

export interface RecentSpin {
  id: string;
  phone: string;
  name: string;
  prizeName: string;
  prizeId: string;
  timestamp: number;
  spinNumber: number; // Lượt quay thứ mấy trong ngày
}

export interface GameSession {
  id: string;
  playerId: string;
  startTime: number;
  endTime?: number;
  totalSpins: number;
  totalScore: number;
  prizesWon: Prize[];
}

export interface Leaderboard {
  daily: Player[];
  weekly: Player[];
  monthly: Player[];
  allTime: Player[];
}

export interface GameStats {
  totalPlayers: number;
  totalSpins: number;
  totalPrizesWon: number;
  totalScores: number;
} 
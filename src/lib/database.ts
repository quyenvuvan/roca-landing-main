import { database } from './firebase';
import { ref, push, set, get, update, query, orderByChild, limitToLast, equalTo, remove } from 'firebase/database';
import { Player, Prize, GameSession, GameStats, RecentSpin } from '@/types/game';

// Helper function để lấy timestamp UTC (sẽ được convert sang Vietnam time khi hiển thị)
const getVietnamTimestamp = (): number => {
  // Chỉ dùng UTC timestamp, conversion sang Vietnam time sẽ được handle ở UI
  return Date.now();
};

// Helper function để tạo session ID unique
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function để validate GameStats
const validateGameStats = (stats: Partial<GameStats>): GameStats => {
  return {
    totalPlayers: Math.max(0, Math.floor(stats.totalPlayers || 0)),
    totalSpins: Math.max(0, Math.floor(stats.totalSpins || 0)),
    totalPrizesWon: Math.max(0, Math.floor(stats.totalPrizesWon || 0)),
    totalScores: Math.max(0, Math.floor(stats.totalScores || 0))
  };
};

export class DatabaseService {
  // Player operations
  static async createPlayer(playerData: Omit<Player, 'createdAt'>): Promise<string | null> {
    if (!database) return null;
    
    try {
      const phone = playerData.phone;
      const playerRef = ref(database, `players/${phone}`);
      
      // Đảm bảo prizes luôn là array
      const player: Player = {
        ...playerData,
        prizes: playerData.prizes || [],
        createdAt: getVietnamTimestamp()
      };
      
      await set(playerRef, player);
      return phone;
    } catch (error) {
      console.error('Error creating player:', error);
      return null;
    }
  }

  static async getPlayer(phone: string): Promise<Player | null> {
    if (!database) return null;
    
    try {
      const playerRef = ref(database, `players/${phone}`);
      const snapshot = await get(playerRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting player:', error);
      return null;
    }
  }

  static async updatePlayer(phone: string, updates: Partial<Player>): Promise<boolean> {
    if (!database) return false;
    
    try {
      const playerRef = ref(database, `players/${phone}`);
      
      // Đảm bảo prizes được xử lý đúng
      const cleanUpdates = { ...updates };
      if (cleanUpdates.prizes && !Array.isArray(cleanUpdates.prizes)) {
        cleanUpdates.prizes = [];
      }
      
      await update(playerRef, cleanUpdates);
      return true;
    } catch (error) {
      console.error('Error updating player:', error);
      return false;
    }
  }

  // Game session operations
  static async createGameSession(sessionData: Omit<GameSession, 'id'>): Promise<string | null> {
    if (!database) return null;
    
    try {
      const sessionsRef = ref(database, 'gameSessions');
      const newSessionRef = push(sessionsRef);
      
      const session: GameSession = {
        ...sessionData,
        id: newSessionRef.key!
      };
      
      await set(newSessionRef, session);
      return newSessionRef.key;
    } catch (error) {
      console.error('Error creating game session:', error);
      return null;
    }
  }

  // Leaderboard operations - Sắp xếp theo người chơi gần đây
  static async getTopPlayers(limit: number = 10): Promise<Player[]> {
    if (!database) return [];
    
    try {
      const playersRef = ref(database, 'players');
      
      // Lấy tất cả players và sort local (không cần index)
      const snapshot = await get(playersRef);
      if (!snapshot.exists()) return [];
      
      const players: Player[] = [];
      snapshot.forEach((childSnapshot) => {
        players.push(childSnapshot.val());
      });
      
      // Sort theo lastSpinAt giảm dần (người chơi gần đây trước)
      players.sort((a, b) => (b.lastSpinAt || 0) - (a.lastSpinAt || 0));
      
      return players.slice(0, limit);
    } catch (error) {
      console.error('Error getting top players:', error);
      return [];
    }
  }



  // Stats operations
  static async getGameStats(): Promise<GameStats | null> {
    if (!database) return null;
    
    try {
      const statsRef = ref(database, 'gameStats');
      const snapshot = await get(statsRef);
      
      if (snapshot.exists()) {
        return validateGameStats(snapshot.val());
      } else {
        // Khởi tạo stats mặc định nếu chưa có
        const defaultStats = validateGameStats({});
        await set(statsRef, defaultStats);
        return defaultStats;
      }
    } catch (error) {
      console.error('Error getting game stats:', error);
      return null;
    }
  }

  static async updateGameStats(updates: Partial<GameStats>): Promise<boolean> {
    if (!database) return false;
    
    try {
      // Validate và clean up dữ liệu trước khi update
      const cleanUpdates: Partial<GameStats> = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
          cleanUpdates[key as keyof GameStats] = Math.max(0, Math.floor(value));
        }
      });
      
      if (Object.keys(cleanUpdates).length === 0) {
        console.warn('No valid updates provided to updateGameStats');
        return false;
      }
      
      const statsRef = ref(database, 'gameStats');
      await update(statsRef, cleanUpdates);
      return true;
    } catch (error) {
      console.error('Error updating game stats:', error);
      return false;
    }
  }

  // Prize operations
  static async recordPrizeWon(phone: string, prize: Prize): Promise<boolean> {
    if (!database) return false;
    
    try {
      const player = await this.getPlayer(phone);
      if (!player) return false;
      
      const updates = {
        prizes: [...(player.prizes || []), prize.name]
      };
      
      return await this.updatePlayer(phone, updates);
    } catch (error) {
      console.error('Error recording prize won:', error);
      return false;
    }
  }

  // Utility methods
  static async incrementPlayerSpins(phone: string): Promise<boolean> {
    if (!database) return false;
    
    try {
      console.log('🔍 [INCREMENT-SPINS] Starting increment for phone:', phone);
      
      const player = await this.getPlayer(phone);
      if (!player) {
        console.log('❌ [INCREMENT-SPINS] Player not found');
        return false;
      }
      
      const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD format
      const lastSpinDate = player.lastSpinDate;
      
      let spinsUsed = player.spinsUsed;
      
      console.log('🔍 [INCREMENT-SPINS] Current state:', {
        playerName: player.name,
        currentSpinsUsed: player.spinsUsed,
        maxSpinsPerDay: player.maxSpinsPerDay,
        lastSpinDate: lastSpinDate,
        today: today,
        isSameDay: lastSpinDate === today
      });
      
      // Nếu ngày hôm nay khác ngày quay cuối thì reset về 0 rồi tăng lên 1
      if (lastSpinDate !== today) {
        spinsUsed = 1; // Reset và tăng lên 1 cho lượt đầu tiên của ngày mới
        console.log('✅ [INCREMENT-SPINS] New day, resetting to 1');
      } else {
        spinsUsed = player.spinsUsed + 1; // Tăng bình thường
        console.log('✅ [INCREMENT-SPINS] Same day, incrementing to:', spinsUsed);
      }
      
      const updates = {
        spinsUsed: spinsUsed,
        lastSpinAt: Date.now(),
        lastSpinDate: today
      };
      
      console.log('💾 [INCREMENT-SPINS] Updating player with:', updates);
      
      const result = await this.updatePlayer(phone, updates);
      console.log('✅ [INCREMENT-SPINS] Update result:', result);
      
      return result;
    } catch (error) {
      console.error('❌ [INCREMENT-SPINS] Error incrementing player spins:', error);
      return false;
    }
  }

  static async addPointsToPlayer(phone: string, points: number): Promise<boolean> {
    if (!database) return false;
    
    try {
      const player = await this.getPlayer(phone);
      if (!player) return false;
      
      const updates = {
        totalScore: player.totalScore + points
      };
      
      return await this.updatePlayer(phone, updates);
    } catch (error) {
      console.error('Error adding points to player:', error);
      return false;
    }
  }

  // Recent spins operations
  static async recordRecentSpin(player: Player, prize: Prize, spinNumber: number): Promise<boolean> {
    if (!database) return false;
    
    try {
      const recentSpinsRef = ref(database, 'recentSpins');
      
      // Sử dụng timestamp Việt Nam làm key để đảm bảo unique
      const timestamp = getVietnamTimestamp();
      const spinKey = `spin_${timestamp}_${player.phone}_${spinNumber}`;
      const spinRef = ref(database, `recentSpins/${spinKey}`);
      
      const recentSpin: RecentSpin = {
        id: spinKey,
        phone: player.phone,
        name: player.name,
        prizeName: prize.name,
        prizeId: prize.id,
        timestamp: timestamp,
        spinNumber: spinNumber
      };
      
      await set(spinRef, recentSpin);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getRecentSpins(limit: number = 1000): Promise<RecentSpin[]> {
    if (!database) return [];
    
    try {
      const recentSpinsRef = ref(database, 'recentSpins');
      
      // Lấy tất cả dữ liệu và sort local (không cần index)
      const snapshot = await get(recentSpinsRef);
      if (!snapshot.exists()) return [];
      
      const recentSpins: RecentSpin[] = [];
      snapshot.forEach((childSnapshot) => {
        recentSpins.push(childSnapshot.val());
      });
      
      // Sort theo timestamp giảm dần (mới nhất trước)
      recentSpins.sort((a, b) => b.timestamp - a.timestamp);
      
      // Lấy số lượng theo limit
      return recentSpins.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent spins:', error);
      return [];
    }
  }

  // ===== ANTI-CHEAT: Pending Spins Management =====
  






  static async getAllPlayers(): Promise<Player[]> {
    if (!database) return [];
    
    try {
      const playersRef = ref(database, 'players');
      const snapshot = await get(playersRef);
      
      if (!snapshot.exists()) return [];
      
      const players: Player[] = [];
      snapshot.forEach((childSnapshot) => {
        players.push(childSnapshot.val());
      });
      
      return players;
    } catch (error) {
      console.error('Error getting all players:', error);
      return [];
    }
  }

  // Player history operations
  static async getPlayerHistory(phone: string): Promise<{
    player: Player | null;
    prizes: any[];
    sessions: any[];
  }> {
    if (!database) return { player: null, prizes: [], sessions: [] };
    
    try {
      // Lấy thông tin player
      const player = await this.getPlayer(phone);
      
      // Lấy lịch sử giải thưởng
      const prizesRef = ref(database, 'prizesWon');
      const prizesQuery = query(prizesRef, orderByChild('phone'), equalTo(phone));
      const prizesSnapshot = await get(prizesQuery);
      
      const prizes: any[] = [];
      if (prizesSnapshot.exists()) {
        prizesSnapshot.forEach((childSnapshot) => {
          prizes.push(childSnapshot.val());
        });
      }
      
      // Lấy lịch sử game sessions
      const sessionsRef = ref(database, 'gameSessions');
      const sessionsQuery = query(sessionsRef, orderByChild('phone'), equalTo(phone));
      const sessionsSnapshot = await get(sessionsQuery);
      
      const sessions: any[] = [];
      if (sessionsSnapshot.exists()) {
        sessionsSnapshot.forEach((childSnapshot) => {
          sessions.push(childSnapshot.val());
        });
      }
      
      return {
        player,
        prizes: prizes.sort((a, b) => b.timestamp - a.timestamp),
        sessions: sessions.sort((a, b) => b.startTime - a.startTime)
      };
    } catch (error) {
      console.error('Error getting player history:', error);
      return { player: null, prizes: [], sessions: [] };
    }
  }
} 
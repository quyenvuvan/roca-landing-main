'use client';

import { useState, useEffect } from 'react';
import { content as contentData } from '@/data/content';
import { FaTrophy, FaBeer, FaUtensils, FaStar, FaUsers, FaTimes, FaUser, FaMobile, FaMapMarked, FaVenus, FaMars, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import SpinWheel from '@/components/game/SpinWheel';
import NotificationModal from '@/components/game/NotificationModal';
import PlayerForm from '@/components/game/PlayerForm';
import PhoneCheckForm from '@/components/game/PhoneCheckForm';
import { Prize, Player, GameStats } from '@/types/game';
import { DatabaseService } from '@/lib/database';
import { ref, get, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { WheelConfig } from '@/lib/google-sheets';

interface RecentSpin {
  timestamp: number;
  phone: string;
  name: string;
  prizeName: string;
}

// Format number function to avoid hydration mismatch
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Empty prizes array - sẽ được load từ Google Sheets
const defaultPrizes: Prize[] = [];

export default function SpinWheelPage() {
  const content = contentData as any;
  // ===== WORKFLOW STATE MANAGEMENT =====
  
  // Step 1: Load Config State
  const [prizes, setPrizes] = useState<Prize[]>(defaultPrizes);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  
  // Step 2: User Registration State
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showPhoneCheck, setShowPhoneCheck] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPhone, setCurrentPhone] = useState<string>('');
  const [hasCheckedPhone, setHasCheckedPhone] = useState<boolean>(false);
  const [firstTimeUser, setFirstTimeUser] = useState(true);
  const [lastWonPrize, setLastWonPrize] = useState<Prize | null>(null);
  
  // Step 3: Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Step 4: Data Display State
  const [recentSpins, setRecentSpins] = useState<RecentSpin[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPlayers: 0,
    totalSpins: 0,
    totalPrizesWon: 0,
    totalScores: 0
  });

  // Session management
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  
  // Notification state
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  
  // Spin result modal state
  const [showSpinResult, setShowSpinResult] = useState(false);
  
  // Trigger spin state
  const [triggerSpin, setTriggerSpin] = useState(false);

  // ===== WORKFLOW STEP 1: LOAD CONFIG =====
  useEffect(() => {
    // Guard: redirect or block if mini game disabled
    if (typeof window !== 'undefined' && content?.features && content.features.enableMiniGame === false) {
      window.location.href = '/';
      return;
    }
    setIsClient(true);
    
    // Tạo session ID unique cho anti-cheat
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSessionId(sessionId);
    
    // Bắt đầu auto-update Google Sheets
    const startAutoUpdate = async () => {
      try {
        await fetch('/api/auto-update', { method: 'POST' });
      } catch (error) {
        // Silent error handling
      }
    };
    
    startAutoUpdate();
    
    // Step 1: Load Wheel Configuration from Google Sheets
    loadWheelConfiguration();
    
    // Step 4: Load Display Data
    loadGameStats();
    loadRecentSpins();
    
    // Check if user has played before
    const hasPlayed = localStorage.getItem('hasPlayedBefore');
    if (hasPlayed) {
      setFirstTimeUser(false);
    }
    
    // Cleanup khi component unmount
    return () => {
      // Dừng auto-update khi component unmount
      fetch('/api/auto-update', { method: 'DELETE' }).catch(() => {
        // Silent error handling
      });
    };
  }, []);

  const loadGameStats = async () => {
    const stats = await DatabaseService.getGameStats();
    if (stats) {
      // Validate và clean up dữ liệu stats
      const cleanStats: GameStats = {
        totalPlayers: Math.max(0, Math.floor(stats.totalPlayers || 0)),
        totalSpins: Math.max(0, Math.floor(stats.totalSpins || 0)),
        totalPrizesWon: Math.max(0, Math.floor(stats.totalPrizesWon || 0)),
        totalScores: Math.max(0, Math.floor(stats.totalScores || 0))
      };
      setGameStats(cleanStats);
    }
  };

  const loadRecentSpins = async () => {
    try {
      const response = await fetch('/api/recent-spins');
      if (!response.ok) throw new Error('Failed to fetch recent spins');
      const data: RecentSpin[] = await response.json();
      setRecentSpins(data);
    } catch (error) {
      // Silent error handling
    }
  };

  const loadWheelConfiguration = async () => {
    try {
      const response = await fetch('/api/wheel-config');
      if (!response.ok) throw new Error('Failed to fetch wheel config');
      
      const data = await response.json();
      if (data.prizes && data.prizes.length > 0) {
        setPrizes(data.prizes);
        setConfigLoaded(true);
        setConfigError(null);
      } else {
        setPrizes([]);
        setConfigLoaded(false);
        setConfigError('Không tìm thấy cấu hình giải thưởng');
      }
    } catch (error) {
      setPrizes([]);
      setConfigLoaded(false);
      setConfigError('Lỗi tải cấu hình vòng quay');
    }
  };

  const handleFirstTimeSpin = async (prize: Prize) => {
    try {
      setLoading(true);
      
      setLastWonPrize(prize);
      localStorage.setItem('hasPlayedBefore', 'true');
      setFirstTimeUser(false);
      
      // Show registration form after showing result (after wheel result modal is closed)
      setTimeout(() => {
        setShowForm(true);
      }, 1000);
      
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const validatePlayer = (player: Player): Player => {
    return {
      ...player,
      prizes: Array.isArray(player.prizes) ? player.prizes : [],
      spinsUsed: typeof player.spinsUsed === 'number' ? player.spinsUsed : 0,
      maxSpinsPerDay: typeof player.maxSpinsPerDay === 'number' ? player.maxSpinsPerDay : 1,
      totalScore: typeof player.totalScore === 'number' ? player.totalScore : 0
    };
  };

  const checkAndPerformSpin = async (player: Player) => {
    try {
      // Validate player data trước khi sử dụng
      const validatedPlayer = validatePlayer(player);
      
      // Check player spin eligibility
      
      // Kiểm tra xem đã quay hôm nay chưa
      const today = new Date().toLocaleDateString('sv-SE');
      const lastSpinDate = validatedPlayer.lastSpinDate;
      
      if (lastSpinDate === today && validatedPlayer.spinsUsed >= validatedPlayer.maxSpinsPerDay) {
        // Đã quay hôm nay rồi - hiển thị thông báo
        showNotification(
          'Đã quay hôm nay! 🎯',
          'Bạn đã sử dụng hết lượt quay hôm nay. Vui lòng quay lại vào ngày mai để có cơ hội nhận thêm phần thưởng!',
          'warning'
        );
        setShowForm(false);
        setShowSpinResult(false);
        setLastWonPrize(null);
        return;
      }
      
      // Chưa quay hôm nay - trigger vòng quay thật
      setTriggerSpin(true);
      
    } catch (error) {
      showNotification(
        'Có lỗi xảy ra! ❌',
        'Đã có lỗi xảy ra khi kiểm tra và thực hiện quay. Vui lòng thử lại sau.',
        'error'
      );
    }
  };

  const performSpin = async (player: Player) => {
    try {
      // Validate player data trước khi sử dụng
      const validatedPlayer = validatePlayer(player);
      
      // Start spin for player
      
      // Kiểm tra xem đã quay hôm nay chưa
      const today = new Date().toLocaleDateString('sv-SE');
      const lastSpinDate = validatedPlayer.lastSpinDate;
      
      if (lastSpinDate === today && validatedPlayer.spinsUsed >= validatedPlayer.maxSpinsPerDay) {
        // Đã quay hôm nay rồi - hiển thị thông báo đẹp và tắt popup phần thưởng
        showNotification(
          'Đã quay hôm nay! 🎯',
          'Bạn đã sử dụng hết lượt quay hôm nay. Vui lòng quay lại vào ngày mai để có cơ hội nhận thêm phần thưởng!',
          'warning'
        );
        setShowForm(false);
        setShowSpinResult(false); // Tắt popup phần thưởng
        setLastWonPrize(null); // Reset prize
        return;
      }
      
      // Chưa quay hôm nay - trigger vòng quay thật
      setTriggerSpin(true);
      
    } catch (error) {
      showNotification(
        'Có lỗi xảy ra! ❌',
        'Đã có lỗi xảy ra khi thực hiện quay. Vui lòng thử lại sau.',
        'error'
      );
    }
  };

  // ===== WORKFLOW STEP 2: USER REGISTRATION (ANTI-CHEAT) =====
  const handlePlayerRegistration = async (playerData: {
    name: string;
    phone: string;
    address?: string;
    gender?: string;
    dateOfBirth?: string;
  }) => {
    setLoading(true);
    
    try {
      // Kiểm tra xem player đã tồn tại chưa
      const existingPlayer = await DatabaseService.getPlayer(playerData.phone);
      
      if (existingPlayer) {
        // Validate player data
        const validatedExistingPlayer = validatePlayer(existingPlayer);
        
        // Cập nhật thông tin player
        await DatabaseService.updatePlayer(playerData.phone, {
          name: playerData.name,
          ...(playerData.address && { address: playerData.address }),
          ...(playerData.gender && { gender: playerData.gender as 'male' | 'female' | 'other' }),
          ...(playerData.dateOfBirth && { dateOfBirth: playerData.dateOfBirth })
        });
        
        const updatedPlayer = await DatabaseService.getPlayer(playerData.phone);
        if (updatedPlayer) {
          const validatedUpdatedPlayer = validatePlayer(updatedPlayer);
          setCurrentPlayer(validatedUpdatedPlayer);
          setShowForm(false);
          setGameStarted(true);
          
          // Check giới hạn trước khi cho quay
          await checkAndPerformSpin(validatedUpdatedPlayer);
        }
      } else {
        // Tạo player mới và cho quay
        const cleanPlayerData = {
          name: playerData.name,
          phone: playerData.phone,
          ...(playerData.address && { address: playerData.address }),
          ...(playerData.gender && { gender: playerData.gender as 'male' | 'female' | 'other' }),
          ...(playerData.dateOfBirth && { dateOfBirth: playerData.dateOfBirth }),
          totalScore: 0,
          spinsUsed: 0,
          maxSpinsPerDay: 1,
          prizes: [] // Đảm bảo prizes là array rỗng
        };

        const phone = await DatabaseService.createPlayer(cleanPlayerData);
        
        if (phone) {
          const newPlayer = await DatabaseService.getPlayer(phone);
          if (newPlayer) {
            const validatedNewPlayer = validatePlayer(newPlayer);
            setCurrentPlayer(validatedNewPlayer);
            setShowForm(false);
            setGameStarted(true);
            
            // Check giới hạn trước khi cho quay
            await checkAndPerformSpin(validatedNewPlayer);
          }
        }
      }
    } catch (error) {
      showNotification(
        'Có lỗi xảy ra! ❌',
        'Đã có lỗi xảy ra khi đăng ký thông tin. Vui lòng thử lại sau.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== WORKFLOW STEP 3: SPIN & SAVE (ANTI-CHEAT) =====
  const handleSpinResult = async (prize: Prize) => {
    if (triggerSpin) {
      // Đây là kết quả quay thật sau khi đăng ký và check giới hạn
      try {
        if (!currentPlayer) return;
        
        const validatedPlayer = validatePlayer(currentPlayer);
        
        // Lưu spin result
        const spinNumber = validatedPlayer.spinsUsed + 1;
        await DatabaseService.recordRecentSpin(validatedPlayer, prize, spinNumber);
        await DatabaseService.incrementPlayerSpins(validatedPlayer.phone);
        await DatabaseService.recordPrizeWon(validatedPlayer.phone, prize);
        
        // Update local state
        const today = new Date().toLocaleDateString('sv-SE');
        const currentPrizes = validatedPlayer.prizes || [];
        
        const updatedPlayer = {
          ...validatedPlayer,
          spinsUsed: spinNumber,
          lastSpinDate: today,
          prizes: [...currentPrizes, prize.name],
          lastSpinAt: Date.now()
        };
        setCurrentPlayer(updatedPlayer);
        
        // Hiển thị kết quả
        setLastWonPrize(prize);
        setShowSpinResult(true);
        
        // Sync to Google Sheets
        try {
          await fetch('/api/sync-to-sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (syncError) {
          // Silent error handling
        }
        
        loadRecentSpins();
        
        // Update game stats
        const currentStats = await DatabaseService.getGameStats() || {
          totalPlayers: 0,
          totalSpins: 0,
          totalPrizesWon: 0,
          totalScores: 0
        };
        
        await DatabaseService.updateGameStats({
          totalSpins: (currentStats.totalSpins || 0) + 1,
          totalPrizesWon: (currentStats.totalPrizesWon || 0) + 1
        });
        
        loadGameStats();
        
        // Reset trigger
        setTriggerSpin(false);
        
      } catch (error) {
        showNotification(
          'Có lỗi xảy ra! ❌',
          'Đã có lỗi xảy ra khi xử lý kết quả quay. Vui lòng thử lại sau.',
          'error'
        );
        setTriggerSpin(false);
      }
    } else {
      // Đây là bấm quay ban đầu - LUÔN hiện form đăng ký trước
      setShowForm(true);
    }
  };

  const resetGame = async () => {
    setCurrentPlayer(null);
    setGameStarted(false);
    setShowForm(false);
    setShowPhoneCheck(false);
    setFirstTimeUser(true);
    setLastWonPrize(null);
    setCurrentPhone('');
    setHasCheckedPhone(false);
    localStorage.removeItem('hasPlayedBefore');
    localStorage.removeItem('currentPhone');
  };

  const getRemainingSpins = () => {
    if (!currentPlayer) return 0;
    
    // Kiểm tra xem hôm nay đã quay chưa
    const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD format
    const lastSpinDate = currentPlayer.lastSpinDate;
    
    // Nếu ngày hôm nay khác ngày quay cuối thì reset về 1 lượt
    if (lastSpinDate !== today) {
      return 1; // Còn 1 lượt cho ngày mới
    }
    
    // Nếu đã quay hôm nay rồi thì kiểm tra số lượt đã dùng
    return Math.max(0, currentPlayer.maxSpinsPerDay - currentPlayer.spinsUsed);
  };

  // ===== WORKFLOW STEP 2: USER REGISTRATION =====
  const handlePhoneCheck = async (phone: string): Promise<Player | null> => {
    try {
      const player = await DatabaseService.getPlayer(phone);
      return player;
    } catch (error) {
      return null;
    }
  };

  const handlePlayerFound = async (player: Player) => {
    setCurrentPlayer(player);
    setGameStarted(true);
    setShowPhoneCheck(false);
    setCurrentPhone(player.phone);
    setHasCheckedPhone(true);
    
    // Lưu phone vào localStorage để track user
    localStorage.setItem('currentPhone', player.phone);
  };

  const handlePlayerNotFound = (phone: string) => {
    setShowPhoneCheck(false);
    setFirstTimeUser(true);
    setCurrentPhone(phone);
    setHasCheckedPhone(true);
    // Show the spin wheel for first time users
    setGameStarted(true);
  };

  const handleStartGame = async () => {
    if (!currentPlayer) return;

    setGameStarted(true);
    setShowPhoneCheck(false);
  };

  const showNotification = (title: string, message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    setNotification({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };


  return (
    <div className="bg-amber-50 text-amber-900 p-4">
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-yellow-400/10 to-amber-500/10"></div>
        <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16 text-center">
          <div className="mb-2 sm:mb-6">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent leading-tight">
              Vòng Quay May Mắn
            </h1>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-amber-800">
              🏛️ XUYÊN VIỆT COOP 🎰
            </h2>
            <div className="mt-6">
              <a 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaArrowLeft className="mr-2" />
                Về Trang Chủ
              </a>
            </div>
          </div>
          

        </div>
      </section>

      {/* Main Game Section */}
      <section id="game" className="container mx-auto px-4 py-2">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Sidebar - Rules */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 lg:p-7 border border-amber-200 shadow-lg mb-8">
              <h3 className="text-xl lg:text-2xl font-bold text-amber-800 mb-5 flex items-center">
                📋 Cách Thức Tham Gia
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-bold text-amber-800 text-base">Quay Vòng May Mắn</p>
                    <p className="text-amber-700 text-sm">Bấm vào quay ngay để bắt đầu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-bold text-amber-800 text-base">Xem Kết Quả</p>
                    <p className="text-amber-700 text-sm">Nhận ngay phần thưởng may mắn</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-bold text-amber-800 text-base">Đăng Ký Nhận Quà</p>
                    <p className="text-amber-700 text-sm">Điền thông tin để nhận thưởng</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-700 text-white rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">4</div>
                  <div>
                    <p className="font-bold text-amber-800 text-base">Thưởng Thức</p>
                    <p className="text-amber-700 text-sm">Enjoy những món ngon đặc sắc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Spin Wheel */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="text-center">
              {prizes.length > 0 ? (
                <SpinWheel 
                  prizes={prizes}
                  onSpinResult={handleSpinResult}
                  disabled={!!(currentPlayer && getRemainingSpins() <= 0)} // Kiểm tra giới hạn 1 ngày/lần
                  triggerSpin={triggerSpin}
                />
              ) : (
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 border border-amber-200 shadow-lg">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-amber-800 mb-4">Đang Tải Cấu Hình Vòng Quay</h3>
                  <p className="text-amber-700 mb-4">Vui lòng đợi trong giây lát...</p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                </div>
              )}
              
              {currentPlayer && (
                <div className="mt-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 border border-amber-200 shadow-lg">
                    <h3 className="font-bold text-amber-800 mb-3 text-lg">Chào {currentPlayer.name}! 🍺</h3>
                    <div className="flex justify-center gap-6 text-base">
                      <span className="text-amber-700">Lượt: <strong className="text-amber-700 text-lg">{currentPlayer.spinsUsed}/{currentPlayer.maxSpinsPerDay}</strong></span>
                    </div>
                    {getRemainingSpins() <= 0 && (
                      <p className="text-base text-amber-600 mt-3 font-semibold">Đã quay hôm nay. Quay lại vào ngày mai!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Prizes */}
          <div className="lg:col-span-1 order-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 lg:p-7 border border-amber-200 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-full mb-4 shadow-lg">
                  <span className="text-3xl">🎁</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-amber-800 bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
                  PHẦN THƯỞNG HẤP DẪN
                </h3>
                <p className="text-amber-700 text-sm mt-2 font-semibold">Cơ hội trúng thưởng hấp dẫn!</p>
              </div>
              <div className="space-y-5">
                {prizes.length > 0 ? (
                  prizes.map((prize) => (
                    <div key={prize.id} className="group hover:scale-105 transition-all duration-300 cursor-pointer">
                      <div className="relative overflow-hidden rounded-xl border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-300">
                        <div className="flex items-center space-x-5 p-5">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-amber-100 to-yellow-100 border-3 border-amber-300">
                              {prize.imageUrl ? (
                                <img src={prize.imageUrl} alt={prize.name} className="w-10 h-10 object-contain" />
                              ) : (
                                <span className="text-3xl">{prize.icon}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-bold text-base truncate text-amber-800">{prize.name}</p>
                            </div>
                            
                            {prize.description && prize.description.trim() !== '' && (
                              <p className="text-sm leading-relaxed text-amber-700">{prize.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎁</div>
                    <p className="text-amber-700">Đang tải danh sách giải thưởng...</p>
                  </div>
                )}
              </div>
            </div>

                         {/* Recent Spins */}
             {recentSpins.length > 0 && (
               <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 lg:p-7 border border-amber-200 shadow-lg mt-8">
                 <h3 className="text-xl font-bold text-amber-800 mb-5 flex items-center">
                   <FaUsers className="text-yellow-600 mr-3 text-xl" />
                   Khách Hàng Quay Gần Đây
                 </h3>
                 <div className="space-y-3 max-h-80 overflow-y-auto">
                   {recentSpins.slice(0, 10).map((spin, index) => (
                     <div key={`${spin.phone}-${spin.timestamp}`} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                       <div className="flex items-center space-x-3 min-w-0 flex-1">
                         <span className="text-base flex-shrink-0">🎁</span>
                         <div className="min-w-0 flex-1">
                           <span className="text-amber-800 font-bold text-sm truncate block">{spin.name}</span>
                           <span className="text-amber-600 text-xs truncate block">Trúng: {spin.prizeName}</span>
                         </div>
                       </div>
                       <div className="text-right flex-shrink-0">
                         <span className="text-amber-600 text-xs block">
                           {isClient ? new Date(spin.timestamp).toLocaleTimeString('vi-VN', { 
                             timeZone: 'Asia/Ho_Chi_Minh',
                             hour: '2-digit' as const, 
                             minute: '2-digit' as const
                           }) : ''}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>
            
        {/* Phone Check Form Modal */}
        {showPhoneCheck && (
          <PhoneCheckForm
            onPlayerFound={handlePlayerFound}
            onPlayerNotFound={handlePlayerNotFound}
            onCancel={() => setShowPhoneCheck(false)}
            onCheckPhone={handlePhoneCheck}
          />
        )}

        {/* Registration Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-10 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200 font-sans">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5 sm:mb-8 text-amber-800 font-sans">
                👑 Đăng Ký Để Quay
              </h2>
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 mb-6 border border-amber-200">
                <p className="text-center text-amber-800 text-base font-semibold font-sans">
                  🎯 Điền thông tin để bắt đầu quay may mắn!
                </p>
                <p className="text-center text-amber-700 text-sm mt-2 font-sans">
                  Sau khi đăng ký, bạn sẽ được quay ngay lập tức!
                </p>
              </div>
              <PlayerForm 
                onSubmit={handlePlayerRegistration}
                onCancel={resetGame}
                phone={currentPhone}
              />
            </div>
          </div>
        )}

        {/* Game Completion */}
        {gameStarted && currentPlayer && getRemainingSpins() <= 0 && (
          <div className="mt-10 text-center bg-white/95 backdrop-blur-sm rounded-xl p-8 border border-amber-200 shadow-lg max-w-lg mx-auto font-sans">
            <h3 className="text-2xl font-bold mb-4 text-amber-800 font-sans">🎊 Cảm ơn quý khách!</h3>
            <p className="mb-6 text-amber-700 text-lg leading-relaxed font-sans">Quý khách đã sử dụng lượt quay hôm nay. Hãy quay lại vào ngày mai để nhận thêm ưu đãi!</p>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg font-sans"
            >
              Chơi Lại
            </button>
          </div>
        )}

      </section>
      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Spin Result Modal */}
      {showSpinResult && lastWonPrize && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-10 max-w-lg w-full shadow-2xl border border-amber-200 font-sans">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5 sm:mb-8 text-amber-800 font-sans">
              🎉 Chúc Mừng!
            </h2>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 mb-6 border border-amber-200">
              <p className="text-center text-amber-800 text-base font-semibold font-sans">
                Bạn đã trúng: <strong className="text-amber-700 font-sans">{lastWonPrize.name}</strong>
              </p>
              <p className="text-center text-amber-700 text-sm mt-2 font-sans">
                Vui lòng liên hệ để nhận thưởng!
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSpinResult(false);
                  setLastWonPrize(null);
                }}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg font-sans"
              >
                Đã Hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { Prize } from '@/types/game';

// Dynamic import for confetti to avoid SSR issues
let confetti: any = null;
if (typeof window !== 'undefined') {
  import('canvas-confetti').then((module) => {
    confetti = module.default;
  });
}

interface SpinWheelProps {
  prizes: Prize[];
  onSpinResult: (prize: Prize) => void;
  disabled?: boolean;
  triggerSpin?: boolean;
}


export default function SpinWheel({ prizes, onSpinResult, disabled = false, triggerSpin = false }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true); // Mặc định bật âm thanh
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Audio refs for sound effects
  const spinStartAudioRef = useRef<HTMLAudioElement | null>(null);
  const spinStopAudioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate segment angle for each prize
  const segmentAngle = 360 / prizes.length;

  // Initialize audio elements
  useEffect(() => {
    // Try to load audio files, but don't fail if they don't exist
    try {
      spinStartAudioRef.current = new Audio('/sounds/spin-start.mp3');
      spinStartAudioRef.current.volume = 0.5;
    } catch (error) {
      // Audio file not found, will be handled silently
    }
    
    try {
      spinStopAudioRef.current = new Audio('/sounds/spin-stop.mp3');
      spinStopAudioRef.current.volume = 0.6;
    } catch (error) {
      // Audio file not found, will be handled silently
    }
  }, []);

  // Auto spin when triggered
  useEffect(() => {
    if (triggerSpin && !isSpinning && !disabled) {
      spinWheel();
    }
  }, [triggerSpin]);

  // Load confetti when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !confetti) {
      import('canvas-confetti').then((module) => {
        confetti = module.default;
      }).catch((error) => {
        // Silent error handling
      });
    }
  }, []);

  // Confetti effect function
  const triggerConfetti = () => {
    if (!confetti) {
      import('canvas-confetti').then((module) => {
        confetti = module.default;
        triggerConfetti();
      });
      return;
    }
    
    // Simple confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Multiple bursts for better effect
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  };

  const selectRandomPrize = (): Prize => {
    // Lọc ra các ô có tỷ lệ > 0 (không bao giờ quay vào ô 0%)
    const availablePrizes = prizes.filter(p => p.probability > 0);
    
    if (availablePrizes.length === 0) {
      // Nếu không có ô nào khả dụng, trả về ô đầu tiên (fallback)
      return prizes[0];
    }
    
    // Tính tổng tỷ lệ của các ô khả dụng
    const totalProbability = availablePrizes.reduce((sum, prize) => sum + prize.probability, 0);
    
    // Xử lý các trường hợp đặc biệt
    if (totalProbability === 0) {
      return availablePrizes[0];
    }
    
    // Chuẩn hóa tỷ lệ về 100% để đảm bảo luôn có kết quả
    const normalizationFactor = 100 / totalProbability;
    
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const prize of availablePrizes) {
      // Tính tỷ lệ chuẩn hóa
      const normalizedProbability = prize.probability * normalizationFactor;
      cumulativeProbability += normalizedProbability;
      
      if (random <= cumulativeProbability) {
        return prize;
      }
    }
    
    // Fallback về ô cuối cùng khả dụng
    return availablePrizes[availablePrizes.length - 1];
  };

    const spinWheel = () => {
    if (isSpinning || disabled) {
      return;
    }

    // Nếu không có triggerSpin, chỉ gọi onSpinResult để hiện form đăng ký
    if (!triggerSpin) {
      onSpinResult(prizes[0]); // Truyền prize mẫu, sẽ được xử lý ở parent
      return;
    }

    // Chỉ chạy vòng quay thật khi có triggerSpin
    // Play spin start sound
    if (soundEnabled && spinStartAudioRef.current) {
      spinStartAudioRef.current.currentTime = 0;
      spinStartAudioRef.current.play().catch(() => {
        // Silent error handling for audio
      });
    }

    setIsSpinning(true);

    // Sử dụng vòng quay thật
    const winningPrize = selectRandomPrize();
    const prizeIndex = prizes.findIndex(p => p.id === winningPrize.id);

    if (prizeIndex === -1) {
      setIsSpinning(false);
      return;
    }

    const totalSegments = prizes.length;
    const segmentAngle = 360 / totalSegments;
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
    const stopAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2) + randomOffset;

    const extraSpins = 12;
    const finalRotation = rotation + (360 * extraSpins) - stopAngle;

    setRotation(finalRotation);

    // Play spin stop sound 4 seconds before stopping
    setTimeout(() => {
      if (soundEnabled && spinStopAudioRef.current) {
        spinStopAudioRef.current.currentTime = 0;
        spinStopAudioRef.current.play().catch(() => {
          // Silent error handling for audio
        });
      }
    }, 5000);

    setTimeout(() => {
      setIsSpinning(false);
      // Trigger confetti effect when wheel stops
      triggerConfetti();
      onSpinResult(winningPrize);
    }, 8000);
  };

  const renderWheel = () => {
    const numPrizes = prizes.length;
    if (numPrizes === 0) return null;

    const segmentAngle = 360 / numPrizes;
    const colors = ['#0B4F99', '#FDBE13']; // Blue and Yellow

    const gradientStops = prizes.map((_, index) => {
      const start = index * segmentAngle;
      const end = (index + 1) * segmentAngle;
      const color = colors[index % 2];
      return `${color} ${start}deg ${end}deg`;
    }).join(', ');

    const conicGradient = `conic-gradient(${gradientStops})`;

    return (
      <div className="relative flex flex-col items-center space-y-8">
        {/* Pointer indicator */}
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
            <div className="border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600"></div>
          </div>
          
          <div 
            className="relative w-full h-full rounded-full p-2 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-2xl"
          >
            <div 
              ref={wheelRef}
              className="relative w-full h-full rounded-full overflow-hidden shadow-inner border-4 border-amber-800"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 8s cubic-bezier(0.1, 0.7, 0.1, 1)' : 'none',
                background: conicGradient
              }}
            >
              {/* Prize Labels */}
              {prizes.map((prize, index) => {
                const angle = (index * segmentAngle) + (segmentAngle / 2);
                const textColor = colors[(index + 1) % 2];

                return (
                  <div
                    key={prize.id}
                    className="absolute w-full h-full flex justify-center items-start"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="flex flex-col items-center text-center pt-5">
                      {prize.imageUrl ? (
                        <img src={prize.imageUrl} alt={prize.name} className="w-10 h-10 md:w-12 md:h-12 object-contain mb-1" />
                      ) : (
                        <span className="text-2xl md:text-3xl">{prize.icon}</span>
                      )}
                      <span 
                        className="font-bold text-xs md:text-sm mt-1 break-words max-w-[70px] leading-tight"
                        style={{ color: textColor }}
                      >
                        {prize.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full flex items-center justify-center z-10 border-4 border-amber-800 shadow-2xl">
              <div className="text-amber-800 font-black text-2xl">⭐</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-center space-y-4 py-4">
      {/* Status and Sound Control */}
      <div className="text-amber-800 mb-6 text-right">
        {/* Sound Toggle Button */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-full transition-all duration-300 ${
            soundEnabled 
              ? 'bg-amber-400 text-amber-800 hover:bg-amber-500' 
              : 'bg-gray-400 text-gray-600 hover:bg-gray-500'
          }`}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.5l3.883-3.707a1 1 0 011.414.07zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.5l3.883-3.707a1 1 0 011.414.07zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Wheel */}
      {renderWheel()}

      {/* Spin Button */}
      {!disabled && (
        <div className="pt-2">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
                className={`px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 transform uppercase tracking-wider ${
              isSpinning
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed scale-95'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-800 hover:scale-105 shadow-xl active:scale-95 border-3 border-amber-800'
                }`}
              >
                {isSpinning ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang quay...
                  </span>
                ) : (
                  '🎰 QUAY NGAY!'
                )}
              </button>
            </div>
          )}
          
          {/* Thông báo hết lượt */}
      {disabled && (
            <div className="pt-2">
              <div className="px-8 py-4 rounded-full font-bold text-xl bg-gray-400 text-gray-600 cursor-not-allowed scale-95">
                Đã quay hôm nay
          </div>
        </div>
      )}
    </div>
  );
} 
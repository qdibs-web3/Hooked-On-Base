'use client';

import { motion } from 'framer-motion';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Navigation } from '@/components/layout/Navigation';
import { FishingCast } from '@/components/game/FishingCast';
import { StatsDisplay } from '@/components/game/StatsDisplay';
import { useCastCooldown } from '@/lib/hooks/useCastCooldown';

export default function PlayPage() {
  const { user, loading, isConnected, refreshUser } = useUserProfile();
  const { canCast, remainingTime, formatTime } = useCastCooldown();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-md"
        >
          <h1 className="text-4xl font-bold text-gray-800">
            Ready to Fish?
          </h1>
          <p className="text-gray-600">
            Connect your wallet to start casting your line!
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🎣
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Navigation />
      
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-gray-800"
          >
            🎣 Fishing
          </motion.h1>
          <ConnectButton />
        </div>

        {/* Stats */}
        <StatsDisplay user={user} />

        {/* Enhanced Fishing Scene */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-b from-sky-200 via-sky-300 to-blue-400 rounded-3xl shadow-2xl overflow-hidden"
          style={{ minHeight: '600px', height: '600px' }}
        >
          {/* Mountains Background */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2">
            {/* Far Mountains */}
            <svg className="absolute bottom-1/2 left-0 w-full h-32 opacity-30" viewBox="0 0 1200 150" preserveAspectRatio="none">
              <path d="M0,100 L200,40 L400,70 L600,30 L800,60 L1000,50 L1200,80 L1200,150 L0,150 Z" fill="#2d5f5d" />
            </svg>
            
            {/* Mid Mountains */}
            <svg className="absolute bottom-1/3 left-0 w-full h-40 opacity-50" viewBox="0 0 1200 150" preserveAspectRatio="none">
              <path d="M0,90 L150,50 L350,80 L550,40 L750,70 L950,45 L1200,75 L1200,150 L0,150 Z" fill="#3d7f7d" />
            </svg>
            
            {/* Near Mountains */}
            <svg className="absolute bottom-1/4 left-0 w-full h-48 opacity-70" viewBox="0 0 1200 150" preserveAspectRatio="none">
              <path d="M0,80 L180,30 L380,60 L580,20 L780,50 L980,35 L1200,65 L1200,150 L0,150 Z" fill="#4d9f9d" />
            </svg>
          </div>

          {/* Trees on sides */}
          <div className="absolute bottom-32 right-8 opacity-60">
            <svg width="80" height="120" viewBox="0 0 80 120">
              <polygon points="40,20 20,60 30,60 10,90 30,90 20,120 60,120 50,90 70,90 50,60 60,60" fill="#2d5f4d" />
              <rect x="35" y="100" width="10" height="20" fill="#4d3d2d" />
            </svg>
          </div>
          <div className="absolute bottom-32 left-8 opacity-60">
            <svg width="80" height="120" viewBox="0 0 80 120">
              <polygon points="40,20 20,60 30,60 10,90 30,90 20,120 60,120 50,90 70,90 50,60 60,60" fill="#2d5f4d" />
              <rect x="35" y="100" width="10" height="20" fill="#4d3d2d" />
            </svg>
          </div>

          {/* Animated Clouds */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-10 left-10"
          >
            <svg width="120" height="60" viewBox="0 0 120 60">
              <ellipse cx="30" cy="35" rx="25" ry="20" fill="white" opacity="0.9" />
              <ellipse cx="55" cy="30" rx="30" ry="25" fill="white" opacity="0.9" />
              <ellipse cx="85" cy="35" rx="25" ry="20" fill="white" opacity="0.9" />
            </svg>
          </motion.div>
          
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 right-20"
          >
            <svg width="140" height="70" viewBox="0 0 140 70">
              <ellipse cx="35" cy="40" rx="30" ry="25" fill="white" opacity="0.85" />
              <ellipse cx="70" cy="35" rx="35" ry="30" fill="white" opacity="0.85" />
              <ellipse cx="105" cy="40" rx="30" ry="25" fill="white" opacity="0.85" />
            </svg>
          </motion.div>

          {/* Water Section */}
          <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500">
            {/* Animated Water Ripples */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            
            {/* Swimming Fish */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: ['-10%', '110%'],
                  y: [Math.random() * 100, Math.random() * 100],
                }}
                transition={{
                  duration: 15 + i * 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 2,
                }}
                className="absolute text-2xl"
                style={{ 
                  top: `${20 + i * 15}%`,
                  opacity: 0.6,
                }}
              >
                🐟
              </motion.div>
            ))}
            
            {/* Occasional rare fish */}
            <motion.div
              animate={{
                x: ['110%', '-10%'],
                y: [60, 80, 60],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute text-3xl"
              style={{ top: '40%', opacity: 0.7 }}
            >
              🐠
            </motion.div>
          </div>

          {/* Wooden Dock */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-amber-800 to-amber-700 rounded-b-3xl">
            {/* Dock Top Edge */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-amber-900" />
            
            {/* Dock Planks */}
            <div className="grid grid-cols-10 gap-6 px-6 h-full pt-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-amber-900 rounded-t-lg opacity-40" />
              ))}
            </div>
            
            {/* Dock Posts */}
            <div className="absolute -bottom-20 left-16 w-4 h-24 bg-amber-900 rounded-b-lg" />
            <div className="absolute -bottom-20 right-16 w-4 h-24 bg-amber-900 rounded-b-lg" />
          </div>

          {/* Fishing Rod (Left Side) */}
          <motion.div
            className="absolute bottom-40 left-12 origin-bottom-left"
            animate={{
              rotate: [0, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Rod */}
            <div className="relative">
              <svg width="200" height="300" viewBox="0 0 200 300">
                {/* Rod body */}
                <path
                  d="M 50,280 Q 60,150 80,50 L 85,50 Q 65,150 55,280 Z"
                  fill="#8B4513"
                  stroke="#654321"
                  strokeWidth="1"
                />
                {/* Rod handle */}
                <rect x="45" y="260" width="15" height="30" rx="3" fill="#2d2d2d" />
                {/* Reel */}
                <circle cx="52" cy="240" r="12" fill="#4a4a4a" stroke="#2d2d2d" strokeWidth="2" />
                <circle cx="52" cy="240" r="6" fill="#1a1a1a" />
              </svg>
              
              {/* Fishing Line */}
              <motion.svg
                className="absolute top-0 left-20"
                width="400"
                height="300"
                viewBox="0 0 400 300"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <path
                  d="M 0,50 Q 150,80 280,180"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </motion.svg>
            </div>
          </motion.div>

          {/* Bobber/Float in Water */}
          <motion.div
            className="absolute"
            style={{ left: '55%', top: '52%' }}
            animate={{
              y: [0, -8, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Bobber */}
            <div className="relative">
              <svg width="30" height="40" viewBox="0 0 30 40">
                <ellipse cx="15" cy="15" rx="12" ry="15" fill="#ff4444" />
                <ellipse cx="15" cy="25" rx="12" ry="15" fill="white" />
                <line x1="15" y1="0" x2="15" y2="10" stroke="#666" strokeWidth="2" />
              </svg>
              
              {/* Ripples around bobber */}
              <motion.div
                className="absolute top-8 left-1/2 -translate-x-1/2"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <svg width="60" height="20" viewBox="0 0 60 20">
                  <ellipse cx="30" cy="10" rx="25" ry="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Fishing Cast Component - BOTTOM RIGHT */}
          <div className="absolute bottom-6 right-6 z-20 w-auto">
            <FishingCast onCastComplete={refreshUser} />
          </div>
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How to Play
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="font-bold text-gray-800 mb-2">🎣 Casting</p>
              <p>Click the CAST button to throw your line. Watch the timer on the button for your next cast!</p>
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-2">🐟 Catching Fish</p>
              <p>Different fish have different rarities. Rarer fish give more XP and $HOOK!</p>
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-2">⬆️ Leveling Up</p>
              <p>Earn XP to level up and unlock better fishing rods in the shop.</p>
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-2">🎣 Better Rods</p>
              <p>Upgrade your rod to increase catch rates and rare fish chances!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
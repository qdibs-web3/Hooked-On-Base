'use client';

import { motion } from 'framer-motion';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Navigation } from '@/components/layout/Navigation';
import { FishingCast } from '@/components/game/FishingCast';
import { StatsDisplay } from '@/components/game/StatsDisplay';

export default function PlayPage() {
  const { user, loading, isConnected, refreshUser } = useUserProfile();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-md"
        >
          <h1 className="text-4xl font-bold text-gray-800">
            🎣 Ready to Fish?
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
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
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

        {/* Fishing Scene */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-b from-sky-300 via-blue-200 to-blue-400 rounded-3xl shadow-2xl overflow-hidden"
          style={{ minHeight: '500px' }}
        >
          {/* Sky */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-sky-200 to-sky-300">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-10 left-10 text-4xl"
            >
              ☁️
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
              className="absolute top-20 right-20 text-5xl"
            >
              ☁️
            </motion.div>
          </div>

          {/* Water */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-blue-300 to-blue-500">
            {/* Water ripples */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </div>

          {/* Fishing Dock */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-800 to-amber-700 rounded-b-3xl">
            <div className="absolute top-0 left-0 right-0 h-2 bg-amber-900" />
            <div className="grid grid-cols-8 gap-8 px-8 h-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-amber-900 rounded-t-lg" />
              ))}
            </div>
          </div>

          {/* Fishing Cast Component */}
          <div className="relative z-10 flex items-center justify-center" style={{ minHeight: '500px' }}>
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
              <p>Click the CAST button to throw your line. Each cast has a 10-minute cooldown.</p>
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

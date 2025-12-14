'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { StatsDisplay } from '@/components/game/StatsDisplay';
import { Navigation } from '@/components/layout/Navigation';
import { TokenomicsInfo } from '@/components/ui/TokenomicsInfo';
import { FISH_DATA } from '@/lib/data/fish';
import { FISHING_RODS, ROD_VFX_BY_TIER } from '@/lib/data/rods';
import { RARITY_COLORS } from '@/lib/data/constants';

export default function DashboardPage() {
  const { user, loading, isConnected } = useUserProfile();
  const router = useRouter();
  const [currentCatchIndex, setCurrentCatchIndex] = useState(0);
  const [collectionTab, setCollectionTab] = useState<'fish' | 'reels'>('fish');
  const [selectedFish, setSelectedFish] = useState<typeof FISH_DATA[0] | null>(null);
  const [showTokenomics, setShowTokenomics] = useState(false);

  // Get recent catches (last 3) - moved before early returns
  const recentCatches = user?.fishCaught?.slice(-3).reverse() || [];

  // Auto-rotate recent catches every 4 seconds - moved before early returns
  useEffect(() => {
    if (recentCatches.length > 1) {
      const interval = setInterval(() => {
        setCurrentCatchIndex((prev) => (prev + 1) % recentCatches.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [recentCatches.length]);

  // Helper function to get time ago
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-md"
        >
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            🎣 HOOKED
          </motion.h1>
          
          <p className="text-xl text-gray-700">
            Cast your line, catch rare fish, and earn $HOOK tokens on Base!
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your wallet to start fishing and earning rewards
            </p>
            <ConnectButton />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/50 rounded-lg p-4">
              <p className="font-bold text-2xl">69</p>
              <p className="text-gray-600">Fish Species</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="font-bold text-2xl">20</p>
              <p className="text-gray-600">Fishing Rods</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="font-bold text-2xl">10m</p>
              <p className="text-gray-600">Cast Cooldown</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="font-bold text-2xl">$HOOK</p>
              <p className="text-gray-600">Token Rewards</p>
            </div>
          </div>
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

  const displayName = user.displayName || user.walletAddress.slice(0, 6);

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
            🏠 Dashboard
          </motion.h1>
          <ConnectButton />
        </div>

        {/* Welcome Container with Stats, Actions, and Recent Catches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-2xl p-6 shadow-lg space-y-6"
        >
          {/* Welcome Message */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {displayName}! 👋
            </h2>
            <p className="text-gray-600">
              Ready to cast your line and catch some legendary fish?
            </p>
          </div>

          {/* Stats Display */}
          <StatsDisplay user={user} />

          {/* Recent Catches - Compact Version */}
          {recentCatches.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎣 Recent Catches</h3>
              <div className="relative h-32">
                <AnimatePresence mode="wait">
                  {recentCatches[currentCatchIndex] && (
                    <motion.div
                      key={currentCatchIndex}
                      initial={{ opacity: 0, rotateY: 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: -90 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center gap-4 p-3 bg-white rounded-lg border-2"
                      style={{
                        borderColor: RARITY_COLORS[recentCatches[currentCatchIndex].rarity],
                      }}
                    >
                      {/* Fish Emoji */}
                      <div className="text-4xl flex-shrink-0">
                        {FISH_DATA.find((f) => f.id === recentCatches[currentCatchIndex].fishId)?.emoji || '🐟'}
                      </div>

                      {/* Fish Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg text-gray-800 truncate">
                          {recentCatches[currentCatchIndex].fishName}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full text-white font-bold uppercase"
                            style={{
                              backgroundColor: RARITY_COLORS[recentCatches[currentCatchIndex].rarity],
                            }}
                          >
                            {recentCatches[currentCatchIndex].rarity}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(recentCatches[currentCatchIndex].caughtAt)}
                          </span>
                        </div>
                      </div>

                      {/* Rewards */}
                      <div className="flex gap-2 flex-shrink-0">
                        <div className="bg-blue-100 rounded px-2 py-1">
                          <p className="text-xs text-gray-600">XP</p>
                          <p className="text-sm font-bold text-blue-600">+{recentCatches[currentCatchIndex].xpEarned}</p>
                        </div>
                        <div className="bg-yellow-100 rounded px-2 py-1">
                          <p className="text-xs text-gray-600">$HOOK</p>
                          <p className="text-sm font-bold text-yellow-600">+{recentCatches[currentCatchIndex].hookEarned}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Dots */}
                {recentCatches.length > 1 && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    {recentCatches.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentCatchIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentCatchIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/play')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              🎣 Start Fishing
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/shop')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              🏪 Visit Shop
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/leaderboard')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              🏆 Top Anglers
            </motion.button>
          </div>
        </motion.div>

        {/* Tokenomics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setShowTokenomics(!showTokenomics)}
            className="w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all flex justify-between items-center"
          >
            <span className="text-xl font-bold text-gray-800">💰 $HOOK Tokenomics & Roadmap</span>
            <span className="text-2xl">{showTokenomics ? '▼' : '▶'}</span>
          </button>
          <AnimatePresence>
            {showTokenomics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4">
                  <TokenomicsInfo />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Fish Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {displayName}'s Collection
            </h2>
            
            {/* Tab Switcher */}
            <div className="flex bg-white rounded-lg p-1 shadow">
              <button
                onClick={() => setCollectionTab('fish')}
                className={`px-4 py-2 rounded-md font-bold transition-all ${
                  collectionTab === 'fish'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                🐟 Fish
              </button>
              <button
                onClick={() => setCollectionTab('reels')}
                className={`px-4 py-2 rounded-md font-bold transition-all ${
                  collectionTab === 'reels'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                🎣 Reels
              </button>
            </div>
          </div>

          {collectionTab === 'fish' ? (
            <>
              <p className="text-gray-600 mb-4">
                {user.uniqueFishCaught.length} / {FISH_DATA.length} species caught
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {FISH_DATA.map((fish) => {
                  const isCaught = user.uniqueFishCaught.includes(fish.id);
                  
                  return (
                    <motion.button
                      key={fish.id}
                      whileHover={isCaught ? { scale: 1.1 } : {}}
                      whileTap={isCaught ? { scale: 0.95 } : {}}
                      onClick={() => isCaught && setSelectedFish(fish)}
                      disabled={!isCaught}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center p-3 transition-all
                        ${
                          isCaught
                            ? 'bg-white shadow-lg hover:shadow-xl cursor-pointer border-2'
                            : 'bg-gray-200 opacity-50 cursor-not-allowed'
                        }
                      `}
                      style={{
                        borderColor: isCaught ? RARITY_COLORS[fish.rarity] : 'transparent',
                      }}
                    >
                      <span className="text-3xl mb-1">{isCaught ? fish.emoji : '❓'}</span>
                      <span className="text-xs font-bold text-center text-gray-700 line-clamp-1">
                        {isCaught ? fish.name : '???'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                {user.ownedRods.length} / {FISHING_RODS.length} reels unlocked
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {FISHING_RODS.map((rod) => {
                  const isOwned = user.ownedRods.includes(rod.id);
                  const isEquipped = user.currentRodId === rod.id;
                  const vfx = ROD_VFX_BY_TIER[rod.tier];
                  
                  return (
                    <motion.div
                      key={rod.id}
                      whileHover={isOwned ? { scale: 1.1 } : {}}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center p-3 transition-all relative
                        ${
                          isOwned
                            ? 'bg-white shadow-lg border-2'
                            : 'bg-gray-200'
                        }
                      `}
                      style={{
                        borderColor: isOwned ? rod.color : 'transparent',
                        boxShadow: isOwned && vfx ? `0 0 ${vfx.glowIntensity * 20}px ${rod.color}` : undefined,
                      }}
                    >
                      {/* VFX Glow Effect */}
                      {isOwned && vfx && vfx.glowIntensity > 0 && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          style={{
                            background: `radial-gradient(circle, ${rod.color}40 0%, transparent 70%)`,
                          }}
                        />
                      )}

                      <span className="text-2xl mb-1 relative z-10">🎣</span>
                      <span className="text-lg font-bold text-center relative z-10" style={{ color: isOwned ? rod.color : '#9ca3af' }}>
                        T{rod.tier}
                      </span>

                      {/* VFX Trail Type Badge */}
                      {isOwned && vfx && vfx.trailType !== 'none' && (
                        <span className="absolute top-1 right-1 text-xs">
                          {vfx.trailType === 'water' && '💧'}
                          {vfx.trailType === 'light' && '✨'}
                          {vfx.trailType === 'divine' && '⭐'}
                          {vfx.trailType === 'void' && '🌑'}
                        </span>
                      )}

                      {/* Equipped Badge */}
                      {isEquipped && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                          ✓
                        </div>
                      )}

                      {/* Locked Overlay */}
                      {!isOwned && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <span className="text-4xl">🔒</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>

        {/* Fish Detail Modal */}
        <AnimatePresence>
          {selectedFish && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFish(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-4"
                style={{ borderColor: RARITY_COLORS[selectedFish.rarity] }}
              >
                <button
                  onClick={() => setSelectedFish(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>

                <div className="text-center space-y-4">
                  <div className="text-8xl">{selectedFish.emoji}</div>
                  
                  <h3 className="text-3xl font-bold text-gray-800">{selectedFish.name}</h3>
                  
                  <div
                    className="inline-block px-4 py-2 rounded-full text-white font-bold uppercase"
                    style={{ backgroundColor: RARITY_COLORS[selectedFish.rarity] }}
                  >
                    {selectedFish.rarity}
                  </div>

                  <p className="text-gray-600 italic">{selectedFish.description}</p>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">XP Reward</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedFish.xpReward}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">$HOOK Reward</p>
                      <p className="text-2xl font-bold text-yellow-600">{selectedFish.hookReward}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Catch Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedFish.catchRate}%</p>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Color</p>
                      <div
                        className="w-12 h-12 rounded-full mx-auto mt-1 border-2 border-gray-300"
                        style={{ backgroundColor: selectedFish.color }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Navigation } from '@/components/layout/Navigation';
import { FISHING_RODS, ROD_VFX_BY_TIER } from '@/lib/data/rods';
import { formatHook } from '@/lib/data/constants';

// Rod emoji mapping by tier for visual variety
const ROD_ICONS: Record<number, string> = {
  1: '🎣',
  2: '🎣',
  3: '🌊',
  4: '⚡',
  5: '🔱',
  6: '🐉',
  7: '👑',
  8: '🔥',
  9: '⭐',
  10: '🌟',
  11: '🌑',
  12: '✨',
  13: '🔮',
  15: '🌙',
  16: '🌈',
  17: '💎',
  18: '🏆',
  19: '⚔️',
  20: '🌌',
};

export default function ShopPage() {
  const { user, loading, isConnected, refreshUser } = useUserProfile();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handlePurchase = async (rodId: string) => {
    if (!user) return;

    setPurchasing(rodId);

    try {
      const response = await fetch('/api/shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: user.walletAddress,
          rodId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        await refreshUser();
      } else {
        alert(data.error || 'Failed to purchase rod');
      }
    } catch (err) {
      console.error('Error purchasing rod:', err);
      alert('Failed to purchase rod. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleEquip = async (rodId: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/shop', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: user.walletAddress,
          rodId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        await refreshUser();
      } else {
        alert(data.error || 'Failed to equip rod');
      }
    } catch (err) {
      console.error('Error equipping rod:', err);
      alert('Failed to equip rod. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-md"
        >
          <h1 className="text-4xl font-bold text-gray-800">
            Fishing Rod Shop
          </h1>
          <p className="text-gray-600">
            Connect your wallet to browse and purchase fishing rods!
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
        {/* Header with Info Icon */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-gray-800"
            >
              Fishing Rod Shop
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowInfo(!showInfo)}
              className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold hover:bg-blue-600 transition-colors cursor-pointer"
              title="About Fishing Rods"
            >
              ?
            </motion.button>
          </div>
          
          {/* Balance and Connect Button Inline */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl px-4 py-2 shadow-md"
            >
              <p className="text-xs opacity-90">Balance</p>
              <p className="text-xl font-bold">{formatHook(user.hookBalance)}</p>
            </motion.div>
            <ConnectButton />
          </div>
        </div>

        {/* Collapsible Info Section */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  About Fishing Rods
                </h2>
                <div className="space-y-3 text-gray-600">
                  <p>
                    <strong className="text-gray-800">Catch Rate Bonus:</strong> Increases your overall chance of catching a fish when you cast.
                  </p>
                  <p>
                    <strong className="text-gray-800">Rare Bonus:</strong> Increases your chance of catching rare, epic, legendary, and mythic fish.
                  </p>
                  <p>
                    <strong className="text-gray-800">XP Multiplier:</strong> Multiplies the XP you earn from each fish caught.
                  </p>
                  <p className="text-sm italic">
                    💡 Tip: Save up for higher tier rods to maximize your earnings and catch legendary fish!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rods Grid - Improved Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FISHING_RODS.map((rod, index) => {
            const owned = user.ownedRods.includes(rod.id);
            const equipped = user.currentRodId === rod.id;
            const canAfford = user.hookBalance >= rod.price;
            const levelLocked = user.level < rod.unlockLevel;
            const vfx = ROD_VFX_BY_TIER[rod.tier];
            const rodIcon = ROD_ICONS[rod.tier] || '🎣';

            return (
              <motion.div
                key={rod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`
                  bg-white rounded-xl p-4 shadow-lg border-2 transition-all relative overflow-hidden
                  ${equipped ? 'border-green-500' : 'border-transparent'}
                  ${levelLocked ? 'opacity-60' : ''}
                `}
                style={{
                  boxShadow: owned && vfx && vfx.glowIntensity > 0 
                    ? `0 0 ${vfx.glowIntensity * 20}px ${rod.color}60, 0 4px 6px rgba(0,0,0,0.1)` 
                    : undefined
                }}
              >
                {/* VFX Glow Background */}
                {owned && vfx && vfx.glowIntensity > 0 && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2 + vfx.glowIntensity,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${rod.color}30 0%, transparent 70%)`,
                    }}
                  />
                )}

                {/* Rod Icon with Gradient Background */}
                <div className="relative mb-3">
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl mx-auto relative z-10 shadow-md"
                    style={{ 
                      background: `linear-gradient(135deg, ${rod.color}40 0%, ${rod.color}20 100%)`,
                      border: `2px solid ${rod.color}60`
                    }}
                  >
                    {rodIcon}
                  </div>
                  
                  {/* VFX Trail Type Badge */}
                  {owned && vfx && vfx.trailType !== 'none' && (
                    <div className="absolute top-0 right-0 text-xl z-20 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                      {vfx.trailType === 'water' && '💧'}
                      {vfx.trailType === 'light' && '✨'}
                      {vfx.trailType === 'divine' && '⭐'}
                      {vfx.trailType === 'void' && '🌑'}
                    </div>
                  )}
                </div>

                {/* Rod Info - More Compact */}
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2 leading-tight">
                  {rod.name}
                </h3>
                
                <div className="text-center mb-3 flex justify-center gap-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
                    Tier {rod.tier}
                  </span>
                  {equipped && (
                    <span className="inline-block px-2 py-1 bg-green-100 rounded-lg text-xs font-bold text-green-700">
                      Equipped
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-xs text-center mb-3 line-clamp-2">
                  {rod.description}
                </p>

                {/* Stats - Compact Grid */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="font-bold text-blue-600">+{rod.catchRateBonus}%</div>
                    <div className="text-gray-600 text-[10px]">Catch</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <div className="font-bold text-purple-600">+{rod.rareBonusChance}%</div>
                    <div className="text-gray-600 text-[10px]">Rare</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="font-bold text-green-600">{rod.xpMultiplier}x</div>
                    <div className="text-gray-600 text-[10px]">XP</div>
                  </div>
                </div>

                {/* Unlock Level */}
                {levelLocked && (
                  <div className="bg-red-50 text-red-700 rounded-lg p-2 mb-3 text-center text-xs font-bold">
                    🔒 Level {rod.unlockLevel}
                  </div>
                )}

                {/* Price & Actions */}
                {rod.price === 0 ? (
                  <div className="bg-green-50 text-green-700 rounded-lg p-2 text-center font-bold text-sm">
                    FREE
                  </div>
                ) : owned ? (
                  equipped ? (
                    <div className="bg-green-500 text-white rounded-lg p-2 text-center font-bold text-sm">
                      Equipped
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEquip(rod.id)}
                      className="w-full bg-blue-500 text-white rounded-lg p-2 font-bold hover:bg-blue-600 transition-colors text-sm"
                    >
                      Equip
                    </motion.button>
                  )
                ) : (
                  <motion.button
                    whileHover={!levelLocked && canAfford ? { scale: 1.05 } : {}}
                    whileTap={!levelLocked && canAfford ? { scale: 0.95 } : {}}
                    onClick={() => handlePurchase(rod.id)}
                    disabled={levelLocked || !canAfford || purchasing === rod.id}
                    className={`
                      w-full rounded-lg p-2 font-bold transition-colors text-sm
                      ${
                        levelLocked || !canAfford
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                      }
                    `}
                  >
                    {purchasing === rod.id ? (
                      'Purchasing...'
                    ) : (
                      <>
                        {!canAfford && !levelLocked ? 'Not Enough' : formatHook(rod.price)}
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
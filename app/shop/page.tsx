'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Navigation } from '@/components/layout/Navigation';
import { FISHING_RODS } from '@/lib/data/rods';
import { formatHook } from '@/lib/data/constants';

export default function ShopPage() {
  const { user, loading, isConnected, refreshUser } = useUserProfile();
  const [purchasing, setPurchasing] = useState<string | null>(null);

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
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-gray-800"
          >
            Fishing Rod Shop
          </motion.h1>
          <ConnectButton />
        </div>

        {/* Balance Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-4 shadow-lg"
        >
          <p className="text-sm opacity-90">Your Balance</p>
          <p className="text-4xl font-bold">{formatHook(user.hookBalance)}</p>
          <p className="text-sm mt-2 opacity-90">Level {user.level}</p>
        </motion.div>
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-lg"
        >
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
        </motion.div>

        {/* Rods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FISHING_RODS.map((rod, index) => {
            const owned = user.ownedRods.includes(rod.id);
            const equipped = user.currentRodId === rod.id;
            const canAfford = user.hookBalance >= rod.price;
            const levelLocked = user.level < rod.unlockLevel;

            return (
              <motion.div
                key={rod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`
                  bg-white rounded-2xl p-6 shadow-lg border-4 transition-all
                  ${equipped ? 'border-green-500' : 'border-transparent'}
                  ${levelLocked ? 'opacity-60' : ''}
                `}
              >
                {/* Rod Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto"
                  style={{ backgroundColor: rod.color + '20' }}
                >
                  🎣
                </div>

                {/* Rod Info */}
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                  {rod.name}
                </h3>
                
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-700">
                    Tier {rod.tier}
                  </span>
                  {equipped && (
                    <span className="inline-block ml-2 px-3 py-1 bg-green-100 rounded-full text-sm font-bold text-green-700">
                      Equipped
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm text-center mb-4">
                  {rod.description}
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Catch Rate:</span>
                    <span className="font-bold text-blue-600">+{rod.catchRateBonus}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rare Bonus:</span>
                    <span className="font-bold text-purple-600">+{rod.rareBonusChance}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">XP Multiplier:</span>
                    <span className="font-bold text-green-600">{rod.xpMultiplier}x</span>
                  </div>
                </div>

                {/* Unlock Level */}
                {levelLocked && (
                  <div className="bg-red-50 text-red-700 rounded-lg p-3 mb-4 text-center text-sm font-bold">
                    🔒 Unlocks at Level {rod.unlockLevel}
                  </div>
                )}

                {/* Price & Actions */}
                {rod.price === 0 ? (
                  <div className="bg-green-50 text-green-700 rounded-lg p-3 text-center font-bold">
                    FREE
                  </div>
                ) : owned ? (
                  equipped ? (
                    <div className="bg-green-500 text-white rounded-lg p-3 text-center font-bold">
                      Currently Equipped
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEquip(rod.id)}
                      className="w-full bg-blue-500 text-white rounded-lg p-3 font-bold hover:bg-blue-600 transition-colors"
                    >
                      Equip Rod
                    </motion.button>
                  )
                ) : (
                  <motion.button
                    whileHover={!levelLocked && canAfford ? { scale: 1.05 } : {}}
                    whileTap={!levelLocked && canAfford ? { scale: 0.95 } : {}}
                    onClick={() => handlePurchase(rod.id)}
                    disabled={levelLocked || !canAfford || purchasing === rod.id}
                    className={`
                      w-full rounded-lg p-3 font-bold transition-colors
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
                        {!canAfford && !levelLocked ? 'Not Enough $HOOK' : formatHook(rod.price)}
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

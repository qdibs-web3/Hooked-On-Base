'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useCastCooldown } from '@/lib/hooks/useCastCooldown';
import { CastResult } from '@/lib/db/types';
import { RARITY_COLORS } from '@/lib/data/constants';

interface FishingCastProps {
  onCastComplete: () => void;
}

export function FishingCast({ onCastComplete }: FishingCastProps) {
  const { address } = useAccount();
  const { canCast, remainingTime, formatTime, checkCooldown } = useCastCooldown();
  const [casting, setCasting] = useState(false);
  const [result, setResult] = useState<CastResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCast = async () => {
    if (!address) {
      setErrorMessage('Please connect your wallet first');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    if (!canCast) {
      setErrorMessage(`Please wait ${formatTime(remainingTime)} before casting again`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    if (casting) return;

    setCasting(true);
    setResult(null);
    setShowResult(false);
    setErrorMessage(null);

    try {
      // Simulate casting animation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch('/api/cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
        setShowResult(true);
        
        // Refresh cooldown status
        await checkCooldown();
        
        // Notify parent to refresh user data (extended to 8 seconds for longer viewing)
        setTimeout(() => {
          onCastComplete();
        }, 8000);
      } else {
        const error = await response.json();
        setErrorMessage(error.error || 'Failed to cast. Please try again.');
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error casting:', err);
      setErrorMessage('Network error. Please check your connection and try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setCasting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Error Message Display */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg font-semibold"
          >
            ⚠️ {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cast Button with Cooldown Timer */}
      <motion.button
        whileHover={canCast && !casting ? { scale: 1.05 } : {}}
        whileTap={canCast && !casting ? { scale: 0.95 } : {}}
        onClick={handleCast}
        disabled={!canCast || casting}
        className={`
          relative px-12 py-6 text-2xl font-bold rounded-2xl shadow-2xl transition-all min-w-[280px]
          ${
            canCast && !casting
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-cyan-500/50'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }
        `}
      >
        {casting ? (
          <span className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              🎣
            </motion.span>
            Casting...
          </span>
        ) : canCast ? (
          <span className="flex flex-col items-center">
            <span className="text-3xl mb-1">🎣</span>
            <span>CAST YOUR LINE</span>
          </span>
        ) : (
          <span className="flex flex-col items-center">
            <span className="text-lg mb-1">⏰ Cooldown</span>
            <motion.span 
              className="text-4xl font-mono tabular-nums"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {formatTime(remainingTime)}
            </motion.span>
            <span className="text-xs mt-1 opacity-75">Next cast ready in</span>
          </span>
        )}
      </motion.button>

      {/* Casting Animation */}
      <AnimatePresence>
        {casting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl mb-3"
            >
              🎣
            </motion.div>
            <p className="text-lg text-gray-700 font-semibold">
              Waiting for a bite...
            </p>
            <motion.div
              className="flex justify-center gap-2 mt-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Display */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: [0.5, 1.1, 1], 
              y: 0,
              rotate: [0, 5, -5, 0]
            }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ 
              duration: 0.6,
              scale: { times: [0, 0.6, 1], type: 'spring', stiffness: 200 }
            }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-4"
            style={{
              borderColor: result.fish
                ? RARITY_COLORS[result.fish.rarity]
                : '#e5e7eb',
            }}
          >
            {result.success && result.fish ? (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: [0, 1.3, 1],
                    rotate: [- 180, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 150
                  }}
                  className="text-7xl relative"
                >
                  {/* Celebration particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 text-2xl"
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((i * Math.PI * 2) / 8) * 60,
                        y: Math.sin((i * Math.PI * 2) / 8) * 60,
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5,
                        ease: 'easeOut'
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                  {result.fish.fishId === 'minnow' && '🐟'}
                  {result.fish.fishId === 'sardine' && '🐟'}
                  {result.fish.fishId === 'herring' && '🐟'}
                  {result.fish.fishId === 'perch' && '🐟'}
                  {result.fish.fishId === 'bass' && '🐠'}
                  {result.fish.fishId === 'trout' && '🐠'}
                  {result.fish.fishId === 'catfish' && '🐠'}
                  {result.fish.fishId === 'pike' && '🐠'}
                  {result.fish.fishId === 'salmon' && '🐡'}
                  {result.fish.fishId === 'tuna' && '🐡'}
                  {result.fish.fishId === 'swordfish' && '🐡'}
                  {result.fish.fishId === 'marlin' && '🐡'}
                  {result.fish.fishId === 'shark' && '🦈'}
                  {result.fish.fishId === 'stingray' && '🐙'}
                  {result.fish.fishId === 'octopus' && '🐙'}
                  {result.fish.fishId === 'whale' && '🐋'}
                  {result.fish.fishId === 'kraken' && '🦑'}
                  {result.fish.fishId === 'megalodon' && '🦈'}
                  {result.fish.fishId === 'leviathan' && '🐉'}
                  {result.fish.fishId === 'poseidon' && '🔱'}
                </motion.div>

                <h3 className="text-3xl font-bold text-gray-800">
                  {result.fish.fishName}
                </h3>

                <div
                  className="inline-block px-4 py-2 rounded-full text-white font-bold uppercase text-sm"
                  style={{
                    backgroundColor: RARITY_COLORS[result.fish.rarity],
                  }}
                >
                  {result.fish.rarity}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">XP Gained</p>
                    <p className="text-2xl font-bold text-blue-600">
                      +{result.xpGained}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">$HOOK Earned</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      +{result.hookGained}
                    </p>
                  </div>
                </div>

                {result.levelUp && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 mt-4"
                  >
                    <p className="text-2xl font-bold">🎉 LEVEL UP! 🎉</p>
                    <p className="text-lg">Level {result.newLevel}</p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-6xl">😔</div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Nothing Caught
                </h3>
                <p className="text-gray-600">{result.message}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
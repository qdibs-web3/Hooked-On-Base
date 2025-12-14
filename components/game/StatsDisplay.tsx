'use client';

import { UserProfile } from '@/lib/db/types';
import { formatNumber, formatHook, getXPForLevel } from '@/lib/data/constants';
import { getRodById } from '@/lib/data/rods';
import { motion } from 'framer-motion';

interface StatsDisplayProps {
  user: UserProfile;
}

export function StatsDisplay({ user }: StatsDisplayProps) {
  const currentRod = getRodById(user.currentRodId);
  const xpForNextLevel = getXPForLevel(user.level + 1);
  const xpProgress = ((user.xp % xpForNextLevel) / xpForNextLevel) * 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {/* Level */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-400/40 via-cyan-300/30 to-blue-500/40 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-blue-300/30"
        style={{
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
        }}
      >
        <p className="text-sm text-gray-700 font-semibold">Level</p>
        <p className="text-3xl font-bold text-gray-800">{user.level}</p>
        <div className="mt-2 bg-white/30 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
          />
        </div>
        <p className="text-xs mt-1 text-gray-600">
          {user.xp % xpForNextLevel} / {xpForNextLevel} XP
        </p>
      </motion.div>

      {/* $HOOK Balance */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-400/40 via-cyan-300/30 to-blue-500/40 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-blue-300/30"
        style={{
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
        }}
      >
        <p className="text-sm text-gray-700 font-semibold">$HOOK</p>
        <p className="text-3xl font-bold text-gray-800">{formatNumber(user.hookBalance)}</p>
        <p className="text-xs mt-1 text-gray-600">Balance</p>
      </motion.div>

      {/* Total Fish Caught */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-400/40 via-cyan-300/30 to-blue-500/40 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-blue-300/30"
        style={{
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
        }}
      >
        <p className="text-sm text-gray-700 font-semibold">Fish Caught</p>
        <p className="text-3xl font-bold text-gray-800">{formatNumber(user.totalFishCaught)}</p>
        <p className="text-xs mt-1 text-gray-600">
          {user.uniqueFishCaught.length}/69 Unique
        </p>
      </motion.div>

      {/* Current Rod */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-400/40 via-cyan-300/30 to-blue-500/40 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-blue-300/30"
        style={{
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
        }}
      >
        <p className="text-sm text-gray-700 font-semibold">Current Rod</p>
        <p className="text-lg font-bold text-gray-800 truncate">{currentRod?.name || 'None'}</p>
        <p className="text-xs mt-1 text-gray-600">
          Tier {currentRod?.tier || 0}
        </p>
      </motion.div>
    </div>
  );
}
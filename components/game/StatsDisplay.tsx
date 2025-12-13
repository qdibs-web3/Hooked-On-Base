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
        className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 shadow-lg text-white"
      >
        <p className="text-sm opacity-90">Level</p>
        <p className="text-3xl font-bold">{user.level}</p>
        <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            className="bg-white h-full"
          />
        </div>
        <p className="text-xs mt-1 opacity-75">
          {user.xp % xpForNextLevel} / {xpForNextLevel} XP
        </p>
      </motion.div>

      {/* $HOOK Balance */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-4 shadow-lg text-white"
      >
        <p className="text-sm opacity-90">$HOOK</p>
        <p className="text-3xl font-bold">{formatNumber(user.hookBalance)}</p>
        <p className="text-xs mt-1 opacity-75">Balance</p>
      </motion.div>

      {/* Total Fish Caught */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 shadow-lg text-white"
      >
        <p className="text-sm opacity-90">Fish Caught</p>
        <p className="text-3xl font-bold">{formatNumber(user.totalFishCaught)}</p>
        <p className="text-xs mt-1 opacity-75">
          {user.uniqueFishCaught.length}/20 Unique
        </p>
      </motion.div>

      {/* Current Rod */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 shadow-lg text-white"
      >
        <p className="text-sm opacity-90">Current Rod</p>
        <p className="text-lg font-bold truncate">{currentRod?.name || 'None'}</p>
        <p className="text-xs mt-1 opacity-75">
          Tier {currentRod?.tier || 0}
        </p>
      </motion.div>
    </div>
  );
}

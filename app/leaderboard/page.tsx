'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Navigation } from '@/components/layout/Navigation';
import { LeaderboardEntry } from '@/lib/db/types';
import { formatNumber, truncateAddress } from '@/lib/data/constants';

export default function LeaderboardPage() {
  const { user, isConnected } = useUserProfile();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'xp' | 'level' | 'totalFishCaught'>('xp');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy, page]);

  const fetchLeaderboard = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/leaderboard?page=${page}&sortBy=${sortBy}`);
      
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

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
            Leaderboard
          </motion.h1>
          {isConnected && <ConnectButton />}
        </div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-lg"
        >
          <p className="text-sm text-gray-600 mb-3">Sort by:</p>
          <div className="flex gap-3 flex-wrap">
            {[
              { value: 'xp', label: 'Total XP' },
              { value: 'level', label: 'Level' },
              { value: 'totalFishCaught', label: 'Fish Caught' },
            ].map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSortBy(option.value as typeof sortBy);
                  setPage(1);
                }}
                className={`
                  px-6 py-2 rounded-lg font-bold transition-all
                  ${
                    sortBy === option.value
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-6xl"
              >
                🎣
              </motion.div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p className="text-2xl mb-2">🐟</p>
              <p>No players yet. Be the first to fish!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Rank</th>
                    <th className="px-6 py-4 text-left font-bold">Player</th>
                    <th className="px-6 py-4 text-center font-bold">Level</th>
                    <th className="px-6 py-4 text-center font-bold">XP</th>
                    <th className="px-6 py-4 text-center font-bold">Fish Caught</th>
                    <th className="px-6 py-4 text-center font-bold">Unique</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = user && entry.walletAddress === user.walletAddress;
                    
                    return (
                      <motion.tr
                        key={entry.walletAddress}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          border-b border-gray-100 transition-colors
                          ${isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        `}
                      >
                        <td className="px-6 py-4">
                          <span className="text-2xl font-bold">
                            {getRankEmoji(entry.rank || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-gray-800">
                              {entry.displayName}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                  YOU
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {truncateAddress(entry.walletAddress)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">
                            {entry.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-blue-600">
                          {formatNumber(entry.xp)}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-cyan-600">
                          {formatNumber(entry.totalFishCaught)}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-green-600">
                          {entry.uniqueFishCaught}/20
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-2 bg-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </motion.button>
            
            <div className="flex items-center px-6 py-2 bg-white rounded-lg shadow-lg font-bold">
              Page {page} of {totalPages}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-2 bg-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </motion.button>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2">
             Compete for Glory!
          </h2>
          <p>
            Catch more fish, earn more XP, and climb the leaderboard to prove you're the ultimate angler!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

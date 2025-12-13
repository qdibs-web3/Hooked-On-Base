'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { StatsDisplay } from '@/components/game/StatsDisplay';
import { Navigation } from '@/components/layout/Navigation';
import { FISH_DATA } from '@/lib/data/fish';
import { RARITY_COLORS } from '@/lib/data/constants';

export default function DashboardPage() {
  const { user, loading, isConnected } = useUserProfile();
  const router = useRouter();

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
              <p className="font-bold text-2xl">20</p>
              <p className="text-gray-600">Fish Species</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="font-bold text-2xl">9</p>
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
            🎣 Dashboard
          </motion.h1>
          <ConnectButton />
        </div>

        {/* Stats */}
        <StatsDisplay user={user} />

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user.displayName}!
          </h2>
          <p className="text-gray-600">
            Ready to cast your line? Head to the Play page to start fishing!
          </p>
        </motion.div>

        {/* Recent Catches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recent Catches
          </h2>
          
          {user.fishCaught.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No fish caught yet. Start fishing to see your catches here!
            </p>
          ) : (
            <div className="space-y-3">
              {user.fishCaught.slice(-5).reverse().map((fish, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">
                      {FISH_DATA.find(f => f.id === fish.fishId)?.emoji || '🐟'}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800">{fish.fishName}</p>
                      <p
                        className="text-sm font-semibold uppercase"
                        style={{ color: RARITY_COLORS[fish.rarity] }}
                      >
                        {fish.rarity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      +{fish.xpEarned} XP
                    </p>
                    <p className="text-sm text-yellow-600 font-bold">
                      +{fish.hookEarned} $HOOK
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Fish Collection Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Fish Collection
          </h2>
          <p className="text-gray-600 mb-4">
            {user.uniqueFishCaught.length} / {FISH_DATA.length} species discovered
          </p>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {FISH_DATA.map((fish) => {
              const caught = user.uniqueFishCaught.includes(fish.id);
              
              return (
                <motion.div
                  key={fish.id}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-3xl
                    ${caught ? 'bg-gradient-to-br from-blue-100 to-cyan-100' : 'bg-gray-200'}
                  `}
                  style={{
                    borderWidth: 2,
                    borderColor: caught ? RARITY_COLORS[fish.rarity] : 'transparent',
                  }}
                  title={caught ? fish.name : '???'}
                >
                  {caught ? fish.emoji : '❓'}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/play')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg font-bold text-lg"
          >
            🎣 Start Fishing
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/shop')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg font-bold text-lg"
          >
            🏪 Visit Shop
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/leaderboard')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-lg font-bold text-lg"
          >
            🏆 Leaderboard
          </motion.button>
        </div>
      </div>
    </div>
  );
}

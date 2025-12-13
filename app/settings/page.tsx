'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Navigation } from '@/components/layout/Navigation';
import { TokenomicsInfo } from '@/components/ui/TokenomicsInfo';
import { MAX_DISPLAY_NAME_LENGTH } from '@/lib/data/constants';

export default function SettingsPage() {
  const { user, loading, isConnected, updateUser } = useUserProfile();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showTokenomics, setShowTokenomics] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim() || !user) return;

    setSaving(true);

    try {
      await updateUser({ displayName: displayName.trim() });
      alert('Display name updated successfully!');
      setDisplayName('');
    } catch (err) {
      alert('Failed to update display name');
    } finally {
      setSaving(false);
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
            ⚙️ Settings
          </h1>
          <p className="text-gray-600">
            Connect your wallet to access settings!
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
      
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-gray-800"
          >
            ⚙️ Settings
          </motion.h1>
          <ConnectButton />
        </div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            👤 Profile Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={user.walletAddress}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Current Display Name
              </label>
              <input
                type="text"
                value={user.displayName}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                New Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME_LENGTH))}
                placeholder="Enter new display name"
                maxLength={MAX_DISPLAY_NAME_LENGTH}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {displayName.length}/{MAX_DISPLAY_NAME_LENGTH} characters
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!displayName.trim() || saving}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Update Display Name'}
            </motion.button>
          </div>
        </motion.div>

        {/* Account Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 Account Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Account Age</p>
              <p className="text-2xl font-bold text-purple-700">
                {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Casts</p>
              <p className="text-2xl font-bold text-blue-700">
                {user.totalCasts}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-700">
                {user.totalCasts > 0 ? Math.round((user.totalFishCaught / user.totalCasts) * 100) : 0}%
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total XP</p>
              <p className="text-2xl font-bold text-yellow-700">
                {user.xp.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Collection</p>
              <p className="text-2xl font-bold text-red-700">
                {user.uniqueFishCaught.length}/20
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">Rods Owned</p>
              <p className="text-2xl font-bold text-indigo-700">
                {user.ownedRods.length}/9
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tokenomics Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTokenomics(!showTokenomics)}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {showTokenomics ? '▼ Hide' : '▶'} $HOOK Tokenomics & Roadmap
          </motion.button>
        </motion.div>

        {/* Tokenomics Info */}
        {showTokenomics && <TokenomicsInfo />}

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2">
            🎣 About Hooked
          </h2>
          <p className="mb-4">
            Hooked is a Web3 fishing game built on Base. Cast your line, catch rare fish, 
            earn $HOOK tokens, and compete on the leaderboard!
          </p>
          <p className="text-sm opacity-90">
            Version 1.0.0 • Built for Base Mini App Community
          </p>
        </motion.div>
      </div>
    </div>
  );
}

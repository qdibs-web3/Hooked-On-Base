'use client';

import { motion } from 'framer-motion';
import {
  PLAY_COST_BASE,
  PLAY_COST_HOOK,
  BURN_PERCENTAGE,
  TREASURY_PERCENTAGE,
  STAKING_TIERS,
  LEVEL_UP_HOOK_REWARD,
} from '@/lib/data/constants';

export function TokenomicsInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        $HOOK Tokenomics
      </h2>

      {/* Earning $HOOK */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          How to Earn $HOOK
        </h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl"></span>
            <div>
              <p className="font-bold text-green-700">Catch Fish</p>
              <p className="text-sm">Earn $HOOK tokens based on fish rarity (2-1000 $HOOK per catch)</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <span className="text-2xl"></span>
            <div>
              <p className="font-bold text-purple-700">Level Up</p>
              <p className="text-sm">Earn {LEVEL_UP_HOOK_REWARD} $HOOK every time you level up</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl"></span>
            <div>
              <p className="font-bold text-blue-700">Daily Rewards (Coming Soon)</p>
              <p className="text-sm">Log in daily to claim bonus $HOOK tokens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spending $HOOK */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          How to Spend $HOOK
        </h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
            <span className="text-2xl"></span>
            <div>
              <p className="font-bold text-orange-700">Upgrade Fishing Rods</p>
              <p className="text-sm">Purchase better rods (100-25,000 $HOOK) to increase catch rates and XP</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
            <span className="text-2xl"></span>
            <div>
              <p className="font-bold text-pink-700">Cosmetics (Coming Soon)</p>
              <p className="text-sm">Buy skins for your fishing rod and pier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Future Web3 Features */}
      <div className="border-t-2 border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span></span> Coming Soon: Web3 Integration
        </h3>
        <div className="space-y-3 text-gray-600">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
            <p className="font-bold text-blue-700 mb-2">Play-to-Earn with BASE</p>
            <p className="text-sm">
              Pay {PLAY_COST_BASE} BASE or {PLAY_COST_HOOK} $HOOK per play (discounted with $HOOK)
            </p>
            <p className="text-xs mt-2 text-blue-600">
              • {BURN_PERCENTAGE * 100}% of $HOOK from plays is burned 
              <br />• {TREASURY_PERCENTAGE * 100}% goes to prize treasury 
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
            <p className="font-bold text-purple-700 mb-2">Staking Rewards</p>
            <p className="text-sm mb-3">Stake $HOOK to earn bonus daily plays:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {STAKING_TIERS.map((tier) => (
                <div key={tier.label} className="bg-white p-2 rounded">
                  <p className="font-bold text-purple-600">{tier.label}</p>
                  <p>Stake {tier.amount} $HOOK</p>
                  <p className="text-purple-700">→ {tier.dailyPlays} free plays/day</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
            <p className="font-bold text-yellow-700 mb-2">NFT Prize System</p>
            <p className="text-sm">
              Win NFT prizes that can be redeemed for physical merchandise or traded on the marketplace
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
            <p className="font-bold text-green-700 mb-2">Governance</p>
            <p className="text-sm">
              Vote on new cosmetics, events, and game features using your $HOOK tokens
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-bold text-gray-800 mb-2">Note:</p>
        <p>
          Currently, $HOOK is an in-game currency. Web3 features (blockchain integration, smart contracts, NFTs) 
          will be added in a future update. Stay tuned!
        </p>
      </div>
    </motion.div>
  );
}

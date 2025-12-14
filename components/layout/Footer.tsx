'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8 px-6 mt-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">
            🎣 About Hooked
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Hooked is a Web3 fishing game built on Base. Cast your line, catch rare fish, 
            earn $HOOK tokens, and compete on the leaderboard!
          </p>
          <p className="text-sm text-white/75">
            Version 1.0.0 • Built for Base Mini App Community
          </p>
          <div className="pt-4 border-t border-white/20">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} Hooked. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
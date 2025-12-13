'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { truncateAddress } from '@/lib/data/constants';
import { motion } from 'framer-motion';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => disconnect()}
        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        {truncateAddress(address)}
      </motion.button>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      {connectors.map((connector) => (
        <motion.button
          key={connector.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => connect({ connector })}
          className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Connect with {connector.name}
        </motion.button>
      ))}
    </div>
  );
}

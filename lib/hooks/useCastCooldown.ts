'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { CAST_COOLDOWN_MS } from '@/lib/data/constants';

interface CooldownStatus {
  canCast: boolean;
  remainingTime: number;
  canCastAt: Date | null;
  lastCastTime: Date | null;
}

export function useCastCooldown() {
  const { address, isConnected } = useAccount();
  const [cooldown, setCooldown] = useState<CooldownStatus>({
    canCast: true,
    remainingTime: 0,
    canCastAt: null,
    lastCastTime: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setCooldown({
        canCast: true,
        remainingTime: 0,
        canCastAt: null,
        lastCastTime: null,
      });
      return;
    }

    checkCooldown();

    // Set up interval to update cooldown every second
    const interval = setInterval(() => {
      if (cooldown.canCastAt) {
        const now = new Date();
        const remaining = cooldown.canCastAt.getTime() - now.getTime();

        if (remaining <= 0) {
          setCooldown((prev) => ({
            ...prev,
            canCast: true,
            remainingTime: 0,
          }));
        } else {
          setCooldown((prev) => ({
            ...prev,
            remainingTime: remaining,
          }));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [address, isConnected, cooldown.canCastAt]);

  const checkCooldown = async () => {
    if (!address) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/cast/cooldown?address=${address}`);

      if (response.ok) {
        const data = await response.json();
        setCooldown({
          canCast: data.canCast,
          remainingTime: data.remainingTime,
          canCastAt: data.canCastAt ? new Date(data.canCastAt) : null,
          lastCastTime: data.lastCastTime ? new Date(data.lastCastTime) : null,
        });
      }
    } catch (err) {
      console.error('Error checking cooldown:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    ...cooldown,
    loading,
    checkCooldown,
    formatTime,
  };
}

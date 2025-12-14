'use client';

import { useState, useEffect, useRef } from 'react';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check cooldown from API
  const checkCooldown = async () => {
    if (!address) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/cast?address=${address}`);

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

  // Initial check when address changes
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
  }, [address, isConnected]);

  // Update remaining time every second
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (cooldown.canCastAt && !cooldown.canCast) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const remaining = cooldown.canCastAt!.getTime() - now.getTime();

        if (remaining <= 0) {
          setCooldown((prev) => ({
            ...prev,
            canCast: true,
            remainingTime: 0,
          }));
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          setCooldown((prev) => ({
            ...prev,
            remainingTime: remaining,
          }));
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cooldown.canCastAt, cooldown.canCast]);

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
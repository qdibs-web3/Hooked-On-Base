'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { UserProfile } from '@/lib/db/types';

export function useUserProfile() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setUser(null);
      return;
    }

    fetchOrCreateUser();
  }, [address, isConnected]);

  const fetchOrCreateUser = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      console.log('[useUserProfile] Fetching user for address:', address);
      
      // Try to fetch existing user
      const response = await fetch(`/api/user?address=${address}`, {
        signal: controller.signal,
      });

      console.log('[useUserProfile] Fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[useUserProfile] User found:', data.user?.walletAddress);
        setUser(data.user);
      } else if (response.status === 404) {
        console.log('[useUserProfile] User not found, creating new user');
        // User doesn't exist, create new one
        const createResponse = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
          }),
          signal: controller.signal,
        });

        console.log('[useUserProfile] Create response status:', createResponse.status);

        if (createResponse.ok) {
          const data = await createResponse.json();
          console.log('[useUserProfile] User created:', data.user?.walletAddress);
          setUser(data.user);
        } else {
          const errorData = await createResponse.json().catch(() => ({}));
          console.error('[useUserProfile] Failed to create user:', errorData);
          throw new Error(errorData.error || 'Failed to create user');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[useUserProfile] Failed to fetch user:', errorData);
        throw new Error(errorData.error || 'Failed to fetch user');
      }
    } catch (err) {
      console.error('[useUserProfile] Error:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      console.log('[useUserProfile] Loading complete');
    }
  };

  const refreshUser = async () => {
    await fetchOrCreateUser();
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!address) return;

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          updates,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      } else {
        throw new Error('Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    refreshUser,
    updateUser,
    isConnected,
  };
}
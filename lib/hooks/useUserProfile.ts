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

    try {
      // Try to fetch existing user
      const response = await fetch(`/api/user?address=${address}`);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 404) {
        // User doesn't exist, create new one
        const createResponse = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
          }),
        });

        if (createResponse.ok) {
          const data = await createResponse.json();
          setUser(data.user);
        } else {
          throw new Error('Failed to create user');
        }
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
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

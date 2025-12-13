import { FishRarity } from '../data/fish';

// User Profile
export interface UserProfile {
  _id?: string;
  walletAddress: string; // Primary identifier (lowercase)
  displayName: string; // Customizable display name
  createdAt: Date;
  updatedAt: Date;
  
  // Game stats
  level: number;
  xp: number;
  hookBalance: number; // $HOOK token balance
  
  // Inventory
  currentRodId: string; // Currently equipped fishing rod
  ownedRods: string[]; // Array of owned rod IDs
  
  // Fishing stats
  totalCasts: number;
  lastCastTime: Date | null;
  
  // Achievements
  fishCaught: FishCatch[]; // All fish caught by this user
  uniqueFishCaught: string[]; // Unique fish IDs (for collection tracking)
  totalFishCaught: number;
  
  // Staking (for future use)
  stakedHook: number;
  stakingTier: number;
}

// Fish Catch Record
export interface FishCatch {
  fishId: string;
  fishName: string;
  rarity: FishRarity;
  caughtAt: Date;
  xpEarned: number;
  hookEarned: number;
  rodUsed: string; // Rod ID used for this catch
}

// Leaderboard Entry
export interface LeaderboardEntry {
  walletAddress: string;
  displayName: string;
  level: number;
  xp: number;
  totalFishCaught: number;
  uniqueFishCaught: number;
  rank?: number; // Calculated on query
}

// Transaction Log (for future Web3 integration)
export interface Transaction {
  _id?: string;
  walletAddress: string;
  type: 'earn' | 'spend' | 'burn' | 'stake' | 'unstake';
  amount: number;
  description: string;
  timestamp: Date;
  txHash?: string; // Blockchain transaction hash (future)
}

// Create User DTO
export interface CreateUserDTO {
  walletAddress: string;
  displayName?: string;
}

// Update User DTO
export interface UpdateUserDTO {
  displayName?: string;
  currentRodId?: string;
}

// Cast Result
export interface CastResult {
  success: boolean;
  fish?: FishCatch;
  xpGained: number;
  hookGained: number;
  levelUp: boolean;
  newLevel?: number;
  message: string;
}

// Game Configuration Constants

// Timing
export const CAST_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
export const CAST_ANIMATION_DURATION = 3000; // 3 seconds for casting animation

// Starting values for new players
export const STARTING_HOOK = 100; // Starting $HOOK tokens
export const STARTING_ROD = 'starter'; // Starting fishing rod ID
export const STARTING_LEVEL = 1;
export const STARTING_XP = 0;

// Level progression
export const XP_PER_LEVEL_BASE = 100; // Base XP needed for level 2
export const XP_SCALING_FACTOR = 1.5; // Each level requires 1.5x more XP

// Calculate XP needed for a specific level
export const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_SCALING_FACTOR, level - 2));
};

// Calculate total XP needed to reach a level
export const getTotalXPForLevel = (level: number): number => {
  let totalXP = 0;
  for (let i = 2; i <= level; i++) {
    totalXP += getXPForLevel(i);
  }
  return totalXP;
};

// Calculate level from total XP
export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  let totalXP = 0;
  
  while (totalXP <= xp) {
    level++;
    totalXP += getXPForLevel(level);
  }
  
  return level - 1;
};

// Level up rewards
export const LEVEL_UP_HOOK_REWARD = 50; // $HOOK earned per level up

// Tokenomics (for future Web3 integration)
export const PLAY_COST_BASE = 0.01; // 0.01 BASE per play
export const PLAY_COST_HOOK = 10; // 10 $HOOK per play (discounted)
export const BURN_PERCENTAGE = 0.2; // 20% of HOOK from plays is burned
export const TREASURY_PERCENTAGE = 0.8; // 80% goes to treasury

// Staking (for future implementation)
export const STAKING_TIERS = [
  { amount: 100, dailyPlays: 1, label: 'Bronze' },
  { amount: 500, dailyPlays: 3, label: 'Silver' },
  { amount: 1000, dailyPlays: 5, label: 'Gold' },
  { amount: 5000, dailyPlays: 10, label: 'Platinum' },
];

// Leaderboard
export const LEADERBOARD_PAGE_SIZE = 50;
export const LEADERBOARD_REFRESH_INTERVAL = 60000; // 1 minute

// User settings
export const MAX_DISPLAY_NAME_LENGTH = 20;
export const DEFAULT_DISPLAY_NAME_PREFIX = 'Angler';

// Wallet address truncation
export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format numbers with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Format $HOOK with token symbol
export const formatHook = (amount: number): string => {
  return `${formatNumber(amount)} $HOOK`;
};

// Rarity colors (matching fish.ts)
export const RARITY_COLORS = {
  common: '#94a3b8',
  uncommon: '#22d3ee',
  rare: '#a855f7',
  epic: '#f59e0b',
  legendary: '#ef4444',
  mythic: '#fbbf24',
};

// Rarity labels
export const RARITY_LABELS = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

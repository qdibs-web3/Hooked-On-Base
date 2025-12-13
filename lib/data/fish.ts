export type FishRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface Fish {
  id: string;
  name: string;
  rarity: FishRarity;
  catchRate: number; // Base catch rate percentage (0-100)
  xpReward: number;
  hookReward: number; // $HOOK tokens earned
  description: string;
  color: string; // Primary color for SVG rendering
  emoji: string; // Fallback visual
}

// Rarity distribution and multipliers
export const RARITY_CONFIG = {
  common: { weight: 50, color: '#94a3b8', multiplier: 1 },
  uncommon: { weight: 25, color: '#22d3ee', multiplier: 1.5 },
  rare: { weight: 15, color: '#a855f7', multiplier: 2 },
  epic: { weight: 7, color: '#f59e0b', multiplier: 3 },
  legendary: { weight: 2.5, color: '#ef4444', multiplier: 5 },
  mythic: { weight: 0.5, color: '#fbbf24', multiplier: 10 },
};

export const FISH_DATA: Fish[] = [
  // COMMON (50% total)
  {
    id: 'minnow',
    name: 'Minnow',
    rarity: 'common',
    catchRate: 25,
    xpReward: 10,
    hookReward: 2,
    description: 'A tiny fish that swims in schools',
    color: '#cbd5e1',
    emoji: '🐟',
  },
  {
    id: 'sardine',
    name: 'Sardine',
    rarity: 'common',
    catchRate: 20,
    xpReward: 15,
    hookReward: 3,
    description: 'Small but plentiful in these waters',
    color: '#94a3b8',
    emoji: '🐟',
  },
  {
    id: 'herring',
    name: 'Herring',
    rarity: 'common',
    catchRate: 15,
    xpReward: 20,
    hookReward: 4,
    description: 'A silvery fish found near the surface',
    color: '#64748b',
    emoji: '🐟',
  },
  {
    id: 'perch',
    name: 'Perch',
    rarity: 'common',
    catchRate: 10,
    xpReward: 25,
    hookReward: 5,
    description: 'Striped and eager to bite',
    color: '#78716c',
    emoji: '🐟',
  },

  // UNCOMMON (25% total)
  {
    id: 'bass',
    name: 'Bass',
    rarity: 'uncommon',
    catchRate: 12,
    xpReward: 40,
    hookReward: 8,
    description: 'A fighter that puts up a good struggle',
    color: '#06b6d4',
    emoji: '🐠',
  },
  {
    id: 'trout',
    name: 'Trout',
    rarity: 'uncommon',
    catchRate: 10,
    xpReward: 50,
    hookReward: 10,
    description: 'Spotted beauty of freshwater streams',
    color: '#22d3ee',
    emoji: '🐠',
  },
  {
    id: 'catfish',
    name: 'Catfish',
    rarity: 'uncommon',
    catchRate: 8,
    xpReward: 60,
    hookReward: 12,
    description: 'Bottom dweller with whisker-like barbels',
    color: '#0891b2',
    emoji: '🐠',
  },
  {
    id: 'pike',
    name: 'Pike',
    rarity: 'uncommon',
    catchRate: 5,
    xpReward: 70,
    hookReward: 14,
    description: 'Aggressive predator with sharp teeth',
    color: '#0e7490',
    emoji: '🐠',
  },

  // RARE (15% total)
  {
    id: 'salmon',
    name: 'Salmon',
    rarity: 'rare',
    catchRate: 8,
    xpReward: 100,
    hookReward: 20,
    description: 'Prized for its strength and flavor',
    color: '#c084fc',
    emoji: '🐡',
  },
  {
    id: 'tuna',
    name: 'Tuna',
    rarity: 'rare',
    catchRate: 6,
    xpReward: 120,
    hookReward: 25,
    description: 'Fast swimmer of the open ocean',
    color: '#a855f7',
    emoji: '🐡',
  },
  {
    id: 'swordfish',
    name: 'Swordfish',
    rarity: 'rare',
    catchRate: 4,
    xpReward: 150,
    hookReward: 30,
    description: 'Majestic fish with a pointed bill',
    color: '#9333ea',
    emoji: '🐡',
  },
  {
    id: 'marlin',
    name: 'Marlin',
    rarity: 'rare',
    catchRate: 3,
    xpReward: 180,
    hookReward: 35,
    description: 'Trophy fish that tests your skill',
    color: '#7c3aed',
    emoji: '🐡',
  },

  // EPIC (7% total)
  {
    id: 'shark',
    name: 'Shark',
    rarity: 'epic',
    catchRate: 4,
    xpReward: 250,
    hookReward: 50,
    description: 'Apex predator of the deep',
    color: '#fb923c',
    emoji: '🦈',
  },
  {
    id: 'stingray',
    name: 'Stingray',
    rarity: 'epic',
    catchRate: 3,
    xpReward: 300,
    hookReward: 60,
    description: 'Graceful glider with a venomous tail',
    color: '#f59e0b',
    emoji: '🐙',
  },
  {
    id: 'octopus',
    name: 'Giant Octopus',
    rarity: 'epic',
    catchRate: 2,
    xpReward: 350,
    hookReward: 70,
    description: 'Intelligent creature with eight arms',
    color: '#ea580c',
    emoji: '🐙',
  },

  // LEGENDARY (2.5% total)
  {
    id: 'whale',
    name: 'Blue Whale',
    rarity: 'legendary',
    catchRate: 1.5,
    xpReward: 500,
    hookReward: 100,
    description: 'The largest creature in the ocean',
    color: '#dc2626',
    emoji: '🐋',
  },
  {
    id: 'kraken',
    name: 'Kraken',
    rarity: 'legendary',
    catchRate: 1,
    xpReward: 750,
    hookReward: 150,
    description: 'Legendary sea monster of myth',
    color: '#b91c1c',
    emoji: '🦑',
  },
  {
    id: 'megalodon',
    name: 'Megalodon',
    rarity: 'legendary',
    catchRate: 0.8,
    xpReward: 1000,
    hookReward: 200,
    description: 'Ancient giant shark thought extinct',
    color: '#991b1b',
    emoji: '🦈',
  },

  // MYTHIC (0.5% total)
  {
    id: 'leviathan',
    name: 'Leviathan',
    rarity: 'mythic',
    catchRate: 0.3,
    xpReward: 2000,
    hookReward: 500,
    description: 'Biblical sea serpent of immense power',
    color: '#fbbf24',
    emoji: '🐉',
  },
  {
    id: 'poseidon',
    name: "Poseidon's Trident Fish",
    rarity: 'mythic',
    catchRate: 0.2,
    xpReward: 3000,
    hookReward: 1000,
    description: 'Blessed by the god of the sea himself',
    color: '#f59e0b',
    emoji: '🔱',
  },
];

// Helper function to get fish by ID
export const getFishById = (id: string): Fish | undefined => {
  return FISH_DATA.find((fish) => fish.id === id);
};

// Helper function to get fish by rarity
export const getFishByRarity = (rarity: FishRarity): Fish[] => {
  return FISH_DATA.filter((fish) => fish.rarity === rarity);
};

// Calculate total catch weight for RNG
export const getTotalCatchWeight = (): number => {
  return FISH_DATA.reduce((total, fish) => total + fish.catchRate, 0);
};

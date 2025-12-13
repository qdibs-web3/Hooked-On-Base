export interface FishingRod {
  id: string;
  name: string;
  tier: number; // 1-9
  price: number; // $HOOK cost (0 for starter)
  catchRateBonus: number; // Percentage increase to catch rate
  rareBonusChance: number; // Percentage increase for rare+ fish
  xpMultiplier: number; // XP multiplier (1.0 = no bonus)
  description: string;
  color: string; // Rod color for visual
  unlockLevel: number; // Player level required to purchase
}

export const FISHING_RODS: FishingRod[] = [
  {
    id: 'starter',
    name: 'Starter Rod',
    tier: 1,
    price: 0,
    catchRateBonus: 0,
    rareBonusChance: 0,
    xpMultiplier: 1.0,
    description: 'A basic rod for beginners. Free for all players.',
    color: '#78716c',
    unlockLevel: 1,
  },
  {
    id: 'basic',
    name: 'Basic Rod',
    tier: 2,
    price: 100,
    catchRateBonus: 5,
    rareBonusChance: 2,
    xpMultiplier: 1.1,
    description: 'Slightly better than the starter. Good for learning.',
    color: '#94a3b8',
    unlockLevel: 3,
  },
  {
    id: 'improved',
    name: 'Improved Rod',
    tier: 3,
    price: 300,
    catchRateBonus: 10,
    rareBonusChance: 5,
    xpMultiplier: 1.2,
    description: 'A noticeable upgrade with better materials.',
    color: '#06b6d4',
    unlockLevel: 5,
  },
  {
    id: 'advanced',
    name: 'Advanced Rod',
    tier: 4,
    price: 600,
    catchRateBonus: 15,
    rareBonusChance: 8,
    xpMultiplier: 1.3,
    description: 'For experienced anglers seeking better catches.',
    color: '#3b82f6',
    unlockLevel: 8,
  },
  {
    id: 'expert',
    name: 'Expert Rod',
    tier: 5,
    price: 1200,
    catchRateBonus: 20,
    rareBonusChance: 12,
    xpMultiplier: 1.5,
    description: 'Professional-grade equipment for serious fishers.',
    color: '#8b5cf6',
    unlockLevel: 12,
  },
  {
    id: 'master',
    name: 'Master Rod',
    tier: 6,
    price: 2500,
    catchRateBonus: 30,
    rareBonusChance: 18,
    xpMultiplier: 1.75,
    description: 'Crafted by master artisans with rare materials.',
    color: '#a855f7',
    unlockLevel: 16,
  },
  {
    id: 'legendary',
    name: 'Legendary Rod',
    tier: 7,
    price: 5000,
    catchRateBonus: 40,
    rareBonusChance: 25,
    xpMultiplier: 2.0,
    description: 'Legendary craftsmanship attracts legendary fish.',
    color: '#f59e0b',
    unlockLevel: 20,
  },
  {
    id: 'mythic',
    name: 'Mythic Rod',
    tier: 8,
    price: 10000,
    catchRateBonus: 55,
    rareBonusChance: 35,
    xpMultiplier: 2.5,
    description: 'Forged from mythical materials beyond comprehension.',
    color: '#ef4444',
    unlockLevel: 25,
  },
  {
    id: 'divine',
    name: 'Divine Rod of Poseidon',
    tier: 9,
    price: 25000,
    catchRateBonus: 75,
    rareBonusChance: 50,
    xpMultiplier: 3.0,
    description: 'Blessed by Poseidon himself. The ultimate fishing tool.',
    color: '#fbbf24',
    unlockLevel: 30,
  },
];

// Helper function to get rod by ID
export const getRodById = (id: string): FishingRod | undefined => {
  return FISHING_RODS.find((rod) => rod.id === id);
};

// Helper function to get rods available at a certain level
export const getAvailableRods = (playerLevel: number): FishingRod[] => {
  return FISHING_RODS.filter((rod) => rod.unlockLevel <= playerLevel);
};

// Helper function to get next rod upgrade
export const getNextRodUpgrade = (currentRodId: string): FishingRod | null => {
  const currentRod = getRodById(currentRodId);
  if (!currentRod) return null;
  
  const nextTier = currentRod.tier + 1;
  return FISHING_RODS.find((rod) => rod.tier === nextTier) || null;
};

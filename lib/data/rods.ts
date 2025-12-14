export interface FishingRod {
  id: string;
  name: string;
  tier: number;
  price: number;
  catchRateBonus: number; // % bonus (capped)
  rareBonusChance: number; // % bonus (capped)
  xpMultiplier: number;
  description: string;
  color: string;
  unlockLevel: number;
}

/* ───────────────────────────────────────────── */
/* 🎨 VFX SYSTEM                                 */
/* ───────────────────────────────────────────── */

export interface RodVFX {
  glowIntensity: number; // 0–1.5
  particleRate: number; // particles/sec
  trailType: 'none' | 'water' | 'light' | 'void' | 'divine';
}

export const ROD_VFX_BY_TIER: Record<number, RodVFX> = {
  1: { glowIntensity: 0, particleRate: 0, trailType: 'none' },
  2: { glowIntensity: 0.1, particleRate: 2, trailType: 'water' },
  3: { glowIntensity: 0.15, particleRate: 4, trailType: 'water' },
  4: { glowIntensity: 0.25, particleRate: 6, trailType: 'water' },
  5: { glowIntensity: 0.35, particleRate: 8, trailType: 'light' },
  6: { glowIntensity: 0.45, particleRate: 10, trailType: 'light' },
  7: { glowIntensity: 0.6, particleRate: 14, trailType: 'light' },
  8: { glowIntensity: 0.75, particleRate: 18, trailType: 'divine' },
  9: { glowIntensity: 1.0, particleRate: 24, trailType: 'divine' },
  12: { glowIntensity: 1.2, particleRate: 30, trailType: 'void' },
  16: { glowIntensity: 1.35, particleRate: 36, trailType: 'void' },
  21: { glowIntensity: 1.5, particleRate: 42, trailType: 'void' },
};

/* ───────────────────────────────────────────── */
/* 🧠 RARITY CURVE SYSTEM                        */
/* ───────────────────────────────────────────── */

export const BASE_RARITY = {
  common: 0.65,
  uncommon: 0.22,
  rare: 0.09,
  epic: 0.035,
  legendary: 0.005,
};

export function applyRodRarityCurve(
  base = BASE_RARITY,
  rod: FishingRod
) {
  const curveStrength = Math.min(rod.tier / 10, 1);
  const rareBias = rod.rareBonusChance / 100;

  return {
    common: base.common * (1 - curveStrength * 0.4),
    uncommon: base.uncommon * (1 - curveStrength * 0.25),
    rare: base.rare * (1 + rareBias * 1.2),
    epic: base.epic * (1 + rareBias * 1.6),
    legendary: base.legendary * (1 + rareBias * 2.2),
  };
}

/* ───────────────────────────────────────────── */
/* 🎣 RODS (RESCALED + EXTENDED)                 */
/* ───────────────────────────────────────────── */

export const FISHING_RODS: FishingRod[] = [
  {
    id: 'starter',
    name: 'Driftwood Initiate Rod',
    tier: 1,
    price: 0,
    catchRateBonus: 0,
    rareBonusChance: 0,
    xpMultiplier: 1.0,
    description: 'A humble rod carved from driftwood.',
    color: '#78716c',
    unlockLevel: 1,
  },
  {
    id: 'basic',
    name: 'Tidecaller Rod',
    tier: 2,
    price: 100,
    catchRateBonus: 4,
    rareBonusChance: 2,
    xpMultiplier: 1.1,
    description: 'Whispers with the rhythm of the tides.',
    color: '#94a3b8',
    unlockLevel: 3,
  },
  {
    id: 'improved',
    name: 'Coralbound Rod',
    tier: 3,
    price: 300,
    catchRateBonus: 7,
    rareBonusChance: 4,
    xpMultiplier: 1.2,
    description: 'Reinforced with living coral.',
    color: '#06b6d4',
    unlockLevel: 5,
  },
  {
    id: 'advanced',
    name: 'Stormline Rod',
    tier: 4,
    price: 600,
    catchRateBonus: 10,
    rareBonusChance: 6,
    xpMultiplier: 1.3,
    description: 'Built to endure violent seas.',
    color: '#3b82f6',
    unlockLevel: 8,
  },
  {
    id: 'expert',
    name: 'Abyssforged Rod',
    tier: 5,
    price: 1200,
    catchRateBonus: 14,
    rareBonusChance: 9,
    xpMultiplier: 1.5,
    description: 'Forged beneath crushing depths.',
    color: '#8b5cf6',
    unlockLevel: 12,
  },
  {
    id: 'master',
    name: 'Leviathan Spine Rod',
    tier: 6,
    price: 2500,
    catchRateBonus: 18,
    rareBonusChance: 12,
    xpMultiplier: 1.75,
    description: 'Fashioned from an ancient sea beast.',
    color: '#a855f7',
    unlockLevel: 16,
  },
  {
    id: 'legendary',
    name: 'Sunken King’s Rod',
    tier: 7,
    price: 5000,
    catchRateBonus: 23,
    rareBonusChance: 15,
    xpMultiplier: 2.0,
    description: 'Once wielded by a drowned ruler.',
    color: '#f59e0b',
    unlockLevel: 20,
  },
  {
    id: 'mythic',
    name: 'Rod of the First Ocean',
    tier: 8,
    price: 10000,
    catchRateBonus: 28,
    rareBonusChance: 20,
    xpMultiplier: 2.5,
    description: 'Said to predate the seas themselves.',
    color: '#ef4444',
    unlockLevel: 25,
  },
  {
    id: 'divine',
    name: 'Divine Rod of Poseidon',
    tier: 9,
    price: 25000,
    catchRateBonus: 35,
    rareBonusChance: 25,
    xpMultiplier: 3.0,
    description: 'Blessed by Poseidon himself.',
    color: '#fbbf24',
    unlockLevel: 30,
  },

  /* ───── PRESTIGE TIERS ───── */

  {
    id: 'celestial',
    name: 'Celestial Rod of the Tides',
    tier: 10,
    price: 40000,
    catchRateBonus: 36,
    rareBonusChance: 26,
    xpMultiplier: 3.3,
    description: 'Channels cosmic currents.',
    color: '#38bdf8',
    unlockLevel: 35,
  },
  {
    id: 'voidcurrent',
    name: 'Voidcurrent Rod',
    tier: 11,
    price: 60000,
    catchRateBonus: 37,
    rareBonusChance: 27,
    xpMultiplier: 3.6,
    description: 'Draws from oceanic nothingness.',
    color: '#0f172a',
    unlockLevel: 40,
  },
  {
    id: 'astral',
    name: 'Astral Reef Rod',
    tier: 12,
    price: 85000,
    catchRateBonus: 38,
    rareBonusChance: 28,
    xpMultiplier: 4.0,
    description: 'Half existing beyond reality.',
    color: '#818cf8',
    unlockLevel: 45,
  },
  {
    id: 'oracle',
    name: 'Oracle of the Deep Rod',
    tier: 13,
    price: 160000,
    catchRateBonus: 40,
    rareBonusChance: 30,
    xpMultiplier: 4.8,
    description: 'Sees the future of the sea.',
    color: '#14b8a6',
    unlockLevel: 55,
  },
  {
    id: 'eclipse',
    name: 'Eclipse Leviathan Rod',
    tier: 15,
    price: 210000,
    catchRateBonus: 40,
    rareBonusChance: 31,
    xpMultiplier: 5.2,
    description: 'Empowered by celestial alignment.',
    color: '#7c3aed',
    unlockLevel: 60,
  },
  {
    id: 'eternal',
    name: 'Eternal Sea Sovereign Rod',
    tier: 15,
    price: 270000,
    catchRateBonus: 40,
    rareBonusChance: 32,
    xpMultiplier: 5.7,
    description: 'Absolute dominion over tides.',
    color: '#f97316',
    unlockLevel: 65,
  },
  {
    id: 'infinite',
    name: 'Infinite Horizon Rod',
    tier: 16,
    price: 340000,
    catchRateBonus: 40,
    rareBonusChance: 33,
    xpMultiplier: 6.2,
    description: 'No known limit.',
    color: '#0ea5e9',
    unlockLevel: 70,
  },
  {
    id: 'primordial',
    name: 'Primordial Sea Rod',
    tier: 17,
    price: 420000,
    catchRateBonus: 40,
    rareBonusChance: 34,
    xpMultiplier: 6.8,
    description: 'Born with the first waves.',
    color: '#22d3ee',
    unlockLevel: 75,
  },
  {
    id: 'apex',
    name: 'Apex Oceanlord Rod',
    tier: 18,
    price: 520000,
    catchRateBonus: 40,
    rareBonusChance: 35,
    xpMultiplier: 7.5,
    description: 'Only legends may wield it.',
    color: '#fde047',
    unlockLevel: 80,
  },
  {
    id: 'mythos',
    name: 'Mythos Tidebreaker Rod',
    tier: 19,
    price: 650000,
    catchRateBonus: 40,
    rareBonusChance: 36,
    xpMultiplier: 8.2,
    description: 'Legends form with every cast.',
    color: '#fb7185',
    unlockLevel: 85,
  },
  {
    id: 'omniscient',
    name: 'Omniscient Rod of All Seas',
    tier: 20,
    price: 800000,
    catchRateBonus: 40,
    rareBonusChance: 38,
    xpMultiplier: 9.0,
    description: 'Knows every depth and current.',
    color: '#ffffff',
    unlockLevel: 90,
  },
];

/* ───────────────────────────────────────────── */
/* 🔧 HELPERS                                   */
/* ───────────────────────────────────────────── */

export const getRodById = (id: string): FishingRod | undefined =>
  FISHING_RODS.find((rod) => rod.id === id);

export const getAvailableRods = (playerLevel: number): FishingRod[] =>
  FISHING_RODS.filter((rod) => rod.unlockLevel <= playerLevel);

export const getNextRodUpgrade = (currentRodId: string): FishingRod | null => {
  const currentRod = getRodById(currentRodId);
  if (!currentRod) return null;
  return FISHING_RODS.find((rod) => rod.tier === currentRod.tier + 1) || null;
};

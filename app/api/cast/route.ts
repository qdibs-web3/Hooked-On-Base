import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { UserProfile, CastResult, FishCatch } from '@/lib/db/types';
import { FISH_DATA, getTotalCatchWeight } from '@/lib/data/fish';
import { getRodById } from '@/lib/data/rods';
import {
  CAST_COOLDOWN_MS,
  getLevelFromXP,
  LEVEL_UP_HOOK_REWARD,
} from '@/lib/data/constants';

// POST /api/cast - Cast fishing line
export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<UserProfile>('users');

    const user = await usersCollection.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check cooldown
    const now = new Date();
    if (user.lastCastTime) {
      const timeSinceLastCast = now.getTime() - user.lastCastTime.getTime();
      if (timeSinceLastCast < CAST_COOLDOWN_MS) {
        const remainingTime = CAST_COOLDOWN_MS - timeSinceLastCast;
        return NextResponse.json(
          {
            error: 'Cooldown active',
            remainingTime,
            canCastAt: new Date(user.lastCastTime.getTime() + CAST_COOLDOWN_MS),
          },
          { status: 429 }
        );
      }
    }

    // Get user's current rod
    const rod = getRodById(user.currentRodId);
    if (!rod) {
      return NextResponse.json(
        { error: 'Invalid fishing rod' },
        { status: 400 }
      );
    }

    // Perform RNG fish catch
    const caughtFish = performFishCatch(rod.catchRateBonus, rod.rareBonusChance);

    if (!caughtFish) {
      // Nothing caught
      await usersCollection.updateOne(
        { walletAddress: walletAddress.toLowerCase() },
        {
          $set: {
            lastCastTime: now,
            updatedAt: now,
          },
          $inc: {
            totalCasts: 1,
          },
        }
      );

      const result: CastResult = {
        success: false,
        xpGained: 0,
        hookGained: 0,
        levelUp: false,
        message: 'Nothing bit... Try again!',
      };

      return NextResponse.json({ result });
    }

    // Calculate rewards with rod multipliers
    const xpGained = Math.floor(caughtFish.xpReward * rod.xpMultiplier);
    const hookGained = caughtFish.hookReward;

    // Create fish catch record
    const fishCatch: FishCatch = {
      fishId: caughtFish.id,
      fishName: caughtFish.name,
      rarity: caughtFish.rarity,
      caughtAt: now,
      xpEarned: xpGained,
      hookEarned: hookGained,
      rodUsed: user.currentRodId,
    };

    // Calculate new XP and check for level up
    const newXP = user.xp + xpGained;
    const oldLevel = user.level;
    const newLevel = getLevelFromXP(newXP);
    const levelUp = newLevel > oldLevel;
    const levelUpReward = levelUp ? (newLevel - oldLevel) * LEVEL_UP_HOOK_REWARD : 0;

    // Update unique fish caught
    const uniqueFishCaught = user.uniqueFishCaught.includes(caughtFish.id)
      ? user.uniqueFishCaught
      : [...user.uniqueFishCaught, caughtFish.id];

    // Update user in database
    await usersCollection.updateOne(
      { walletAddress: walletAddress.toLowerCase() },
      {
        $set: {
          xp: newXP,
          level: newLevel,
          lastCastTime: now,
          updatedAt: now,
          uniqueFishCaught,
        },
        $inc: {
          hookBalance: hookGained + levelUpReward,
          totalCasts: 1,
          totalFishCaught: 1,
        },
        $push: {
          fishCaught: fishCatch,
        },
      }
    );

    const result: CastResult = {
      success: true,
      fish: fishCatch,
      xpGained,
      hookGained: hookGained + levelUpReward,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
      message: `You caught a ${caughtFish.rarity} ${caughtFish.name}!`,
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error casting:', error);
    return NextResponse.json(
      { error: 'Failed to cast' },
      { status: 500 }
    );
  }
}

// RNG function to determine which fish is caught
function performFishCatch(catchRateBonus: number, rareBonusChance: number) {
  const totalWeight = getTotalCatchWeight();
  
  // Apply catch rate bonus (increases overall success rate)
  const successRoll = Math.random() * 100;
  const adjustedSuccessRate = 70 + catchRateBonus; // Base 70% success rate
  
  if (successRoll > adjustedSuccessRate) {
    return null; // Nothing caught
  }

  // Determine which fish was caught using weighted random
  let random = Math.random() * totalWeight;
  
  // Apply rare bonus by giving extra weight to rare+ fish
  const fishWithBonuses = FISH_DATA.map(fish => {
    const isRare = ['rare', 'epic', 'legendary', 'mythic'].includes(fish.rarity);
    const bonusMultiplier = isRare ? (1 + rareBonusChance / 100) : 1;
    return {
      ...fish,
      adjustedCatchRate: fish.catchRate * bonusMultiplier,
    };
  });

  // Recalculate total weight with bonuses
  const adjustedTotalWeight = fishWithBonuses.reduce(
    (sum, fish) => sum + fish.adjustedCatchRate,
    0
  );
  random = Math.random() * adjustedTotalWeight;

  for (const fish of fishWithBonuses) {
    random -= fish.adjustedCatchRate;
    if (random <= 0) {
      return FISH_DATA.find(f => f.id === fish.id)!;
    }
  }

  // Fallback to first fish (should never happen)
  return FISH_DATA[0];
}

// GET /api/cast/cooldown - Check cooldown status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<UserProfile>('users');

    const user = await usersCollection.findOne({
      walletAddress: address.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    let canCast = true;
    let remainingTime = 0;
    let canCastAt = now;

    if (user.lastCastTime) {
      const timeSinceLastCast = now.getTime() - user.lastCastTime.getTime();
      if (timeSinceLastCast < CAST_COOLDOWN_MS) {
        canCast = false;
        remainingTime = CAST_COOLDOWN_MS - timeSinceLastCast;
        canCastAt = new Date(user.lastCastTime.getTime() + CAST_COOLDOWN_MS);
      }
    }

    return NextResponse.json({
      canCast,
      remainingTime,
      canCastAt,
      lastCastTime: user.lastCastTime,
    });
  } catch (error) {
    console.error('Error checking cooldown:', error);
    return NextResponse.json(
      { error: 'Failed to check cooldown' },
      { status: 500 }
    );
  }
}

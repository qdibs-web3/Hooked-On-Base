import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { UserProfile, CreateUserDTO, UpdateUserDTO } from '@/lib/db/types';
import {
  STARTING_HOOK,
  STARTING_ROD,
  STARTING_LEVEL,
  STARTING_XP,
  truncateAddress,
} from '@/lib/data/constants';

// GET /api/user?address=0x...
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

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// POST /api/user - Create new user
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserDTO = await request.json();
    const { walletAddress, displayName } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<UserProfile>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user
    const newUser: UserProfile = {
      walletAddress: walletAddress.toLowerCase(),
      displayName: displayName || truncateAddress(walletAddress),
      createdAt: new Date(),
      updatedAt: new Date(),
      level: STARTING_LEVEL,
      xp: STARTING_XP,
      hookBalance: STARTING_HOOK,
      currentRodId: STARTING_ROD,
      ownedRods: [STARTING_ROD],
      totalCasts: 0,
      lastCastTime: null,
      fishCaught: [],
      uniqueFishCaught: [],
      totalFishCaught: 0,
      stakedHook: 0,
      stakingTier: 0,
    };

    const result = await usersCollection.insertOne(newUser);
    const createdUser = await usersCollection.findOne({ _id: result.insertedId });

    return NextResponse.json({ user: createdUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PATCH /api/user - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, updates } = body as {
      walletAddress: string;
      updates: UpdateUserDTO;
    };

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<UserProfile>('users');

    const result = await usersCollection.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: result });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

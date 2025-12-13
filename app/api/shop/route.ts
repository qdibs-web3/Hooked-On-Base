import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { UserProfile } from '@/lib/db/types';
import { getRodById } from '@/lib/data/rods';

// POST /api/shop/purchase - Purchase a fishing rod
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, rodId } = await request.json();

    if (!walletAddress || !rodId) {
      return NextResponse.json(
        { error: 'Wallet address and rod ID are required' },
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

    // Get rod data
    const rod = getRodById(rodId);
    if (!rod) {
      return NextResponse.json(
        { error: 'Invalid rod ID' },
        { status: 400 }
      );
    }

    // Check if user already owns this rod
    if (user.ownedRods.includes(rodId)) {
      return NextResponse.json(
        { error: 'You already own this rod' },
        { status: 400 }
      );
    }

    // Check if user has enough $HOOK
    if (user.hookBalance < rod.price) {
      return NextResponse.json(
        { error: 'Insufficient $HOOK balance' },
        { status: 400 }
      );
    }

    // Check if user meets level requirement
    if (user.level < rod.unlockLevel) {
      return NextResponse.json(
        {
          error: `You must be level ${rod.unlockLevel} to purchase this rod`,
        },
        { status: 400 }
      );
    }

    // Perform purchase
    const result = await usersCollection.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      {
        $inc: {
          hookBalance: -rod.price,
        },
        $push: {
          ownedRods: rodId,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Purchase failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${rod.name}!`,
      user: result,
    });
  } catch (error) {
    console.error('Error purchasing rod:', error);
    return NextResponse.json(
      { error: 'Failed to purchase rod' },
      { status: 500 }
    );
  }
}

// PATCH /api/shop/equip - Equip a fishing rod
export async function PATCH(request: NextRequest) {
  try {
    const { walletAddress, rodId } = await request.json();

    if (!walletAddress || !rodId) {
      return NextResponse.json(
        { error: 'Wallet address and rod ID are required' },
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

    // Check if user owns this rod
    if (!user.ownedRods.includes(rodId)) {
      return NextResponse.json(
        { error: 'You do not own this rod' },
        { status: 400 }
      );
    }

    // Equip the rod
    const result = await usersCollection.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      {
        $set: {
          currentRodId: rodId,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to equip rod' },
        { status: 500 }
      );
    }

    const rod = getRodById(rodId);

    return NextResponse.json({
      success: true,
      message: `Equipped ${rod?.name}!`,
      user: result,
    });
  } catch (error) {
    console.error('Error equipping rod:', error);
    return NextResponse.json(
      { error: 'Failed to equip rod' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { UserProfile, LeaderboardEntry } from '@/lib/db/types';
import { LEADERBOARD_PAGE_SIZE } from '@/lib/data/constants';

// GET /api/leaderboard?page=1&sortBy=xp
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sortBy') || 'xp'; // xp, level, totalFishCaught

    const db = await getDatabase();
    const usersCollection = db.collection<UserProfile>('users');

    // Determine sort field
    let sortField: keyof UserProfile;
    switch (sortBy) {
      case 'level':
        sortField = 'level';
        break;
      case 'totalFishCaught':
        sortField = 'totalFishCaught';
        break;
      case 'xp':
      default:
        sortField = 'xp';
        break;
    }

    // Get total count for pagination
    const totalUsers = await usersCollection.countDocuments();
    const totalPages = Math.ceil(totalUsers / LEADERBOARD_PAGE_SIZE);

    // Fetch leaderboard data
    const users = await usersCollection
      .find({})
      .sort({ [sortField]: -1, createdAt: 1 }) // Sort descending, tie-break by creation time
      .skip((page - 1) * LEADERBOARD_PAGE_SIZE)
      .limit(LEADERBOARD_PAGE_SIZE)
      .toArray();

    // Transform to leaderboard entries with rank
    const startRank = (page - 1) * LEADERBOARD_PAGE_SIZE + 1;
    const leaderboard: LeaderboardEntry[] = users.map((user, index) => ({
      walletAddress: user.walletAddress,
      displayName: user.displayName,
      level: user.level,
      xp: user.xp,
      totalFishCaught: user.totalFishCaught,
      uniqueFishCaught: user.uniqueFishCaught.length,
      rank: startRank + index,
    }));

    return NextResponse.json({
      leaderboard,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        pageSize: LEADERBOARD_PAGE_SIZE,
      },
      sortBy,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

// GET /api/leaderboard/rank?address=0x... - Get user's rank
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

    // Calculate rank by counting users with higher XP
    const rank = await usersCollection.countDocuments({
      $or: [
        { xp: { $gt: user.xp } },
        {
          xp: user.xp,
          createdAt: { $lt: user.createdAt },
        },
      ],
    });

    return NextResponse.json({
      rank: rank + 1,
      user: {
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        level: user.level,
        xp: user.xp,
        totalFishCaught: user.totalFishCaught,
        uniqueFishCaught: user.uniqueFishCaught.length,
      },
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user rank' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';

export async function GET() {
  try {
    console.log('[test-db] Testing MongoDB connection...');
    console.log('[test-db] MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('[test-db] MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
    
    const db = await getDatabase();
    
    // Try to list collections
    const collections = await db.listCollections().toArray();
    
    console.log('[test-db] Successfully connected to database:', db.databaseName);
    console.log('[test-db] Collections found:', collections.length);
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connected successfully',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[test-db] MongoDB connection test failed:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : undefined,
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
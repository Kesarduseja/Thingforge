import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST() {
  try {
    await execPromise('npx prisma db push --accept-data-loss');
    await execPromise('npx tsx prisma/seed.ts');
    return NextResponse.json({ success: true, message: 'Database reset and seeded with demo scenario successfully!' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to seed database' }, { status: 500 });
  }
}

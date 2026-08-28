import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { kpiId, actual, achievementPct, status, userName = 'Official' } = body;

    const kpi = await prisma.kPI.update({
      where: { id: kpiId },
      data: {
        actual,
        achievementPct: Number(achievementPct),
        status: status || (Number(achievementPct) >= 100 ? 'PASS' : 'FAIL'),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: 'user-kpi',
        userName,
        userRole: 'GOVERNMENT',
        action: 'KPI_UPDATED',
        details: `Updated KPI "${kpi.name}" actual to ${actual} (${achievementPct}% target achievement)`,
      },
    });

    return NextResponse.json({ success: true, kpi });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

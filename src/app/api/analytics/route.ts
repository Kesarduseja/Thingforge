import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalChallenges = await prisma.challenge.count();
    const totalStartups = await prisma.startup.count();
    const activePilots = await prisma.pilot.count({ where: { status: 'IN_PROGRESS' } });
    const completedPilots = await prisma.pilot.count({ where: { status: 'COMPLETED' } });
    
    const matches = await prisma.matchScore.findMany({ select: { totalScore: true } });
    const avgMatchScore = matches.length > 0 ? Math.round(matches.reduce((a, b) => a + b.totalScore, 0) / matches.length) : 82;

    const pilots = await prisma.pilot.findMany({ select: { pilotSuccessScore: true, procurementReadinessScore: true } });
    const procurementReady = pilots.filter((p) => (p.procurementReadinessScore || 0) >= 85).length;
    
    const reuseCount = await prisma.reuseOpportunity.count();

    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 15,
    });

    return NextResponse.json({
      totalChallenges,
      totalStartups,
      activePilots,
      completedPilots,
      avgMatchScore,
      procurementReady,
      reuseCount,
      recentActivity: auditLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

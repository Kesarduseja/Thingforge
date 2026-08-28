import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePilotSuccess, calculateProcurementReadiness } from '@/lib/pilot-calculator';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pilot = await prisma.pilot.findUnique({
      where: { id: params.id },
      include: {
        challenge: true,
        startup: true,
        milestones: true,
        kpiItems: true,
        decisions: {
          include: {
            authority: true,
          },
        },
      },
    });

    if (!pilot) {
      return NextResponse.json({ error: 'Pilot workspace not found' }, { status: 404 });
    }

    // Live score calculation
    const successResult = calculatePilotSuccess(
      pilot.kpiItems.map((k) => ({ achievementPct: k.achievementPct, status: k.status })),
      pilot.milestones.map((m) => ({ status: m.status }))
    );

    const isComplianceVerified = pilot.startup.complianceStatus.toLowerCase().includes('compliant') || pilot.startup.complianceStatus.toLowerCase().includes('verified');
    const isDocComplete = pilot.milestones.filter((m) => m.status === 'COMPLETED').length >= 3;

    const readinessResult = calculateProcurementReadiness(
      successResult.score,
      isComplianceVerified,
      isDocComplete
    );

    return NextResponse.json({
      ...pilot,
      liveSuccessScore: successResult.score,
      liveSuccessStatus: successResult.status,
      liveSuccessExplanation: successResult.explanation,
      liveReadinessScore: readinessResult.score,
      liveReadinessStatus: readinessResult.status,
      liveBlockers: readinessResult.blockers,
      liveReadinessExplanation: readinessResult.explanation,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

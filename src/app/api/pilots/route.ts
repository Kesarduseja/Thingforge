import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePilotSuccess, calculateProcurementReadiness } from '@/lib/pilot-calculator';

export async function GET() {
  try {
    const pilots = await prisma.pilot.findMany({
      include: {
        challenge: true,
        startup: true,
        milestones: true,
        kpiItems: true,
        decisions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(pilots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { challengeId, startupId, departmentName, title, startDate, endDate } = body;

    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    const startup = await prisma.startup.findUnique({ where: { id: startupId } });

    if (!challenge || !startup) {
      return NextResponse.json({ error: 'Challenge or Startup not found' }, { status: 404 });
    }

    const pilot = await prisma.pilot.create({
      data: {
        challengeId,
        startupId,
        departmentName: departmentName || challenge.departmentName,
        title: title || `Pilot: ${startup.name} for ${challenge.title}`,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'IN_PROGRESS',
        progress: 10,
        pilotSuccessScore: 75,
        procurementReadinessScore: 70,
        blockers: '⚠ Initial pilot kick-off: Milestone testing pending',
      },
    });

    // Default Milestones
    await Promise.all([
      prisma.milestone.create({
        data: {
          pilotId: pilot.id,
          title: 'Phase 1: Initial Deployment & Setup',
          description: 'Deploy software/hardware units and verify system integration.',
          targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'IN_PROGRESS',
          evidenceUrl: '',
          comments: 'Initial deployment initiated.',
        },
      }),
      prisma.milestone.create({
        data: {
          pilotId: pilot.id,
          title: 'Phase 2: Field Testing & Data Verification',
          description: '30-day field testing and telemetry data stream verification.',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'PENDING',
        },
      }),
      prisma.milestone.create({
        data: {
          pilotId: pilot.id,
          title: 'Phase 3: Mid-Pilot KPI Audit',
          description: 'Review milestone progress and measure performance baseline vs target.',
          targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'PENDING',
        },
      }),
      prisma.milestone.create({
        data: {
          pilotId: pilot.id,
          title: 'Phase 4: Final Assessment & Scale Blueprint',
          description: 'Final outcome evaluation and procurement readiness recommendation.',
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'PENDING',
        },
      }),
    ]);

    // Default KPIs based on challenge
    await Promise.all([
      prisma.kPI.create({
        data: {
          pilotId: pilot.id,
          name: 'Primary Outcome Metric',
          baseline: '45 mins',
          target: '15 mins',
          actual: '20 mins',
          achievementPct: 83,
          status: 'PASS',
        },
      }),
      prisma.kPI.create({
        data: {
          pilotId: pilot.id,
          name: 'Operational Efficiency',
          baseline: '0%',
          target: '20%',
          actual: '18%',
          achievementPct: 90,
          status: 'PASS',
        },
      }),
    ]);

    // Update challenge status
    await prisma.challenge.update({
      where: { id: challengeId },
      data: { status: 'PILOT_ACTIVE' },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: 'gov-officer',
        userName: 'Government Official',
        userRole: 'GOVERNMENT',
        action: 'PILOT_STARTED',
        details: `Initiated Pilot Workspace: ${pilot.title} with startup ${startup.name}`,
      },
    });

    return NextResponse.json({ success: true, pilot });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

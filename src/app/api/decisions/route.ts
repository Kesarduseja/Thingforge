import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pilotId, action, comments, authorityName = 'P. K. Mishra (Procurement Director)' } = body;

    const pilot = await prisma.pilot.findUnique({
      where: { id: pilotId },
      include: { startup: true, challenge: true },
    });

    if (!pilot) {
      return NextResponse.json({ error: 'Pilot not found' }, { status: 404 });
    }

    let authority = await prisma.user.findFirst({
      where: { role: 'DECISION_AUTHORITY' },
    });

    if (!authority) {
      authority = await prisma.user.create({
        data: {
          name: authorityName,
          email: 'authority@procure.gov.in',
          role: 'DECISION_AUTHORITY',
          department: 'State Procurement Committee',
        },
      });
    }

    const decision = await prisma.decision.create({
      data: {
        pilotId,
        authorityId: authority.id,
        action,
        comments: comments || 'Procurement decision recorded by authorized reviewer.',
      },
    });

    // Update Pilot status based on action
    let newPilotStatus = pilot.status;
    if (action === 'PROCEED_PROCUREMENT') {
      newPilotStatus = 'COMPLETED';
    } else if (action === 'EXTEND_PILOT') {
      newPilotStatus = 'IN_PROGRESS';
    } else if (action === 'IMPROVE_ITERATE') {
      newPilotStatus = 'MID_REVIEW';
    } else if (action === 'REJECT') {
      newPilotStatus = 'COMPLETED';
    }

    await prisma.pilot.update({
      where: { id: pilotId },
      data: { status: newPilotStatus },
    });

    // Record high priority Audit Log
    await prisma.auditLog.create({
      data: {
        userId: authority.id,
        userName: authority.name,
        userRole: 'DECISION_AUTHORITY',
        action: `DECISION_${action}`,
        details: `Final Human Decision executed for ${pilot.startup.name}: ${action}. Justification: "${comments}"`,
      },
    });

    // Send notification
    await prisma.notification.create({
      data: {
        role: 'ALL',
        title: `Procurement Decision Recorded: ${action}`,
        message: `Decision Authority finalized outcome for ${pilot.startup.name} (${pilot.title}).`,
        link: `/pilots/${pilot.id}`,
      },
    });

    return NextResponse.json({ success: true, decision });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

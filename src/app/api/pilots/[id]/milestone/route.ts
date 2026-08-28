import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { milestoneId, status, evidenceUrl, comments, userName = 'User' } = body;

    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status,
        evidenceUrl: evidenceUrl !== undefined ? evidenceUrl : undefined,
        comments: comments !== undefined ? comments : undefined,
      },
    });

    // Recalculate progress % for pilot
    const allMilestones = await prisma.milestone.findMany({
      where: { pilotId: params.id },
    });
    const completedCount = allMilestones.filter((m) => m.status === 'COMPLETED').length;
    const newProgress = Math.round((completedCount / allMilestones.length) * 100);

    await prisma.pilot.update({
      where: { id: params.id },
      data: { progress: newProgress },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: 'user-milestone',
        userName,
        userRole: 'STARTUP',
        action: 'MILESTONE_UPDATED',
        details: `Updated Milestone "${milestone.title}" status to ${status}`,
      },
    });

    return NextResponse.json({ success: true, milestone, newProgress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

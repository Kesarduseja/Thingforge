import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const opportunities = await prisma.reuseOpportunity.findMany({
      orderBy: { similarityScore: 'desc' },
    });
    return NextResponse.json(opportunities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const opportunity = await prisma.reuseOpportunity.create({
      data: {
        solutionTitle: body.solutionTitle,
        startupName: body.startupName,
        originDept: body.originDept,
        targetDept: body.targetDept,
        targetCity: body.targetCity,
        similarityScore: Number(body.similarityScore || 85),
        matchingReason: body.matchingReason,
        status: 'PROPOSED',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: 'sys-reuse',
        userName: 'PRAMAN Scaling Engine',
        userRole: 'SYSTEM',
        action: 'REUSE_PROPOSED',
        details: `Cross-department solution reuse proposed to ${opportunity.targetCity} (${opportunity.targetDept})`,
      },
    });

    return NextResponse.json({ success: true, opportunity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

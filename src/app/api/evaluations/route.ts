import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeEvaluationTotal } from '@/lib/topsis-evaluation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get('challengeId');

  try {
    const evaluations = await prisma.evaluation.findMany({
      where: challengeId ? { challengeId } : undefined,
      include: {
        startup: true,
        evaluator: true,
        challenge: true,
      },
      orderBy: {
        totalScore: 'desc',
      },
    });
    return NextResponse.json(evaluations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      challengeId,
      startupId,
      evaluatorId = 'evaluator-demo',
      evaluatorName = 'Dr. Vikramaditya Roy',
      technicalFeasibility,
      innovation,
      costEffectiveness,
      scalability,
      publicImpact,
      implementationReadiness,
      comments,
    } = body;

    const totalScore = computeEvaluationTotal({
      technicalFeasibility: Number(technicalFeasibility),
      innovation: Number(innovation),
      costEffectiveness: Number(costEffectiveness),
      scalability: Number(scalability),
      publicImpact: Number(publicImpact),
      implementationReadiness: Number(implementationReadiness),
      comments: comments || '',
    });

    // Ensure evaluator user exists
    let evaluator = await prisma.user.findFirst({
      where: { role: 'EVALUATOR' },
    });
    if (!evaluator) {
      evaluator = await prisma.user.create({
        data: {
          name: evaluatorName,
          email: 'expert@iitb.ac.in',
          role: 'EVALUATOR',
          department: 'Expert Evaluation Committee',
        },
      });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        challengeId,
        startupId,
        evaluatorId: evaluator.id,
        technicalFeasibility: Number(technicalFeasibility),
        innovation: Number(innovation),
        costEffectiveness: Number(costEffectiveness),
        scalability: Number(scalability),
        publicImpact: Number(publicImpact),
        implementationReadiness: Number(implementationReadiness),
        totalScore,
        comments: comments || 'Evaluation completed.',
      },
    });

    // Create Audit Log
    const startup = await prisma.startup.findUnique({ where: { id: startupId } });
    await prisma.auditLog.create({
      data: {
        userId: evaluator.id,
        userName: evaluator.name,
        userRole: 'EVALUATOR',
        action: 'EXPERT_EVALUATION_SUBMITTED',
        details: `Evaluated ${startup?.name || 'startup'} — Score: ${totalScore}/100`,
      },
    });

    return NextResponse.json({ success: true, evaluation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

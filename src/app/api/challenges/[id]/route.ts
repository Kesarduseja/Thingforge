import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: params.id },
      include: {
        matches: {
          include: {
            startup: true,
          },
          orderBy: {
            totalScore: 'desc',
          },
        },
        evaluations: {
          include: {
            startup: true,
            evaluator: true,
          },
          orderBy: {
            totalScore: 'desc',
          },
        },
        pilots: {
          include: {
            startup: true,
            milestones: true,
            kpiItems: true,
            decisions: true,
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json(challenge);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

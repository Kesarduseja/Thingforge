import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const startups = await prisma.startup.findMany({
      include: {
        matches: {
          include: {
            challenge: true,
          },
        },
        pilots: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(startups);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const startup = await prisma.startup.create({
      data: {
        name: body.name,
        description: body.description,
        domain: body.domain,
        technologies: body.technologies,
        location: body.location,
        teamSize: Number(body.teamSize || 10),
        stage: body.stage || 'Seed Stage',
        yearsOperating: Number(body.yearsOperating || 2),
        previousProjects: body.previousProjects || 'Prototype Pilot',
        certifications: body.certifications || 'DIPP Recognized',
        complianceStatus: body.complianceStatus || 'Fully Compliant',
        fundingInfo: body.fundingInfo || 'Bootstrapped',
        solutionDescription: body.solutionDescription,
        contactEmail: body.contactEmail || 'contact@startup.io',
      },
    });

    // Also run AI match for any existing open challenges
    const openChallenges = await prisma.challenge.findMany({
      where: { status: { in: ['OPEN', 'MATCHED', 'EVALUATING', 'PILOT_ACTIVE'] } },
    });

    const { calculateStartupMatch } = await import('@/lib/ai-matching');

    for (const ch of openChallenges) {
      const match = calculateStartupMatch(
        {
          domain: ch.domain,
          requiredTechnologies: ch.requiredTechnologies,
          eligibilityRequirements: ch.eligibilityRequirements,
          location: ch.location,
        },
        {
          domain: startup.domain,
          technologies: startup.technologies,
          certifications: startup.certifications,
          yearsOperating: startup.yearsOperating,
          complianceStatus: startup.complianceStatus,
          previousProjects: startup.previousProjects,
          stage: startup.stage,
          location: startup.location,
        }
      );

      await prisma.matchScore.create({
        data: {
          challengeId: ch.id,
          startupId: startup.id,
          totalScore: match.totalScore,
          domainScore: match.domainScore,
          techScore: match.techScore,
          eligibilityScore: match.eligibilityScore,
          experienceScore: match.experienceScore,
          locationStageScore: match.locationStageScore,
          matchedSkills: JSON.stringify(match.matchedSkills),
          missingSkills: JSON.stringify(match.missingSkills),
          whyExplanation: match.whyExplanation,
          eligibilityStatus: match.eligibilityStatus,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: 'startup-new',
        userName: startup.name,
        userRole: 'STARTUP',
        action: 'STARTUP_REGISTERED',
        details: `Registered new startup profile: ${startup.name} (${startup.domain})`,
      },
    });

    return NextResponse.json({ success: true, startup });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

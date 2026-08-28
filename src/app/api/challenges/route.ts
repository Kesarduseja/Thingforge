import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateStartupMatch } from '@/lib/ai-matching';

export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      include: {
        matches: {
          include: {
            startup: true,
          },
          orderBy: {
            totalScore: 'desc',
          },
        },
        pilots: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(challenges);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      problemDescription,
      departmentName,
      domain,
      requiredTechnologies,
      budgetRange,
      location,
      eligibilityRequirements,
      expectedOutcomes,
      pilotDuration,
      kpis,
      userName = 'Government Official',
      userRole = 'GOVERNMENT',
    } = body;

    const challenge = await prisma.challenge.create({
      data: {
        title,
        problemDescription,
        departmentName: departmentName || 'Urban Development Dept',
        domain,
        requiredTechnologies,
        budgetRange,
        location,
        eligibilityRequirements: eligibilityRequirements || 'DIPP Recognized, 2+ Yrs Operating',
        expectedOutcomes,
        pilotDuration: pilotDuration || '60 Days',
        kpis: kpis || 'Baseline vs Target measurement',
        status: 'OPEN',
      },
    });

    // Automatically trigger AI Matching against all existing startups!
    const startups = await prisma.startup.findMany();
    const matchPromises = startups.map((st) => {
      const match = calculateStartupMatch(
        {
          domain: challenge.domain,
          requiredTechnologies: challenge.requiredTechnologies,
          eligibilityRequirements: challenge.eligibilityRequirements,
          location: challenge.location,
        },
        {
          domain: st.domain,
          technologies: st.technologies,
          certifications: st.certifications,
          yearsOperating: st.yearsOperating,
          complianceStatus: st.complianceStatus,
          previousProjects: st.previousProjects,
          stage: st.stage,
          location: st.location,
        }
      );

      return prisma.matchScore.create({
        data: {
          challengeId: challenge.id,
          startupId: st.id,
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
    });

    await Promise.all(matchPromises);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: 'gov-user-1',
        userName,
        userRole,
        action: 'CHALLENGE_CREATED',
        details: `Created new challenge: ${challenge.title} (Auto-matched with ${startups.length} startups)`,
      },
    });

    return NextResponse.json({ success: true, challenge });
  } catch (error: any) {
    console.error('Challenge POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export interface MatchResult {
  totalScore: number;
  domainScore: number;
  techScore: number;
  eligibilityScore: number;
  experienceScore: number;
  locationStageScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  whyExplanation: string;
  eligibilityStatus: 'ELIGIBLE' | 'NEEDS_VERIFICATION' | 'NOT_ELIGIBLE';
}

export function calculateStartupMatch(
  challenge: {
    domain: string;
    requiredTechnologies: string;
    eligibilityRequirements: string;
    location: string;
  },
  startup: {
    domain: string;
    technologies: string;
    certifications: string;
    yearsOperating: number;
    complianceStatus: string;
    previousProjects: string;
    stage: string;
    location: string;
  }
): MatchResult {
  // Parse lists
  const reqTechList = challenge.requiredTechnologies
    .toLowerCase()
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const startupTechList = startup.technologies
    .toLowerCase()
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // 1. Domain Match (25 Points)
  let domainScore = 0;
  const challengeDomain = challenge.domain.toLowerCase();
  const startupDomain = startup.domain.toLowerCase();

  if (startupDomain === challengeDomain) {
    domainScore = 25;
  } else if (
    challengeDomain.includes(startupDomain) ||
    startupDomain.includes(challengeDomain) ||
    (challengeDomain.includes('urban') && startupDomain.includes('waste')) ||
    (challengeDomain.includes('waste') && startupDomain.includes('smart city'))
  ) {
    domainScore = 20;
  } else if (startupDomain.includes('iot') || startupDomain.includes('ai') || startupDomain.includes('cleantech')) {
    domainScore = 14;
  } else {
    domainScore = 8;
  }

  // 2. Technology Match (25 Points)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  reqTechList.forEach((reqTech) => {
    const isMatched = startupTechList.some(
      (stTech) => stTech.includes(reqTech) || reqTech.includes(stTech)
    );
    if (isMatched) {
      matchedSkills.push(reqTech);
    } else {
      missingSkills.push(reqTech);
    }
  });

  const techMatchRatio = reqTechList.length > 0 ? matchedSkills.length / reqTechList.length : 1;
  const techScore = Math.round(techMatchRatio * 25);

  // 3. Eligibility Criteria (20 Points)
  let eligibilityScore = 0;

  // DIPP / ISO Certifications (8 pts)
  if (startup.certifications.toLowerCase().includes('dipp') || startup.certifications.toLowerCase().includes('iso')) {
    eligibilityScore += 8;
  } else if (startup.certifications.length > 0) {
    eligibilityScore += 5;
  }

  // Years operating (6 pts)
  if (startup.yearsOperating >= 3) {
    eligibilityScore += 6;
  } else if (startup.yearsOperating >= 1) {
    eligibilityScore += 4;
  } else {
    eligibilityScore += 2;
  }

  // Compliance Status (6 pts)
  if (startup.complianceStatus.toLowerCase().includes('fully') || startup.complianceStatus.toLowerCase().includes('verified')) {
    eligibilityScore += 6;
  } else {
    eligibilityScore += 3;
  }

  // 4. Experience Relevance (15 Points)
  let experienceScore = 0;
  const prevProjects = startup.previousProjects.toLowerCase();
  if (prevProjects.includes('municipal') || prevProjects.includes('govt') || prevProjects.includes('government') || prevProjects.includes('smart city')) {
    experienceScore = 15;
  } else if (prevProjects.includes('pilot') || prevProjects.includes('enterprise') || prevProjects.includes('commercial')) {
    experienceScore = 11;
  } else {
    experienceScore = 6;
  }

  // 5. Stage & Location Fit (15 Points)
  let locationStageScore = 0;

  // Stage (8 pts)
  const stage = startup.stage.toLowerCase();
  if (stage.includes('growth') || stage.includes('scaled') || stage.includes('series')) {
    locationStageScore += 8;
  } else if (stage.includes('seed') || stage.includes('early')) {
    locationStageScore += 6;
  } else {
    locationStageScore += 4;
  }

  // Location / Geographic suitability (7 pts)
  if (
    challenge.location.toLowerCase().includes('pan india') ||
    startup.location.toLowerCase() === challenge.location.toLowerCase() ||
    startup.location.toLowerCase().includes('maharashtra')
  ) {
    locationStageScore += 7;
  } else {
    locationStageScore += 4;
  }

  // Total calculated score (0 - 100)
  const totalScore = Math.min(100, Math.max(0, domainScore + techScore + eligibilityScore + experienceScore + locationStageScore));

  // Determine eligibility status
  let eligibilityStatus: 'ELIGIBLE' | 'NEEDS_VERIFICATION' | 'NOT_ELIGIBLE' = 'ELIGIBLE';
  if (totalScore < 55 || missingSkills.length > 2) {
    eligibilityStatus = 'NOT_ELIGIBLE';
  } else if (totalScore < 75 || missingSkills.length > 0) {
    eligibilityStatus = 'NEEDS_VERIFICATION';
  }

  // Generate transparent "WHY" explanation for judge review
  const whyLines: string[] = [];

  // Domain explanation
  if (domainScore >= 20) {
    whyLines.push(`✓ Strong Domain Compatibility: Startup operates directly in ${startup.domain}.`);
  } else {
    whyLines.push(`⚠ Partial Domain Match: Primary domain is ${startup.domain}, adjacent to requirement.`);
  }

  // Tech overlap explanation
  if (matchedSkills.length > 0) {
    whyLines.push(`✓ Technology Overlap (${matchedSkills.length}/${reqTechList.length}): Matched [${matchedSkills.join(', ')}].`);
  }
  if (missingSkills.length > 0) {
    whyLines.push(`⚠ Missing Technology Stack: Startup currently lacks documented experience in [${missingSkills.join(', ')}].`);
  }

  // Experience explanation
  if (experienceScore === 15) {
    whyLines.push(`✓ Government Experience: Proven track record with municipal/government sector deployments.`);
  } else {
    whyLines.push(`⚠ Limited Public Sector Experience: Prior projects concentrated in private enterprise sector.`);
  }

  // Eligibility & compliance
  if (eligibilityScore >= 16) {
    whyLines.push(`✓ Complete Statutory Eligibility: Fully verified compliance, DIPP recognized, ${startup.yearsOperating} years operating.`);
  } else {
    whyLines.push(`⚠ Statutory Checklist Needs Verification: Certifications or compliance documents require manual audit.`);
  }

  // Stage & capacity
  whyLines.push(`✓ Operational Stage Fit: Startup is at ${startup.stage} stage with adequate capacity for pilot execution.`);

  return {
    totalScore,
    domainScore,
    techScore,
    eligibilityScore,
    experienceScore,
    locationStageScore,
    matchedSkills,
    missingSkills,
    whyExplanation: whyLines.join('\n'),
    eligibilityStatus,
  };
}

export interface KPIData {
  achievementPct: number;
  status: string;
}

export interface MilestoneData {
  status: string;
}

export function calculatePilotSuccess(
  kpis: KPIData[],
  milestones: MilestoneData[],
  qualityScore: number = 90
): {
  score: number;
  status: 'HIGHLY SUCCESSFUL' | 'SUCCESSFUL' | 'PARTIALLY SUCCESSFUL' | 'UNSUCCESSFUL';
  explanation: string[];
} {
  // 1. KPI Achievement (50%)
  let kpiAvg = 0;
  if (kpis.length > 0) {
    const sum = kpis.reduce((acc, k) => acc + Math.min(150, k.achievementPct), 0);
    kpiAvg = Math.min(100, Math.round(sum / kpis.length));
  } else {
    kpiAvg = 80;
  }

  // 2. Milestone Completion (30%)
  let milestoneRate = 0;
  if (milestones.length > 0) {
    const completed = milestones.filter((m) => m.status === 'COMPLETED').length;
    milestoneRate = Math.round((completed / milestones.length) * 100);
  } else {
    milestoneRate = 75;
  }

  // 3. Quality & Implementation (20%)
  const quality = Math.min(100, Math.max(0, qualityScore));

  const totalScore = Math.round(kpiAvg * 0.5 + milestoneRate * 0.3 + quality * 0.2);

  let status: 'HIGHLY SUCCESSFUL' | 'SUCCESSFUL' | 'PARTIALLY SUCCESSFUL' | 'UNSUCCESSFUL' = 'HIGHLY SUCCESSFUL';
  if (totalScore >= 85) {
    status = 'HIGHLY SUCCESSFUL';
  } else if (totalScore >= 70) {
    status = 'SUCCESSFUL';
  } else if (totalScore >= 50) {
    status = 'PARTIALLY SUCCESSFUL';
  } else {
    status = 'UNSUCCESSFUL';
  }

  const explanation = [
    `✓ KPI Target Achievement Rate: ${kpiAvg}% (Weight 50%)`,
    `✓ Milestone Execution Rate: ${milestoneRate}% completion across pilot roadmap (Weight 30%)`,
    `✓ Field Quality & User Satisfaction Rating: ${quality}/100 (Weight 20%)`,
  ];

  return {
    score: totalScore,
    status,
    explanation,
  };
}

export function calculateProcurementReadiness(
  pilotSuccessScore: number,
  isComplianceVerified: boolean,
  isDocComplete: boolean,
  scalabilityRating: number = 90,
  costFeasibility: number = 88
): {
  score: number;
  status: 'READY FOR REVIEW' | 'NEEDS IMPROVEMENT';
  blockers: string[];
  explanation: string[];
} {
  const blockers: string[] = [];

  if (!isComplianceVerified) {
    blockers.push('⚠ Missing compliance document: DIPP statutory re-validation pending');
  }
  if (!isDocComplete) {
    blockers.push('⚠ Documentation incomplete: Final financial breakdown audit report required');
  }
  if (pilotSuccessScore < 75) {
    blockers.push('⚠ Pilot outcome below target threshold: KPI score must exceed 75%');
  }

  // Scoring composition:
  // Pilot Success (40%)
  // Compliance (20%)
  // Documentation (15%)
  // Scalability (15%)
  // Cost Feasibility (10%)

  const complianceScore = isComplianceVerified ? 100 : 40;
  const docScore = isDocComplete ? 100 : 50;

  const totalScore = Math.round(
    pilotSuccessScore * 0.4 +
    complianceScore * 0.2 +
    docScore * 0.15 +
    scalabilityRating * 0.15 +
    costFeasibility * 0.1
  );

  const status = totalScore >= 85 && blockers.length === 0 ? 'READY FOR REVIEW' : 'NEEDS IMPROVEMENT';

  const explanation = [
    `• Pilot Performance Contribution: ${Math.round(pilotSuccessScore * 0.4)} / 40 pts`,
    `• Statutory Compliance Verification: ${Math.round(complianceScore * 0.2)} / 20 pts`,
    `• Audit Documentation Completeness: ${Math.round(docScore * 0.15)} / 15 pts`,
    `• Cross-Municipal Scalability Readiness: ${Math.round(scalabilityRating * 0.15)} / 15 pts`,
    `• Cost & Commercial Feasibility Score: ${Math.round(costFeasibility * 0.1)} / 10 pts`,
  ];

  return {
    score: totalScore,
    status,
    blockers,
    explanation,
  };
}

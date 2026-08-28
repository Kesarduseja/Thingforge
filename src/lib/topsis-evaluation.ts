export interface ExpertScoreInput {
  technicalFeasibility: number;  // Max 25
  innovation: number;            // Max 20
  costEffectiveness: number;     // Max 15
  scalability: number;           // Max 15
  publicImpact: number;          // Max 15
  implementationReadiness: number; // Max 10
  comments: string;
}

export function computeEvaluationTotal(input: ExpertScoreInput): number {
  const tf = Math.min(25, Math.max(0, input.technicalFeasibility || 0));
  const inn = Math.min(20, Math.max(0, input.innovation || 0));
  const ce = Math.min(15, Math.max(0, input.costEffectiveness || 0));
  const sc = Math.min(15, Math.max(0, input.scalability || 0));
  const pi = Math.min(15, Math.max(0, input.publicImpact || 0));
  const ir = Math.min(10, Math.max(0, input.implementationReadiness || 0));

  return tf + inn + ce + sc + pi + ir;
}

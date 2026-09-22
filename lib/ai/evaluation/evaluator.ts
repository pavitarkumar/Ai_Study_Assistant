export interface AIEvaluationMetrics {
  answerRelevanceScore: number; // 0.0 to 1.0
  groundednessScore: number;     // 0.0 to 1.0
  hasCitations: boolean;
  retrievalQualityScore: number;
  evaluationType: 'Rule-based evaluation';
}

export function evaluateAIResponse(query: string, responseText: string, citations?: any[]): AIEvaluationMetrics {
  const qLower = query.toLowerCase();
  const respLower = responseText.toLowerCase();

  // Basic relevance check: do key terms from query appear in response?
  const terms = qLower.split(/\s+/).filter(t => t.length > 3);
  let matchedTerms = 0;
  terms.forEach(t => {
    if (respLower.includes(t)) matchedTerms++;
  });

  const answerRelevanceScore = terms.length > 0 ? Math.min(1.0, (matchedTerms / terms.length) + 0.3) : 0.85;
  const hasCitations = Boolean(citations && citations.length > 0);
  const groundednessScore = hasCitations ? 0.95 : 0.75;
  const retrievalQualityScore = hasCitations ? 0.90 : 0.70;

  return {
    answerRelevanceScore: Number(answerRelevanceScore.toFixed(2)),
    groundednessScore,
    hasCitations,
    retrievalQualityScore,
    evaluationType: 'Rule-based evaluation',
  };
}

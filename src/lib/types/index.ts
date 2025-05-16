// Core types for headline analysis
export interface Criterion {
  id: 1 | 2 | 3;
  name: string;
  description: string;
}

export interface CriterionResult {
  criterionId: 1 | 2 | 3;
  passed: boolean;
  explanation: string;
}

export interface HeadlineAnalysis {
  isRelevant: boolean;
  originalHeadline: string;
  score: 0 | 1 | 2 | 3;
  criteriaResults: CriterionResult[];
  improvedHeadline: string;
  changes: {
    criterionId: 1 | 2 | 3;
    explanation: string;
  }[];
}

// Service types
export interface AnalysisRequest {
  headline: string;
  articleBody: string;
}

export interface AnalysisResponse {
  analysis: HeadlineAnalysis;
}

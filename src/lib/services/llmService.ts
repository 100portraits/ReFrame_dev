import type { AnalysisRequest, AnalysisResponse, HeadlineAnalysis, CriterionResult } from '$lib/types';
import generatePrompt from './prompt'; // Renamed to avoid conflict with prompt variable

// Environment variable for API key
const VITE_OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

/**
 * Calculate the score based on criteria results following a tiered system.
 */
function calculateScore(results: CriterionResult[]): 0 | 1 | 2 | 3 {
  if (!results || results.length === 0) return 0;

  const criterion1 = results.find(r => r.criterionId === 1);
  if (!criterion1 || !criterion1.passed) return 0;

  const criterion2 = results.find(r => r.criterionId === 2);
  if (!criterion2 || !criterion2.passed) return 1;

  const criterion3 = results.find(r => r.criterionId === 3);
  if (!criterion3 || !criterion3.passed) return 2;

  return 3;
}

interface LLMResponseStructure {
  analysis: {
    isRelevant: boolean;
    originalHeadline?: string; // LLM might not return this, we use the request's
    criteriaResults: CriterionResult[];
    improvedHeadline: string;
    changes: Array<{
      criterionId: 1 | 2 | 3;
      explanation: string;
    }>;
  };
}

/**
 * Analyzes a headline and article body by calling the OpenRouter API.
 */
export async function analyzeHeadline(request: AnalysisRequest): Promise<AnalysisResponse> {
  const promptContent = generatePrompt(request.headline, request.articleBody);

  if (!VITE_OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is not set. Please set VITE_OPENROUTER_API_KEY environment variable.');
    // Fallback to a specific error response or the mock for local development without key
    return {
      analysis: {
        isRelevant: false,
        originalHeadline: request.headline,
        score: 0,
        criteriaResults: [
          { criterionId: 1, passed: false, explanation: "API key not configured." },
          { criterionId: 2, passed: false, explanation: "API key not configured." },
          { criterionId: 3, passed: false, explanation: "API key not configured." },
        ],
        improvedHeadline: "Error: API key not configured.",
        changes: [],
      }
    };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${VITE_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://reframe-dev.pages.dev", 
        "X-Title": "ReFrame" 
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1", 
        messages: [
          {
            role: "user",
            content: promptContent
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('API Error:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const llmOutputContent = data.choices?.[0]?.message?.content;

    if (!llmOutputContent) {
      console.error('Invalid LLM response structure:', data);
      throw new Error('Failed to parse LLM response or content is missing.');
    }

    // The LLM is expected to return a JSON string, so parse it.
    const parsedLlmResponse: LLMResponseStructure = JSON.parse(llmOutputContent);
    const llmAnalysis = parsedLlmResponse.analysis;

    const finalAnalysis: HeadlineAnalysis = {
      isRelevant: llmAnalysis.isRelevant,
      originalHeadline: request.headline, // Use original from request
      criteriaResults: llmAnalysis.criteriaResults || [],
      score: calculateScore(llmAnalysis.criteriaResults || []),
      improvedHeadline: llmAnalysis.improvedHeadline || (llmAnalysis.isRelevant ? "Could not generate improved headline." : ""),
      changes: llmAnalysis.changes || []
    };

    return {
      analysis: finalAnalysis
    };

  } catch (error) {
    console.error('Error analyzing headline:', error);
    let errorMessage = "An error occurred during analysis.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Return a comprehensive error response for the UI
    return {
      analysis: {
        isRelevant: false, // Or true if some parts worked but others failed
        originalHeadline: request.headline,
        score: 0,
        criteriaResults: [
          { criterionId: 1, passed: false, explanation: errorMessage },
          { criterionId: 2, passed: false, explanation: "Evaluation stopped due to error." },
          { criterionId: 3, passed: false, explanation: "Evaluation stopped due to error." },
        ],
        improvedHeadline: "Error during analysis. Please try again.",
        changes: []
      }
    };
  }
}


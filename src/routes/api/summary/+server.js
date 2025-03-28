// Import Firebase client SDK
import { db, collection, getDocs } from '$lib/firebase';
import { json } from '@sveltejs/kit';

/**
 * GET handler for survey results summary
 * This runs server-side but uses the client SDK
 */
export async function GET() {
  try {
    // Get all survey responses using client SDK
    const surveyCollection = collection(db, 'surveyResponses');
    const snapshot = await getDocs(surveyCollection);
    
    // Process data for visualization
    const responses = [];
    snapshot.forEach((doc) => {
      responses.push(doc.data());
    });
    
    // Calculate statistics
    const rewrittenResponses = responses.filter(r => r.isRewritten);
    const originalResponses = responses.filter(r => !r.isRewritten);
    
    const stats = {
      totalResponses: responses.length,
      rewrittenCount: rewrittenResponses.length,
      originalCount: originalResponses.length,
      questionStats: []
    };
    
    // Process each question's statistics
    for (let i = 1; i <= 5; i++) {
      const questionStat = {
        questionId: i,
        rewrittenAvg: calculateAverage(rewrittenResponses, i),
        originalAvg: calculateAverage(originalResponses, i),
        rewrittenDistribution: calculateDistribution(rewrittenResponses, i),
        originalDistribution: calculateDistribution(originalResponses, i)
      };
      
      stats.questionStats.push(questionStat);
    }
    
    return json(stats);
  } catch (error) {
    console.error('Error fetching survey results:', error);
    return json({ error: 'Server error' }, { status: 500 });
  }
}

function calculateAverage(responses, questionId) {
  if (responses.length === 0) return 0;
  
  let sum = 0;
  let count = 0;
  
  responses.forEach(response => {
    const answer = response.responses.find(r => r.questionId === questionId)?.answer;
    if (answer !== undefined && answer !== null) {
      sum += answer;
      count++;
    }
  });
  
  return count > 0 ? (sum / count) : 0;
}

function calculateDistribution(responses, questionId) {
  const distribution = [0, 0, 0, 0, 0]; // For 5 Likert scale options
  
  responses.forEach(response => {
    const answer = response.responses.find(r => r.questionId === questionId)?.answer;
    if (answer !== undefined && answer !== null && answer >= 0 && answer < 5) {
      distribution[answer]++;
    }
  });
  
  return distribution;
} 
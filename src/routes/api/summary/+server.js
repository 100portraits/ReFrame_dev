// Import Firestore REST API endpoint
import { firestoreBaseUrl, addApiKey } from '$lib/firebase';
import { json } from '@sveltejs/kit';

/**
 * GET handler for survey results summary
 * This uses direct Firestore REST API calls instead of Firebase SDK
 */
export async function GET({ fetch }) {
  try {
    // Use Firestore REST API to fetch all survey responses with API key
    const response = await fetch(addApiKey(`${firestoreBaseUrl}/surveyResponses`));
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Firestore API error:', errorData);
      return json({ error: 'Failed to fetch data from database' }, { status: 500 });
    }
    
    const data = await response.json();
    
    // Process data from Firestore format to our application format
    const responses = [];
    
    if (data.documents && Array.isArray(data.documents)) {
      for (const doc of data.documents) {
        // Convert from Firestore format to our application format
        const fields = doc.fields;
        const response = {};
        
        // Convert all fields
        for (const [key, value] of Object.entries(fields)) {
          if (key === 'responses') {
            // Handle responses array
            response.responses = value.arrayValue.values.map(item => {
              const fields = item.mapValue.fields;
              return {
                questionId: parseInt(fields.questionId.integerValue),
                questionText: fields.questionText.stringValue,
                answer: parseInt(fields.answer.integerValue)
              };
            });
          } else if (value.integerValue !== undefined) {
            response[key] = parseInt(value.integerValue);
          } else if (value.booleanValue !== undefined) {
            response[key] = value.booleanValue;
          } else if (value.stringValue !== undefined) {
            response[key] = value.stringValue;
          }
        }
        
        responses.push(response);
      }
    }
    
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
    return json({ error: 'Server error: ' + error.message }, { status: 500 });
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
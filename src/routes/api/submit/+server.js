// Import client Firebase SDK
import { collection, addDoc } from 'firebase/firestore';
import { db } from '$lib/server/firebase-admin';
import { json } from '@sveltejs/kit';

/**
 * POST handler for survey submission
 * This runs server-side for better security
 */
export async function POST({ request }) {
  try {
    // Parse the request body
    const surveyData = await request.json();
    console.log('Received survey data:', surveyData);

    // Validate required fields
    const requiredFields = {
      sessionId: 'string',
      articleId: 'number',
      articleTitle: 'string',
      articleContent: 'string',
      articleDate: 'string',
      articleWordCount: 'number',
      isRewritten: 'boolean',
      timestamp: 'string',
      responses: 'array'
    };

    // Check all required fields exist and have correct types
    for (const [field, type] of Object.entries(requiredFields)) {
      if (!surveyData.hasOwnProperty(field)) {
        return json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 });
      }
      
      if (type === 'array' && !Array.isArray(surveyData[field])) {
        return json({ 
          error: `Field ${field} must be an array` 
        }, { status: 400 });
      } else if (type === 'number' && (typeof surveyData[field] !== 'number' || isNaN(surveyData[field]))) {
        return json({ 
          error: `Field ${field} must be a valid number` 
        }, { status: 400 });
      } else if (type === 'boolean' && typeof surveyData[field] !== 'boolean') {
        return json({ 
          error: `Field ${field} must be a boolean` 
        }, { status: 400 });
      } else if (type !== 'array' && type !== 'number' && type !== 'boolean' && typeof surveyData[field] !== type) {
        return json({ 
          error: `Field ${field} must be of type ${type}` 
        }, { status: 400 });
      }
    }

    // Validate responses
    if (surveyData.responses.length !== 5) {
      return json({ 
        error: 'Invalid data: exactly 5 question responses required' 
      }, { status: 400 });
    }

    // Validate each response
    for (const response of surveyData.responses) {
      if (!response.questionId || 
          !response.questionText ||
          typeof response.answer !== 'number' ||
          response.answer < 0 || 
          response.answer > 4) {
        return json({ 
          error: `Invalid response format for question ${response.questionId || 'unknown'}` 
        }, { status: 400 });
      }
    }

    // Add server timestamp
    surveyData.serverTimestamp = new Date().toISOString();
    
    // Add the document to Firestore using client SDK
    const surveyCollection = collection(db, 'surveyResponses');
    const docRef = await addDoc(surveyCollection, surveyData);
    
    // Return success response with document ID
    return json({ 
      success: true, 
      documentId: docRef.id 
    });
  } catch (error) {
    console.error('Error submitting survey:', error);
    return json({ 
      error: 'Server error: ' + error.message 
    }, { status: 500 });
  }
} 
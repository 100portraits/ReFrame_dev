// Import Firestore REST API endpoint
import { firestoreBaseUrl, addApiKey } from '$lib/firebase';
import { json } from '@sveltejs/kit';

/**
 * POST handler for survey submission
 * This uses direct Firestore REST API calls instead of Firebase SDK
 */
export async function POST({ request, fetch }) {
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
    
    // Convert the data to Firestore format (each field needs a type)
    const firestoreData = {};
    
    // Convert flat fields
    for (const [key, value] of Object.entries(surveyData)) {
      if (key !== 'responses') {
        if (typeof value === 'string') {
          firestoreData[key] = { stringValue: value };
        } else if (typeof value === 'number') {
          firestoreData[key] = { integerValue: value };
        } else if (typeof value === 'boolean') {
          firestoreData[key] = { booleanValue: value };
        }
      }
    }
    
    // Convert responses array
    firestoreData.responses = {
      arrayValue: {
        values: surveyData.responses.map(response => ({
          mapValue: {
            fields: {
              questionId: { integerValue: response.questionId },
              questionText: { stringValue: response.questionText },
              answer: { integerValue: response.answer }
            }
          }
        }))
      }
    };
    
    // The payload for Firestore REST API
    const payload = {
      fields: firestoreData
    };
    
    // Make the request to Firestore REST API with API key
    const response = await fetch(addApiKey(`${firestoreBaseUrl}/surveyResponses`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Firestore API error:', errorData);
      return json({ error: 'Failed to save to database' }, { status: 500 });
    }
    
    const responseData = await response.json();
    
    // Extract the document ID from the response name
    // The name format is: projects/{project_id}/databases/(default)/documents/surveyResponses/{document_id}
    const documentPath = responseData.name;
    const documentId = documentPath.split('/').pop();
    
    // Return success response with document ID
    return json({ 
      success: true, 
      documentId: documentId
    });
  } catch (error) {
    console.error('Error submitting survey:', error);
    return json({ 
      error: 'Server error: ' + error.message 
    }, { status: 500 });
  }
} 
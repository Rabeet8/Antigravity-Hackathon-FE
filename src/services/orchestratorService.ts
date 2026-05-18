import { BASE_URL } from '../config/api.config';

/**
 * Service to call the Kaam Karo Orchestrator Backend API
 */
export const runOrchestrator = async (userMessage: string) => {
  try {
    const response = await fetch(`${BASE_URL}/orchestrate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('[OrchestratorService] runOrchestrator error:', error);
    throw error;
  }
};

/**
 * Service to retrieve mock and active booking history
 */
export const getBookingHistory = async () => {
  try {
    const response = await fetch(`${BASE_URL}/bookings/history`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[OrchestratorService] getBookingHistory error:', error);
    throw error;
  }
};

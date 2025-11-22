// Google Sheets service for form submissions
export interface FormSubmissionData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Submit form data to Google Sheets
 * @param formData - The form data to submit
 * @returns Promise with success/error response
 */
export const submitToGoogleSheets = async (formData: FormSubmissionData) => {
  try {
    const response = await fetch(`${API_URL}/api/submit-to-sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        submittedAt: formData.submittedAt || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to submit form');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    throw error;
  }
};
// The service now only supports Google Sheets submissions.

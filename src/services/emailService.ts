// Email service for sending form submissions
import { getApiUrl } from "@/config/email";

export interface FormSubmissionData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt?: string;
}

/**
 * Sends form submission details to owner via email
 * @param formData - The form data to send
 * @returns Promise with success/error response
 */
export const sendFormSubmissionEmail = async (formData: FormSubmissionData) => {
  try {
    const apiUrl = getApiUrl();
    
    const response = await fetch(`${apiUrl}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        submittedAt: new Date().toISOString(),
        type: "form_submission",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send email");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending form submission email:", error);
    throw error;
  }
};

/**
 * Sends a test email to verify configuration
 * @param testEmail - Email to send test to
 * @returns Promise with success/error response
 */
export const sendTestEmail = async (testEmail: string) => {
  try {
    const apiUrl = getApiUrl();
    
    const response = await fetch(`${apiUrl}/api/send-test-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ testEmail }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send test email");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending test email:", error);
    throw error;
  }
};

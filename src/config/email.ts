// Email configuration service
// This file centralizes all email-related configuration

interface EmailConfig {
  ownerEmail: string;
  senderEmail: string;
  senderName: string;
}

// Get config from environment variables
export const getEmailConfig = (): EmailConfig => {
  return {
    ownerEmail: import.meta.env.VITE_OWNER_EMAIL || process.env.OWNER_EMAIL || "owner@unveiledecho.com",
    senderEmail: import.meta.env.VITE_SMTP_USER || process.env.SMTP_USER || "noreply@unveiledecho.com",
    senderName: "Unveiled Echo - Clinic Form Submission",
  };
};

export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || "http://localhost:3001";
};

// Backend server for handling email submissions
// Setup instructions:
// 1. Install dependencies: npm install express nodemailer cors dotenv
// 2. Create .env file with SMTP credentials
// 3. Run: node server.js

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const createTransporter = () => {
  // Using environment variables for security
  const smtpConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // Validate configuration
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.");
  }

  return nodemailer.createTransport(smtpConfig);
};

// Email template for form submission
const getFormSubmissionEmailTemplate = (data) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0ea5e9; color: white; padding: 20px; border-radius: 5px; }
          .content { margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #0ea5e9; }
          .value { margin-top: 5px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Form Submission - Unveiled Echo</h1>
          </div>
          
          <div class="content">
            <h2>Client Details</h2>
            
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${escapeHtml(data.name)}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
            </div>
            
            ${data.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${escapeHtml(data.phone)}</div>
            </div>
            ` : ""}
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${escapeHtml(data.message).replace(/\n/g, "<br>")}</div>
            </div>
            
            <div class="field">
              <div class="label">Submitted At:</div>
              <div class="value">${new Date(data.submittedAt).toLocaleString()}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated email from Unveiled Echo clinic form submission system.</p>
            <p>Please reply directly to the client's email address to respond to their inquiry.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to escape HTML
const escapeHtml = (text) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// API Endpoint: Send form submission email
app.post("/api/send-email", async (req, res) => {
  try {
    const { name, email, phone, message, submittedAt } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ownerEmail = process.env.OWNER_EMAIL || "owner@unveiledecho.com";
    const senderEmail = process.env.SMTP_USER || "noreply@unveiledecho.com";

    const transporter = createTransporter();

    // Email to owner
    const ownerEmailContent = {
      from: senderEmail,
      to: ownerEmail,
      subject: `New Form Submission from ${name} - Unveiled Echo`,
      html: getFormSubmissionEmailTemplate({
        name,
        email,
        phone,
        message,
        submittedAt: submittedAt || new Date().toISOString(),
      }),
      replyTo: email,
    };

    // Send email to owner
    await transporter.sendMail(ownerEmailContent);

    console.log(`Email sent successfully from ${email} to ${ownerEmail}`);

    res.json({
      success: true,
      message: "Form submission email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "Failed to send email",
      message: error.message,
    });
  }
});

// API Endpoint: Send test email
app.post("/api/send-test-email", async (req, res) => {
  try {
    const { testEmail } = req.body;

    if (!testEmail) {
      return res.status(400).json({ error: "Test email address required" });
    }

    const senderEmail = process.env.SMTP_USER || "noreply@unveiledecho.com";
    const transporter = createTransporter();

    const testEmailContent = {
      from: senderEmail,
      to: testEmail,
      subject: "Unveiled Echo - Email Configuration Test",
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .success { background-color: #10b981; color: white; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">
                <h1>✓ Email Configuration Successful!</h1>
                <p>Your email service is properly configured and working.</p>
                <p>You can now start receiving form submissions from your clinic website.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(testEmailContent);

    console.log(`Test email sent to ${testEmail}`);

    res.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({
      error: "Failed to send test email",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Email server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
  console.log(`Make sure to configure environment variables in .env file`);
});

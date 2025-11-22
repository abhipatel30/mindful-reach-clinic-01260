// Minimal email server for sending form submissions
// This server handles SMTP connections securely
// Setup: npm install express nodemailer cors dotenv
// Run: node server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['POST', 'GET'],
  credentials: true,
}));
app.use(express.json());

// The server no longer handles sending emails. It only provides a Sheets endpoint and a health check.

// HTML escape helper
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email server is running' });
});

// Health check (existing)

// Submit to Google Sheets
app.post('/api/submit-to-sheets', async (req, res) => {
  try {
    const { name, email, phone, message, submittedAt } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
      console.error('ERROR: Google Sheets credentials not configured');
      return res.status(500).json({ error: 'Google Sheets credentials not configured' });
    }

    const jwt = new google.auth.JWT(clientEmail, null, (privateKey || '').replace(/\\n/g, '\n'), [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);

    try {
      await jwt.authorize();
    } catch (authErr) {
      console.error('✗ Google JWT authorization failed:', authErr && authErr.message ? authErr.message : authErr);
      return res.status(500).json({ error: 'Google Sheets authorization failed', message: authErr && authErr.message ? authErr.message : String(authErr) });
    }

    const sheets = google.sheets({ version: 'v4', auth: jwt });
    const values = [[submittedAt || new Date().toISOString(), name, email, phone || '', message]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log(`✓ Appended row to Google Sheet ${sheetId} for ${email}`);

    res.json({ success: true, message: 'Submitted to Google Sheets' });
  } catch (error) {
    console.error('✗ Error submitting to Google Sheets:', error && error.message ? error.message : error);
    res.status(500).json({ error: 'Failed to submit to Google Sheets', message: error && error.message ? error.message : String(error) });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log('📧 Email Server Started Successfully');
  console.log(`${'='.repeat(50)}`);
  console.log(`Port: ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  console.log(`SMTP User: ${process.env.SMTP_USER ? '✓ Configured' : '✗ NOT SET'}`);
  console.log(`Owner Email: ${process.env.OWNER_EMAIL || 'owner@unveiledecho.com'}`);
  console.log(`${'='.repeat(50)}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Email server shutting down gracefully...');
  process.exit(0);
});

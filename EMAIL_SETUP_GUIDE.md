# Email Service Setup Guide

This guide explains how to set up the email service for form submissions in Unveiled Echo clinic.

## Architecture

The email system consists of:
1. **Frontend** (`src/services/emailService.ts`) - Sends form data to backend
2. **Backend** (`server.js`) - Node.js/Express server that handles email sending
3. **Configuration** (`src/config/email.ts`) - Centralized config management
4. **Environment Variables** (`.env`) - Secure credential storage

## Setup Instructions

### Step 1: Install Backend Dependencies

```bash
npm install express nodemailer cors dotenv
```

### Step 2: Create Environment File

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# Frontend
VITE_API_URL=http://localhost:3001
VITE_OWNER_EMAIL=owner@unveiledecho.com
VITE_SMTP_USER=your-email@gmail.com

# Backend
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
OWNER_EMAIL=owner@unveiledecho.com
PORT=3001
```

### Step 3: Gmail Setup (if using Gmail)

For Gmail, you need to use an "App Password":

1. Go to [Google Account Security Settings](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. Go back to Security settings
4. Find "App passwords" at the bottom
5. Select "Mail" and "Windows Computer"
6. Google will generate a 16-character password
7. Copy this password and use it as `SMTP_PASS` in your `.env` file

### Step 4: Run Backend Server

In a separate terminal:

```bash
node server.js
```

You should see:
```
Email server running on port 3001
```

### Step 5: Run Frontend (in another terminal)

```bash
npm run dev
```

### Step 6: Test the Setup

1. Open the website in browser (http://localhost:5173)
2. Fill out the contact form
3. Submit the form
4. Check that:
   - Email arrives at the OWNER_EMAIL address
   - Form resets after submission
   - Success message appears

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend URL for frontend API calls | `http://localhost:3001` |
| `VITE_OWNER_EMAIL` | Owner email (frontend config) | `owner@unveiledecho.com` |
| `VITE_SMTP_USER` | Email sender (frontend config) | `your-email@gmail.com` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP authentication email | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP authentication password | `xxxx xxxx xxxx xxxx` |
| `SMTP_SECURE` | Use TLS (false for 587, true for 465) | `false` |
| `OWNER_EMAIL` | Email to receive submissions | `owner@unveiledecho.com` |
| `PORT` | Backend server port | `3001` |

## Changing Email Later

To change the owner email address:

1. Update the `OWNER_EMAIL` variable in `.env` file
2. Restart the backend server
3. New submissions will go to the new email address
## Supported Email Providers
### Gmail
- Host: `smtp.gmail.com`
- Port: `587`
- Secure: `false`
- Auth: Use App Password (not regular password)
### Outlook/Office 365
- Host: `smtp.office365.com`
- Port: `587`

- Secure: `false`
- Auth: Your email and password
### Custom SMTP
- Update `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` accordingly
## Troubleshooting
### "SMTP credentials not configured"
- Make sure `.env` file exists in root directory
- Verify `SMTP_USER` and `SMTP_PASS` are set
### "Failed to send email"
- Check SMTP credentials
- Verify email provider allows the connection
- Check firewall settings
- Try adding `SMTP_SECURE=true` and using port `465`
### "Connection timeout"
- Verify SMTP host is correct
- Check internet connection
- Verify firewall isn't blocking port 587 or 465
### Gmail shows "Less secure app access"
- Gmail no longer supports less secure apps
- Use "App Passwords" instead (see Step 3 above)
## Production Deployment
When deploying to production:
1. Use a production email service (SendGrid, Mailgun, AWS SES, etc.)
2. Update `.env` with production SMTP credentials
3. Set `VITE_API_URL` to your production backend URL
4. Deploy backend to a production server
5. Use environment variables on production platform
### Example Production Setup with SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
SMTP_SECURE=false
```

## File Structure
```
mindful-reach-clinic-01260/
├── server.js                          # Backend email server
├── .env.example                       # Example environment file
├── .env                              # Actual credentials (don't commit!)
├── src/
│   ├── config/
│   │   └── email.ts                  # Email configuration
│   ├── services/
│   │   └── emailService.ts           # Frontend email service
│   └── components/
│       └── ContactForm.tsx           # Updated form component
```
## API Endpoints
### POST /api/send-email
Sends form submission email to owner
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I would like to book a session",
  "submittedAt": "2025-11-19T10:30:00Z"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Form submission email sent successfully"
}
```

### POST /api/send-test-email
Sends a test email to verify configuration

**Request:**
```json
{
  "testEmail": "admin@example.com"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully to admin@example.com"
}
```
### GET /api/health
Health check endpoint
**Response:**
```json
{
  "status": "ok",
  "message": "Email server is running"
}
```
## Security Considerations
1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use environment variables** - Don't hardcode credentials

3. **Use App Passwords** - For Gmail, use generated app password, not your actual password
4. **Enable CORS carefully** - In production, restrict to your domain
5. **Rate limiting** - Consider adding rate limiting to prevent abuse
6. **Input validation** - Always validate form data on both frontend and backend
## Support
For issues or questions:
1. Check the troubleshooting section
2. Review backend server logs
3. Test SMTP credentials with a tool like Telnet or an SMTP testing service



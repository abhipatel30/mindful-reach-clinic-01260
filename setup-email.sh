#!/bin/bash
# Quick setup script for email service

echo "🚀 Unveiled Echo - Email Service Setup"
echo "======================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your SMTP credentials."
else
    echo "✅ .env file already exists."
fi

echo ""
echo "📦 Installing backend dependencies..."
npm install express nodemailer cors dotenv

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your email credentials"
echo "2. Run the backend: node server.js"
echo "3. In another terminal, run the frontend: npm run dev"
echo ""
echo "📧 For Gmail users:"
echo "   - Generate an App Password at: https://myaccount.google.com/apppasswords"
echo "   - Use the 16-character password as SMTP_PASS"
echo ""
echo "📖 For detailed instructions, see: EMAIL_SETUP_GUIDE.md"

#!/bin/bash

# --- Open CyberRisk Control Center (OCCC) Installer ---
# This script automates the setup of the OCCC environment.

echo "🛡️ Starting Open CyberRisk Control Center Setup..."

# 1. Check for Dependencies
echo "🔍 Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install it first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed."
    exit 1
fi

# 2. Install NPM Packages
echo "📦 Installing project dependencies..."
npm install --silent

# 3. Setup Environment Variables
if [ ! -f .env ]; then
    echo "⚙️ Creating default .env file..."
    cat <<EOF > .env
MONGO_URI=mongodb://localhost:27017/ccc_system
JWT_SECRET=cyber-risk-secret-$(date +%s)
PORT=3000
EOF
    echo "✅ .env created. (Note: Adjust MONGO_URI if using Atlas)"
else
    echo "ℹ️ .env already exists, skipping creation."
fi

# 4. Success Message
echo ""
echo "✨ Setup Complete!"
echo "------------------------------------------------"
echo "To start the server, run: npm start"
echo "Then visit: http://localhost:3000"
echo "------------------------------------------------"
echo "Admin Default credentials (first run):"
echo "Email: admin@occc.local"
echo "Password: OpenCyberRisk2026!"
echo "⚠️  Change the password after your first login!"
echo "------------------------------------------------"

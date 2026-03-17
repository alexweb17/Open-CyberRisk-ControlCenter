# 🛡️ CyberRisk Control Center (CCC)

![CyberRisk Control Center](imagenes/logoCCC.png)

## Overview
CyberRisk Control Center (CCC) is a comprehensive, open-source platform designed to streamline cybersecurity risk management, regulatory compliance, and governance. Built for security managers, engineers, and administrators, it provides a centralized dashboard to track risks, manage controls, and ensure alignment with global security standards.

## 🚀 Key Features
- **Project Tracking**: Modern, minimalist cards to visualize security project progress.
- **Consultorías de Ciberseguridad (RCS)**: Simplified risk control self-assessments.
- **Regulatory Frameworks Library**: Integrated repository for ISO/IEC 27001, NIST CSF, PCI DSS, SOC 2, and OWASP ASVS.
- **Governance Dashboard**: Real-time KRI (Key Risk Indicators) monitoring and strategic objective alignment.
- **Role-Based Access Control (RBAC)**: Secure access tiers for Admin, Security Manager, and Engineer roles.
- **Self-Service Security**: Users can manage their own profiles and passwords with encrypted storage.

## 🛠️ Tech Stack
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism design), and JavaScript.
- **Backend**: Node.js & Express.
- **Database**: MongoDB (Atlas/Local) with Mongoose.
- **Security**: JWT Authentication, Bcrypt password hashing.

## 📦 Quick Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas connection string)
- [Git](https://git-scm.com/)

### One-Step Setup (Linux/macOS)
Run the following command in your terminal:
```bash
bash install.sh
```

### Manual Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/alexweb17/CyberRiskControlCenter.git
   cd CyberRiskControlCenter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file based on the provided variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   PORT=3000
   ```

4. **Run the application:**
   ```bash
   npm start
   ```
   Access the UI at `http://localhost:3000`.

## 📜 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👤 Author
**alexweb17** - *Design & Implementation*

---
*Developed with focus on efficiency and security excellence.*

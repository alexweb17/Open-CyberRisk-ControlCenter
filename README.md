# Open CyberRisk Control Center (CCC)

![CyberRisk Control Center Logo](imagenes/logoCCC.png)

Open CyberRisk Control Center is a comprehensive, open-source platform designed to manage cybersecurity risks, regulatory compliance, and governance. Built with a modern tech stack (Node.js, Express, MongoDB, and Vanilla JS/CSS), it provides a premium user experience for security managers, engineers, and auditors.

## Key Features

- **Risk Inventory (RCS):** Manage and track Risk Control Self-assessments with integrated regulatory frameworks.
- **Regulatory Framework Library:** Browse and search standard requirements (ISO 27001, NIST CSF, PCI DSS, etc.) in Spanish.
- **Governance Dashboard:** Track Strategic Objectives and Key Risk Indicators (KRIs).
- **Business Process Management:** Evaluate risks and calculate financial exposure (FAIR-lite).
- **Executive Reports:** High-level visualization of risk posture and compliance trends.
- **Role-Based Access Control (RBAC):** Modern local authentication with Admin, Security Manager, and Engineer roles.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Frontend:** Vanilla JavaScript (ES6+), Vanilla CSS (Glassmorphism & Modern UI)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **Documentation:** Markdown

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Cloud instance)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alexweb17/Open-CyberRisk-ControlCenter.git
   cd Open-CyberRisk-ControlCenter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Initialze your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and provide your `MONGO_URI` and a secure `JWT_SECRET`.

4. **Seed the Database:**
   To populate the regulatory frameworks (ISO 27001, NIST, etc.):
   ```bash
   node scripts/seed_frameworks.js
   node scripts/seed_iso27001.js
   # Run other seed scripts as needed
   ```

5. **Start the application:**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by **alexweb17**. 

---
*Open-source tool for resilient organizations.*

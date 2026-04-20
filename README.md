# MyPortfolio404 - Amine Nouioui

Welcome to my premium developer portfolio repository! This workspace contains my master `portfolio.html` website, as well as **6 complete, production-ready full-stack applications** demonstrating my expertise in modern web development across various business domains (E-commerce, SaaS, BI, CRM, Real Estate).

All apps are built using the **React.js + Node.js/Express + MySQL** stack, emphasizing scalable architecture, secure authentication (JWT), and extremely refined UX/UI design.

## 🚀 Projects Included

### 1. ShopFlow (E-Commerce Platform)
- **Features:** Full online store, Stripe payment gateway integration, product inventory management.
- **Tech Highlights:** React, Node.js, Stripe, Context API, Tailwind CSS.

### 2. ShiftPro (Scheduling SaaS)
- **Features:** Staff scheduling software with interactive calendar interfaces, shift swapping, and labor cost analytics.
- **Tech Highlights:** React, Node.js, FullCalendar, Chart.js, Role-Based Access Control (RBAC).

### 3. LegalVault (Document Management SaaS)
- **Features:** Secure PDF document management system tailored for law firms, complete with audit logs and e-signatures.
- **Tech Highlights:** React, Node.js, Multer (secure file upload), Express file streaming.

### 4. TrackrBI (Business Intelligence Dashboard)
- **Features:** Advanced BI dashboard capable of parsing user-uploaded CSV matrices entirely in the browser and projecting dynamic Recharts components.
- **Tech Highlights:** React, Node.js, PapaParse, Recharts, Custom Analytics Engine.

### 5. MarketFlow (CRM / Pipeline SaaS)
- **Features:** Client Relationship Management tool featuring a drag-and-drop lead pipeline (Kanban board) and marketing campaign budgeting trackers.
- **Tech Highlights:** React, Node.js, HTML5 Drag & Drop API, Express.

### 6. PropHunt (Luxury Real Estate Web App)
- **Features:** High-end real estate marketplace with dynamic property indexing, smart filtering, and a minimalist elegant interface.
- **Tech Highlights:** React, Node.js, MySQL, Playfair Display typography.

---

## 🛠 Setup & Installation

I have included a Windows batch script to make setting up the repository effortless.

### Prerequisites:
- **Node.js** (v18+)
- **MySQL Server** (running locally on port 3306)
- **Git**

### Step 1: Initialize Databases
Each project has a `backend/seed.sql` file. You must execute these files in your MySQL client to create the tables (`shopflow`, `shiftpro`, `legalvault`, `trackrbi`, `marketflow`, `prophunt`) and generate the mock data.

### Step 2: Install All Dependencies
Simply run the included batch script to recursively `npm install` across all 12 directories (6 frontends, 6 backends):
```bash
./setup.bat
```

### Step 3: Run the Development Servers
Navigate into any project's folder, open two terminals, and run:
`npm run dev` in the `backend/` folder.
`npm run dev` in the `frontend/` folder.

*(Note: Ensure you configure your `.env` files in each backend if your database uses a password).*

## 🌍 Getting in Touch
- **Name:** Mohamed Amine Nouioui
- **Role:** Full Stack Developer & BI Analyst
- **Location:** Tunis, Tunisia (Available for remote work worldwide)
- **Email:** aminenouioul18@icloud.com
- **Phone / WhatsApp:** +216 53236163

**Open `portfolio.html` in your browser to view the master presentation site.**

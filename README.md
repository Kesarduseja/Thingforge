# PRAMAN — Evidence-Based Innovation Procurement Mechanism

**Smart India Hackathon 2026 (SIH26136)**  
**Theme:** Smart Governance  
**Team:** ThinkForge  

---

## Executive Overview

**PRAMAN** is a working proof-of-concept prototype for a startup-friendly public procurement mechanism. It enables government departments to identify, pilot, evaluate, procure, and scale innovative solutions from eligible startups with full auditability, transparency, and human-in-the-loop governance.

### Core USPs Demonstrated in Prototype:
1. **End-to-End Workflow**: Challenge Creation &rarr; AI Matching &rarr; Statutory Eligibility &rarr; Expert Evaluation &rarr; Pilot Workspace &rarr; KPI Outcome Tracking &rarr; Readiness Score &rarr; Human Procurement Decision &rarr; Scale & Reuse.
2. **Explainable AI Matching Algorithm**: Multi-factor scoring (0–100%) evaluating domain compatibility, tech overlap, eligibility rules, government experience, and operational stage. Provides transparent "WHY" explanations.
3. **Transparent TOPSIS-Inspired Expert Evaluation**: Multi-criteria weighted scoring matrix across 6 criteria totaling 100 points.
4. **Pilot & KPI Evidence Engine**: Real-time tracking of baseline vs target vs actual outcomes with auto-calculated **Pilot Success Score** (0-100) and **Procurement Readiness Score** (0-100).
5. **Human-in-the-Loop Safeguard**: Clear display that AI output is recommendation-only; final decision authorization remains strictly with human reviewers.
6. **Cross-Department Solution Scale & Reuse**: Automated discovery matching pilot-verified solutions to cities with identical requirements (e.g., Waste Monitoring &rarr; BMC Mumbai, PMC Pune, NMC Nagpur).
7. **Immutable Audit Trail**: Log of all actions with user role, timestamp, and details.

---

## 5–7 Minute Live SIH Presentation Demo Flow

Follow this exact flow during the live screening presentation:

1. **Overview & Role Switcher**:
   - Open [http://localhost:3000](http://localhost:3000).
   - Show top navigation banner featuring live Role Switcher (`Government`, `Startup`, `Expert Evaluator`, `Decision Authority`, `Admin`) and **Reset Demo Dataset** button.

2. **Module 1 & Primary Scenario (Government Department)**:
   - Click `🏛️ Government Dept` role.
   - View primary challenge: *"AI-Enabled Solid Waste Collection Optimization System"* created by Urban Development & Municipal Affairs Dept.
   - Show how a government official creates a challenge via `/challenges/new`.

3. **Modules 3 & 4 (AI Matching & Eligibility Screening)**:
   - Navigate to `/challenges/[id]`.
   - Inspect top match: **EcoSmart Waste Tech (92% Match Score)**.
   - Click **"Explain WHY"** to demonstrate itemized algorithm breakdown (✓ Strong domain fit, ✓ Required IoT/AI stack matched, ✓ Complete DIPP statutory eligibility).
   - Review Module 4 Statutory Verification Checklist (DIPP Recognized, ISO 9001, 4 Yrs Operating, Fully Compliant).

4. **Module 5 (Expert Evaluation)**:
   - Switch role to `⚖️ Expert Evaluator`.
   - Open `/evaluations`.
   - Adjust sliders across 6 weighted criteria (Technical Feasibility 25%, Innovation 20%, Cost Effectiveness 15%, Scalability 15%, Social Impact 15%, Implementation Readiness 10%).
   - Submit score (Total: 93/100) and view updated candidate rank matrix.

5. **Modules 6 & 7 (Pilot Workspace & KPI Outcome Tracking)**:
   - Switch role to `🏛️ Government Dept`.
   - Open `/pilots/[id]`.
   - Review 4 Milestones roadmap (Phase 1 to Phase 4). Update Milestone status to `COMPLETED` and view live progress bar update.
   - Inspect KPI Table:
     - *Bin Overflow Response Time*: Baseline 45m &rarr; Target 15m &rarr; Actual 12m (**120% Achievement — PASS**).
     - *Collection Truck Fuel Saving*: Baseline 0% &rarr; Target 20% &rarr; Actual 28.5% (**142% Achievement — PASS**).

6. **Modules 8 & 9 (Pilot Success & Procurement Readiness Scores)**:
   - Scroll to score cards:
     - **Pilot Success Score**: `88/100 (HIGHLY SUCCESSFUL)`
     - **Procurement Readiness Score**: `92/100 (READY FOR REVIEW)`
   - Highlight **Human-in-the-loop safeguard notice**: *"AI recommendation only — Final procurement decision requires authorized human review."*

7. **Module 10 (Decision Authority Sign-Off)**:
   - Switch role to `👑 Decision Authority`.
   - Open `/decision`.
   - Review side-by-side executive dashboard (AI score, Expert score, Pilot score, Readiness score, KPI evidence, audit history).
   - Select **Proceed to Public Procurement**, enter justification note, and click **Sign & Authorize Final Decision**.

8. **Module 11 (Scale & Cross-Department Reuse)**:
   - Open `/reuse`.
   - Show automated recommendation extending solution to **Mumbai Municipal Corporation (BMC)**, **Pune Municipal Corporation (PMC)**, and **Nagpur Municipal Corporation (NMC)** with 96% similarity match.

9. **Module 12 (Admin Dashboard & Audit Trail)**:
   - Switch role to `🛡️ Admin`.
   - Open `/admin` to view RBAC demo accounts and tamper-evident audit trail logs.

---

## Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router), TypeScript, React 18, Tailwind CSS, Lucide Icons, Recharts.
- **Database & Data Layer**: SQLite (`prisma/dev.db`), Prisma ORM.
- **AI Matching Engine**: Explainable multi-factor scoring engine (`src/lib/ai-matching.ts`).
- **TOPSIS Scoring Engine**: Multi-criteria weighted ranking engine (`src/lib/topsis-evaluation.ts`).
- **Pilot Outcome Engine**: Success & readiness calculator (`src/lib/pilot-calculator.ts`).

---

## Demo Credentials & Role Switcher

No passwords required! Switch roles instantly using the top navigation bar:

| Role Name | Demo User Name | Primary Function |
| :--- | :--- | :--- |
| `🏛️ Government` | Rajesh Sharma (IAS) | Create Challenges & Monitor Field Pilots |
| `🚀 Startup` | Ananya Verma (CEO, EcoSmart) | Submit Solutions & Evidence Reports |
| `⚖️ Expert Evaluator` | Dr. Vikramaditya Roy (IIT Bombay) | Perform TOPSIS Weighted Scoring |
| `👑 Decision Authority` | P. K. Mishra (Procurement Director) | Final Procurement Authorization |
| `🛡️ Admin` | System Administrator | RBAC Management & System Audit Logs |

---

## Setup & Running Locally

### 1. Prerequisites
- Node.js v18+ (Tested on v24.12.0)
- npm v9+

### 2. Quick Run Steps

```bash
# Clone or open workspace directory
cd c:\Users\ADMIN\Desktop\SIH

# Install dependencies (already executed)
npm install

# Push database schema & seed primary demo scenario
npm run db:push
npm run db:seed

# Launch Next.js Development Server
npm run dev
```

The application will start at **`http://localhost:3000`**.

### 3. Resetting Demo Data
Click the **"Reset Demo Dataset"** 🔄 button in the top navigation header at any time to restore the database to the default pre-populated SIH primary scenario.

---

## Future Integrations Roadmap

1. **Statutory APIs**: Integration with GeM (Government e-Marketplace), Startup India API (DIPP verification), and MCA/GSTIN verification portals.
2. **Advanced NLP**: Fine-tuned BERT embeddings for automated RFP specification extraction.
3. **Smart Contracts / Blockchain**: Recording pilot milestones and final procurement decisions on public/permissioned ledger for immutable transparency.

---
*Created by Team ThinkForge for SIH 2026 Internal Screening.*

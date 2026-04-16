# REM Waste Booking Flow

A production-style waste booking flow built to simulate real-world user behavior, system constraints, and QA validation.

This project demonstrates:
- end-to-end product thinking  
- deterministic system design  
- QA-driven development  
- reliable automation  
- reproducible environments  

---

## 1. Overview

This application allows users to complete a full waste booking journey:

1. enter a postcode  
2. select or manually add an address  
3. choose waste type  
4. select a skip size  
5. review pricing  
6. confirm booking  

The system is designed to simulate real-world behavior including:

- API failures  
- retry logic  
- loading states  
- unavailable options  
- branching user journeys  

### Purpose

This project was built as part of a QA assessment to demonstrate:

- ability to design testable systems  
- handling of real-world edge cases  
- integration of manual and automated testing  
- validation of a product, not just implementation  

---

## 2. Product & Booking Flow

The booking flow is implemented as a structured, step-based journey to guide users through the process while enforcing validation and business rules.

---

### Step 1 — Postcode & Address

User enters a UK postcode and performs a lookup.

System behavior:

- returns address list (success)  
- shows empty state (no results)  
- shows error with retry  
- displays loading state for delayed responses  

User can:
- select an address  
- manually enter address if none is found  

---

### Step 2 — Waste Type Selection

User selects one of:

- General  
- Heavy  
- Plasterboard  

#### Plasterboard Flow

Requires an additional selection:

- bagged  
- sheeted  
- mixed  

User cannot continue without selecting an option.

---

### Step 3 — Skip Selection

Available skip sizes:

- 4-yard to 16-yard  

System applies rules:

- heavy waste → disables larger skips  
- plasterboard → disables additional options  

Disabled skips:
- are visually distinct  
- cannot be selected  

---

### Step 4 — Review & Confirmation

User reviews:

- postcode  
- address  
- waste type  
- plasterboard option (if applicable)  
- skip size  

#### Price Breakdown

- base price  
- VAT (20%)  
- total price  

---

### Booking Confirmation

- booking request sent to API  
- booking ID returned  
- success state displayed  

#### Safety Behavior

- double submission is prevented  
- confirm button is disabled during request  

---

## 3. Architecture

### High-Level Structure

User (Browser)
↓
React Frontend (apps/ui)
↓ HTTP
Express API (apps/api)
↓
Deterministic Data Layer

---

### Design Approach

The system is designed with a focus on:

- clear separation of concerns  
- deterministic behavior for testing  
- predictable system responses  
- simplicity over over-engineering  

---

### Frontend

Responsible for:

- rendering step-based flow  
- managing UI state  
- handling loading, error, and retry states  
- enforcing user input validation  
- displaying review and confirmation  

---

### Backend

Responsible for:

- exposing REST endpoints  
- applying business rules  
- controlling skip availability  
- simulating real-world scenarios:
  - latency  
  - failures  
  - retry behavior  
  - empty results  

---

### Data Strategy

The system uses deterministic in-memory data instead of external APIs.

This ensures:

- repeatable test results  
- stable automation  
- predictable QA validation  

---

## 4. Tech Stack

### Frontend
- React (TypeScript)
- Vite
- CSS (basic styling)

### Backend
- Node.js (TypeScript)
- Express

### Automation
- Playwright (TypeScript)
- Playwright Test Runner

### DevOps & Tooling
- Docker
- Docker Compose
- GitHub (version control)
- GitHub Actions (CI/CD)

### Data & API
- REST API
- In-memory deterministic data

---

## 5. Data & Scenarios

### Deterministic Data

The system uses predefined, deterministic data instead of external APIs.

This ensures:

- consistent behavior  
- reliable testing  
- stable automation  
- predictable outcomes  

---

### Controlled Scenarios

The following postcodes simulate specific system behaviors:

| Postcode | Scenario | Behavior |
|---------|--------|--------|
| SW1A 1AA | Happy path | Returns 12+ addresses |
| EC1A 1BB | Empty state | No addresses returned |
| M1 1AE | Loading state | Simulated delayed response |
| BS1 4DJ | Error + Retry | First request fails, retry succeeds |

---

### Skip Logic Rules

Business rules applied:

- minimum 8 skip sizes available  
- heavy waste disables at least 2 skip sizes  
- plasterboard disables additional skip sizes  
- disabled skips cannot be selected  

---

### Why Deterministic Data

Using controlled data instead of live APIs provides:

- repeatability for QA  
- stable automation execution  
- easier debugging  
- consistent validation for reviewers  


---

## 6. API

### Overview

The backend exposes a minimal REST API to support the booking flow.

All endpoints are deterministic and aligned with the assessment requirements.

---

### 6.1 Postcode Lookup

POST `/api/postcode/lookup`

Request:

```json
{
  "postcode": "SW1A 1AA"
}

6.2 Waste Types

POST /api/waste-types

Request:

{
  "heavyWaste": true,
  "plasterboard": false,
  "plasterboardOption": null
}

Response:

{
  "ok": true
}

6.3 Skip Options

GET /api/skips?postcode=SW1A1AA&heavyWaste=true

Response:

{
  "skips": [
    { "size": "4-yard", "price": 120, "disabled": false },
    { "size": "12-yard", "price": 260, "disabled": true }
  ]
}

6.4 Booking Confirmation

POST /api/booking/confirm

Request:

{
  "postcode": "SW1A 1AA",
  "addressId": "addr_1",
  "heavyWaste": true,
  "plasterboard": false,
  "skipSize": "4-yard",
  "price": 120
}

Response:

{
  "status": "success",
  "bookingId": "BK-12345"
}

---

## 7. QA & Testing

### Approach

The system is tested from a product perspective, focusing on real user behavior and system reliability.

Testing covers:

- functional flows  
- negative scenarios  
- edge cases  
- API failures  
- state transitions  
- branching logic  

---

### Manual Testing

Manual test coverage includes:

- 35+ test cases  
- 10+ negative scenarios  
- 6+ edge cases  
- 4+ API failure tests  
- 4+ state transition tests  

Detailed test cases are documented in:

manual-tests.md

---

### Bug Reporting

Identified issues are documented with:

- severity  
- priority  
- environment  
- reproduction steps  
- expected vs actual behavior  

At least one bug covers branching or state transition logic.

See:

bug-reports.md

---

### Validation Focus

Testing ensures:

- correct step transitions  
- enforcement of business rules  
- proper handling of disabled options  
- resilience under error and retry conditions  

---

---

## 8. Automation

### Overview

End-to-end automation is implemented using Playwright to validate critical user journeys.

---

### Covered Flows

- General waste booking flow  
- Heavy waste booking flow  

These represent both standard and restricted scenarios.

---

### Test Coverage

Automation validates:

- postcode lookup  
- address selection  
- waste type selection  
- skip selection  
- disabled skip behavior  
- review visibility  
- booking confirmation  

Each step includes assertions to ensure correctness.

---

### Test Files

Located in:

- automation/tests/booking-general.spec.ts  
- automation/tests/booking-heavy.spec.ts  

---

### Execution

Run locally:

```bash
cd automation
npm install
npx playwright install
npm test

Run with Docker:

docker compose --profile test run --rm automation

Reliability Strategy

To ensure stable execution:
	•	deterministic data is used
	•	no external dependencies
	•	predictable UI states
	•	controlled API responses

This minimizes flaky tests and ensures consistent results.


---

## 9. Running the Project

### Quick Start (Recommended)

Run the full application:

```bash
docker compose up --build

Open:

http://localhost:5173

Run automation:

docker compose --profile test run --rm automation


⸻

Local Setup

API

cd apps/api
npm install
npm run dev

Runs on:
http://localhost:3001


UI

cd apps/ui
npm install
npm run dev

Runs on:
http://localhost:5173

⸻

Automation

cd automation
npm install
npx playwright install
npm test

Why Docker

Docker is used to:
	•	simplify setup
	•	ensure environment consistency
	•	provide a single-command run experience
	•	make evaluation easier for reviewers


---

## 10. CI & Engineering Decisions

### Continuous Integration

A CI pipeline is implemented using GitHub Actions.

Location:
.github/workflows/ci.yml

Pipeline steps:

1. install dependencies  
2. start API and UI  
3. wait for application readiness  
4. run Playwright tests  

This ensures:

- automated validation on every push  
- early detection of regressions  
- consistent test execution  

---

### Engineering Decisions

#### Deterministic Data

- chosen for repeatability and stability  
- avoids flaky tests and external dependencies  

---

#### No Database

- simplifies setup  
- keeps focus on flow and testing  

---

#### Minimal UI Styling

- prioritizes functionality over design  
- reduces unnecessary complexity  

---

#### Docker-first Approach

- enables single-command execution  
- ensures consistent environments  

---

#### Automation Scope

- focuses on core flows  
- avoids over-engineering  

---

## Submission Checklist

This repository includes all required assessment components:

- README.md  
- manual-tests.md  
- bug-reports.md  
- automation/  
- apps/ui/  
- full source code  
- Docker setup  
- CI workflow  

---

## Final Summary

This project demonstrates:

- a complete end-to-end booking flow  
- realistic product behavior  
- strong QA thinking  
- deterministic system design  
- stable automation  
- reproducible environment  

It is designed to be:

- easy to run  
- easy to test  
- easy to evaluate  


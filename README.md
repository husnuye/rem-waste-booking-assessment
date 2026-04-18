# REM Waste Booking Flow

## Quick Run (Docker)

```bash
docker compose up --build
```

Open:

http://localhost:5173

---

A production-style waste booking flow demonstrating end-to-end product behaviour, QA validation, and automation.

Key Highlights

* 41 manual test cases
* 7 documented bugs with evidence
* Playwright automation
* deterministic API design
* Docker-based execution
 

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
- CSS (basic styling) aynı

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

The API is designed to:

- simulate real-world system behavior  
- provide predictable responses for testing  
- support UI and automation validation  

---

### 6.1 Postcode Lookup

**POST** `/api/postcode/lookup`

Request:

```json
{
  "postcode": "SW1A 1AA"
}
```

Response:

```json

{
  "postcode": "SW1A 1AA",
  "addresses": [
    {
      "id": "addr_1",
      "line1": "10 Downing Street",
      "city": "London"
    }
  ]
}
```

6.2 Waste Types

POST /api/waste-types

Request:

```json
{
  "heavyWaste": true,
  "plasterboard": false,
  "plasterboardOption": null
}
```
Response:

```json
{
  "ok": true
}
```

6.3 Skip Options

GET /api/skips

Query parameters:
	•	postcode (string)
	•	heavyWaste (boolean)

Example:

/api/skips?postcode=SW1A1AA&heavyWaste=true

Response:

```json
{
  "skips": [
    { "size": "4-yard", "price": 120, "disabled": false },
    { "size": "12-yard", "price": 260, "disabled": true }
  ]
}

```

6.4 Booking Confirmation

POST /api/booking/confirm

Request:

```json

{
  "postcode": "SW1A 1AA",
  "addressId": "addr_1",
  "heavyWaste": true,
  "plasterboard": false,
  "skipSize": "4-yard",
  "price": 120
}

```

Response:


```json

{
  "status": "success",
  "bookingId": "BK-12345"
}

```
⸻

Design Notes
	•	endpoints are intentionally simple
	•	responses are deterministic
	•	error scenarios are simulated (failure, retry, latency)
	•	API contract aligns with assessment requirements

This ensures consistent behavior for:
	•	frontend integration
	•	manual testing
	•	automated test execution




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


Manual testing was performed with a focus on real user behavior and system reliability.

Coverage includes:


- Total test cases: 41  
- Functional tests: 11  
- Negative tests: 12  
- Edge cases: 6  
- API tests: 4  
- State transition tests: 5  
- UI validation tests: 3  


Testing focused on:

- validation vs API error handling  
- correct step transitions  
- enforcement of business rules  
- handling of disabled options  
- retry and failure behavior  

All test cases are documented in:

manual-tests.md

---

### Bug Reporting

A total of **7 bugs** were identified during testing of the booking flow.

Each bug includes:

- severity  
- priority  
- environment  
- reproduction steps  
- expected vs actual behavior  
- evidence (screenshots and video)  
- fix description (where applicable)  

Key findings include:

- validation issues (invalid postcode handling)  
- duplicate retry behavior  
- state/branching issue (validation vs API errors)  
- UI feedback issues (error/success visibility and selection highlight)  
- missing price visibility  
- missing persistent booking confirmation  
- duplicate booking submissions (BUG-07)  

Two critical issues were identified:

- **BUG-03** — validation and API errors handled in the same state  
- **BUG-07** — duplicate bookings allowed from a single review state  

These issues directly impact:

- user flow correctness  
- system reliability  
- data integrity  

All bugs are documented in:

`bug-reports.md`


---

### Validation Focus

Testing ensures:

- correct step transitions  
- enforcement of business rules  
- proper handling of disabled options  
- resilience under error and retry conditions  


---

## 8. UI / UX Improvements


As part of the QA process, several usability and user experience improvements were identified and implemented.

### Improvements

- Added clear validation messages for invalid postcode input  
- Removed duplicate Retry action and simplified retry behavior  
- Improved visual feedback:
  - error messages displayed in red  
  - success messages displayed in green  
- Added selection highlighting for waste type and skip options  
- Improved price visibility in the review step  
- Added persistent booking confirmation message  

### Impact

These improvements:

- reduce user confusion  
- improve clarity of system state  
- increase user confidence during booking  
- create a more consistent and predictable user experience  

## Evidence

Supporting evidence for testing, UI validation, and bug analysis is included in the following locations:

- API contract and request/response structure → `docs/api-contract.md`  
- UI / UX evidence → `docs/ui-evidence.md`  
- Bug reports with screenshots and video → `docs/bug-reports.md`  
- Manual test coverage → `docs/manual-tests.md`  
- Media assets → `media/`  

The `media/` folder contains:

- desktop and mobile screenshots  
- validation and API error states  
- retry behavior  
- disabled skip visibility  
- price breakdown evidence  
- booking confirmation states  
- duplicate booking evidence (screenshots and video)  
- Lighthouse report  

All screenshots and media files are referenced directly within the documentation.


## 9. Automation

### Overview

End-to-end automation is implemented using Playwright to validate critical user journeys, ensuring functional correctness and system reliability.

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
```

Run with Docker:

```bash
docker compose --profile test run --rm automation
```

Reliability Strategy

To ensure stable execution:
	•	deterministic data is used
	•	no external dependencies
	•	predictable UI states
	•	controlled API responses

This minimizes flaky tests and ensures consistent results.


### Framework Structure

The automation framework follows a Page Object Model (POM) design.

Structure:

- pages/
  - basePage.ts (shared utilities)
  - bookingPage.ts (business-level actions and assertions)
- utils/
  - selectors.ts (centralized UI selectors)
  - testData.ts (deterministic test data)
- tests/
  - booking-general.spec.ts
  - booking-heavy.spec.ts

---

### Design Approach

The framework is designed to be:

- readable for junior engineers  
- maintainable for large-scale projects  
- aligned with real-world QA practices  

Key principles:

- Page Object Model for separation of concerns  
- centralized selectors to reduce duplication  
- deterministic test data for stability  
- business-level actions to simplify test logic  

---

### Assertion Strategy

Assertions are implemented at each step to validate:

- page transitions  
- business rules (e.g. disabled skips)  
- review data correctness  
- pricing calculations  
- booking success state  

This ensures both functional correctness and product-level validation.

---

### Why This Approach

This structure reflects real-world QA engineering practices, where tests must remain stable, readable, and scalable over time.

---

## 10. Running the Project

### Quick Start (Recommended)

Run the full application:


```bash
docker compose up --build

```

Open:

http://localhost:5173

Run automation:

```bash
docker compose --profile test run --rm automation

```

⸻

Local Setup

API

```bash
cd apps/api
npm install
npm run dev
```

Runs on:
http://localhost:3001

⸻

UI

```bash
cd apps/ui
npm install
npm run dev
```

Runs on:
http://localhost:5173

⸻

Automation

```bash
cd automation
npm install
npx playwright install
npm test
```
Why Docker

Docker is used to:
	•	simplify setup
	•	ensure environment consistency
	•	provide a single-command run experience
	•	make evaluation easier for reviewers

---

## 11. CI & Engineering Decisions

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
- docs/manual-tests.md  
- docs/bug-reports.md  
- docs/ui-evidence.md  
- docs/api-contract.md  
- apps/ui/ (frontend application)  
- apps/api/ (backend API)  
- automation/ (Playwright test suite)  
- media/ (screenshots and video evidence)  
- full source code  
- Docker setup (docker-compose)  
- CI workflow (GitHub Actions)  
---

## Final Summary

This project demonstrates a complete, end-to-end waste booking flow with a strong focus on product quality, reliability, and real-world behavior.

Key highlights include:

- a fully functional booking journey from postcode lookup to confirmation  
- realistic system behavior including failures, retry logic, and edge cases  
- deterministic data design for stable testing and reproducibility  
- comprehensive QA coverage across manual and automated testing  
- clear separation between validation, API errors, and system states  

A total of **7 bugs** were identified during testing, including:

- critical state management issues affecting user flow (BUG-03)  
- duplicate booking submissions impacting data integrity (BUG-07)  
- multiple UX and validation issues improving overall usability  

All bugs are documented with **clear reproduction steps and visual evidence**, including screenshots and video.

The project is supported by:

- structured documentation (manual tests, bug reports, UI evidence, API contract)  
- a stable automation framework using Playwright  
- Docker-based setup for easy execution  
- CI pipeline for continuous validation  

Overall, the system is designed to be:

- easy to run  
- easy to test  
- easy to evaluate  

while reflecting real-world QA engineering practices and product-level thinking.
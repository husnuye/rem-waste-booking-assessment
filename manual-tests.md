# Manual Test Cases — REM Waste Booking Flow

## Overview

This document provides manual test coverage for the waste booking flow.

Coverage includes:
- functional scenarios
- negative scenarios
- edge cases
- API failures
- state transitions

---

## Test Cases

| ID | Scenario | Steps | Expected Result | Type |
|----|--------|------|----------------|------|

### 1–10 Functional Tests

| TC-01 | Postcode lookup success | Enter SW1A 1AA → click lookup | Address list shown | Functional |
| TC-02 | Address selection | Select an address | Step 2 opens | Functional |
| TC-03 | General waste flow | Select General | Skip list loads | Functional |
| TC-04 | Heavy waste flow | Select Heavy | Skip list loads | Functional |
| TC-05 | Plasterboard flow | Select Plasterboard | Options shown | Functional |
| TC-06 | Plasterboard option select | Select “Bagged” | Continue enabled | Functional |
| TC-07 | Skip selection | Select valid skip | Review appears | Functional |
| TC-08 | Review data correct | Check review info | Data matches selections | Functional |
| TC-09 | Confirm booking | Click confirm | Booking success shown | Functional |
| TC-10 | Booking ID visible | Confirm booking | Booking ID displayed | Functional |

---

### 11–20 Negative Tests

| TC-11 | Empty postcode | Click lookup empty | Error or no action | Negative |
| TC-12 | Invalid postcode | Enter invalid | Error message shown | Negative |
| TC-13 | No address select | Skip address step | Cannot continue | Negative |
| TC-14 | No waste type | Skip selection | Cannot proceed | Negative |
| TC-15 | No skip selected | Try confirm | Button disabled | Negative |
| TC-16 | Plasterboard no option | Skip option | Cannot continue | Negative |
| TC-17 | Disabled skip click | Click disabled | No selection | Negative |
| TC-18 | API failure | BS1 4DJ first try | Error shown | Negative |
| TC-19 | Retry works | Click retry | Data loads | Negative |
| TC-20 | Double confirm click | Click confirm twice | Only one booking | Negative |

---

### 21–26 Edge Cases

| TC-21 | 12+ addresses list | SW1A 1AA | All addresses visible | Edge |
| TC-22 | Empty result | EC1A 1BB | Manual entry shown | Edge |
| TC-23 | Manual address entry | Add address | Address selectable | Edge |
| TC-24 | Delayed response | M1 1AE | Loading visible | Edge |
| TC-25 | Back navigation | Go back step | State preserved/reset correctly | Edge |
| TC-26 | Refresh page | Reload mid-flow | App resets safely | Edge |

---

### 27–30 API Failure Tests

| TC-27 | Postcode API fail | BS1 4DJ | Error message shown | API |
| TC-28 | Retry API success | Retry | Data returned | API |
| TC-29 | Skip API fail (simulate) | Break endpoint | Error handled | API |
| TC-30 | Booking API fail | Simulate failure | Error message shown | API |

---

### 31–35 State Transition Tests

| TC-31 | Step 1 → Step 2 | Select address | Move to waste step | State |
| TC-32 | Step 2 → Step 3 | Select waste | Move to skip step | State |
| TC-33 | Step 3 → Step 4 | Select skip | Move to review | State |
| TC-34 | Step 4 confirm | Confirm booking | Success state shown | State |
| TC-35 | Back navigation reset | Change waste type | Skip reset | State |

---

## Summary

- Total test cases: 35+
- Negative tests: 10+
- Edge cases: 6
- API tests: 4
- State transitions: 5

This ensures full coverage of the booking flow.
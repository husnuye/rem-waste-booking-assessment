# Bug Reports — REM Waste Booking Flow

## Bug Report Summary

A total of **7 bugs** were identified during testing of the booking flow.

Bugs are categorized and prioritised based on severity and impact on the user journey.

---

### Severity Distribution

- 🔴 High: 2  
- 🟡 Medium: 4  
- 🟢 Low: 1  

---

### High Severity Issues

| ID     | Title                                                                 | Reason |
|--------|----------------------------------------------------------------------|--------|
| BUG-03 | Validation and API errors handled in the same state                  | Breaks correct user flow and branching logic |
| BUG-07 | Multiple bookings can be created from a single review state          | Allows duplicate submissions and inconsistent system state |

---

### Medium Severity Issues

| ID     | Title                                                                 | Reason |
|--------|----------------------------------------------------------------------|--------|
| BUG-01 | Invalid postcode shows generic error                                 | Poor validation feedback |
| BUG-02 | Retry action duplicated existing Lookup behavior                     | Confusing UX and redundant action |
| BUG-05 | Price breakdown not clearly displayed                                | Affects user decision-making |
| BUG-06 | Booking confirmation not clearly visible                             | Reduces user confidence |

---

### Low Severity Issues

| ID     | Title                                                                 | Reason |
|--------|----------------------------------------------------------------------|--------|
| BUG-04 | UI feedback not clear across states and selections                   | Minor usability issue |

---

### Key Observations

- Critical issues were identified in **state management and submission handling**
- Validation and API errors required separation to ensure correct flow
- UX improvements significantly enhanced clarity and usability
- Duplicate booking issue highlights missing **submission control and idempotency**

---

This report prioritises issues that impact system reliability, data integrity, and user experience.


## Environment

- UI: http://localhost:5173  
- API: http://localhost:3001  
- Environment: Local development  

---

## BUG-01 — Invalid postcode shows generic error instead of validation message

**Type:** Functional / Validation  
**Severity:** Medium  
**Priority:** Medium  

---

### Description
When a user enters an invalid postcode (e.g. `ee`), the application displays a generic error instead of a clear validation message.

---

### Steps to Reproduce
1. Enter `B` in the postcode field  
2. Click `Lookup`  

---

### Expected Result
A validation message should be displayed:

Please enter a valid UK postcode

---

### Actual Result
A generic error message is displayed and a Retry button appears, even though the input is invalid.

### Evidence

![Invalid postcode with retry](../media/bug-01-invalid-postcode-generic-error.png)

Note: Entering an invalid postcode triggers a generic error and displays a Retry button, indicating incorrect validation handling.

![Validation error](../media/error-validation.png)

Note: Correct behaviour should display a validation message without triggering an error state or Retry option.

---

### Fix Applied
- Added client-side UK postcode validation  
- Prevented API call when input format is invalid  

---

### Status
Fixed  

---

## BUG-02 — Retry action duplicated existing Lookup behavior

**Type:** UI / UX  
**Severity:** Medium  
**Priority:** Medium  

---

### Description
A separate Retry button was implemented, duplicating the functionality of the existing Lookup button and adding unnecessary complexity.

---

### Steps to Reproduce
1. Enter postcode `BS1 4DJ`  
2. Click `Lookup`  
3. Observe error state  

---

### Expected Result
The user should retry the request using a single, consistent action (Lookup button).




### Evidence

![Retry shown on validation error](../media/bug-02-retry-shown-on-validation.png)

Note: Retry button is displayed during validation errors, duplicating the Lookup action and causing UX confusion.

![Retry shown](../media/bug-03-validation-triggers-api-error-state.png)

Note: Retry should only be available for API failures, not validation scenarios.

---

### Actual Result
A separate Retry button was displayed.

---

### Fix Applied
- Removed the Retry button  
- Standardized retry behavior using the existing `Lookup` button  

---

### Status
Fixed  

---

## BUG-03 — Validation and API errors were handled through the same state

**Type:** State / UX  
**Severity:** High  
**Priority:** High  

---

### Description
### Description
Validation errors and API errors were handled using the same UI state, causing incorrect user flows and behavior.  
This resulted in incorrect branching logic and inconsistent user experience.

---

### Steps to Reproduce
1. Enter an invalid postcode  
2. Click `Lookup`  

---

### Expected Result
- Validation error is shown  
- No API call is triggered  
- No retry or API error flow is activated  

---

### Actual Result
- UI entered generic error state  
- API error behavior was triggered incorrectly  


### Evidence
![State handling issue](../media/bug-02-retry-shown-on-validation.png)

Note: Validation errors incorrectly trigger the same UI state as API errors, indicating shared state handling.

![State issue](../media/bug-03-validation-triggers-api-error-state.png)

Note: Different error scenarios produce identical UI responses, confirming lack of separation between validation and API error states.
---

### Fix Applied
- Separated validation and API error handling  
- Introduced distinct UI states  
- Prevented API calls when validation fails  

---

### Status
Fixed  

---

## BUG-04 — UI feedback was not clear across states and selections

**Type:** UI / UX  
**Severity:** Low  
**Priority:** Low  

---

### Description
Visual feedback was not clear for system states and user selections, making it harder for users to understand both system status and their current choices.

---

### Steps to Reproduce
1. Select a waste type or skip  
2. Trigger an error  
3. Complete a booking  

---

### Expected Result
- Selected items are clearly highlighted  
- Error messages are styled (red)  
- Success message is styled (green)  

---

### Actual Result
- Selection was not clearly highlighted  
- Error and success messages lacked visual distinction  


### Evidence

![Error styling](../media/bug-04-selection-not-clear.png)

Note: Selection and UI feedback are not visually distinct, making it difficult for users to understand their current state.

![Success state](../media/ui-address-added.png)

Note: Improved success feedback demonstrates clearer user confirmation after actions.

![Selection highlight](../media/bug-04-selection-state.png)

Note: Selection states are not consistently highlighted, reducing clarity in user interaction.
---

### Fix Applied
- Added highlight for selected items  
- Styled error messages in red  
- Styled success message in green  

---

### Status
Fixed  

---

## BUG-05 — Price breakdown was not clearly displayed before confirmation

**Type:** Functional / UX  
**Severity:** Medium  
**Priority:** Medium  

---

### Description
The booking flow did not clearly display the selected skip price before confirmation.

---

### Steps to Reproduce
1. Complete booking flow to review screen  
2. Observe price visibility  

---

### Expected Result
User should clearly see:
- Skip size  
- Price  
- Total before confirmation  

---

### Actual Result
Price information was missing or unclear.


### Evidence

![Price visible](../media/bug-05-price-visibility.png)

Note: Pricing information is not clearly emphasised, making it harder for users to verify costs before confirmation.

![Empty address state](../media/ui-empty-address.png)

Note: Proper handling of empty states is shown, but price visibility remains insufficient in the flow.
---

### Fix Applied
- Added price display to the review section  
- Improved visibility of pricing  

---

### Status
Fixed  


---

## BUG-06 — Booking confirmation was not clearly visible in the UI

**Type:** UX / Functional  
**Severity:** Medium  
**Priority:** Medium  

---

### Description
After completing a booking, confirmation was only shown as a temporary toast message. This made it difficult for users to verify whether the booking was successfully completed.

---

### Steps to Reproduce
1. Complete the booking flow  
2. Click `Confirm Booking`  
3. Observe the confirmation feedback  

---

### Expected Result
- Booking confirmation should be clearly visible in the UI  
- A persistent success message should be displayed  
- Booking details (e.g. booking ID) should be visible  

---

### Actual Result
- Confirmation was only shown as a temporary toast message  
- No persistent success state was displayed  

---

### Evidence

![Booking confirmation toast](../media/bug-05-price-visibility.png)

Note: Confirmation feedback is not clearly separated from the main UI, reducing visibility of booking success.

![Booking success](../media/ui-address-added.png)

Note: Improved success feedback demonstrates a clearer and more persistent confirmation state.

### Fix Applied
- Added a persistent success message to the UI  
- Displayed booking confirmation clearly after completion  
- Improved user confidence and clarity  

---

### Status
Fixed  


### BUG-07 — Duplicate booking submission from review step

**Severity:** High  
**Priority:** High  
**Environment:** Local (Docker) — Chrome  

---

### Description

Users were able to trigger multiple booking submissions from the review step by clicking the **Confirm Booking** button multiple times.

This resulted in multiple booking IDs being generated for a single booking flow.

---

### Steps to Reproduce

1. Complete the booking flow until the review step  
2. Click **Confirm Booking**  
3. Immediately click **Confirm Booking** again  

---

### Expected Result

- Only one booking should be created  
- Confirm action should be disabled after submission  
- No additional booking IDs should be generated  

---

### Actual Result (Before Fix)

- Multiple booking requests were sent  
- Multiple booking IDs were generated  
- Confirm action remained active  

---

### Evidence

[▶ Watch duplicate booking video](../media/duplicate-booking.mp4)

![First booking](../media/duplicate-1.png)  
![Second booking](../media/duplicate-2.png)

**Note:** These screenshots and video show the behavior **before the fix was applied**.

At that time, the same booking configuration could be submitted multiple times, generating different booking IDs on each submission.

This demonstrated missing submission control and lack of idempotency in the booking process. The issue has now been resolved.

---

### Fix Applied

- Confirm action is now disabled after successful submission  
- Repeated submissions are blocked on the client side  
- Button state changes to **Booked** after success  

---

### Status

Fixed
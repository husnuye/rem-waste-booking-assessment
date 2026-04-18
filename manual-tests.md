# Manual Test Cases — REM Waste Booking Flow


## Overview

This document covers manual test scenarios for the REM Waste Booking Flow, including functional, negative, edge, API, state, and UI validation tests.

## Test Cases

| ID | Type | Scenario | Precondition | Test Data | Steps | Expected Result | Actual Result |
|----|------|----------|-------------|----------|-------|----------------|--------------|
| TC-01 | Functional | Look up a valid postcode | User is on the home screen | SW1A 1AA | Enter the postcode and click Lookup | The address list is displayed with 12 or more addresses | Pass |
| TC-02 | Functional | Select an address from the list | The address list is visible | - | Click an address | The waste type screen opens | Pass |
| TC-03 | Functional | Choose General waste | User is on the waste type screen | - | Click General | The skip selection screen opens | Pass |
| TC-04 | Functional | Choose Heavy waste | User is on the waste type screen | - | Click Heavy | The skip selection screen opens and disabled skip options are shown | Pass |
| TC-05 | Functional | Open plasterboard handling options | User is on the waste type screen | - | Click Plasterboard | The plasterboard handling options are displayed | Pass |
| TC-06 | Functional | Choose the Bagged plasterboard option | User selected Plasterboard and the handling options are visible | Bagged | Click Bagged | Bagged is selected and Continue becomes enabled | Pass |
| TC-07 | Functional | Choose the Sheeted plasterboard option | User selected Plasterboard and the handling options are visible | Sheeted | Click Sheeted | Sheeted is selected and Continue becomes enabled | Pass |
| TC-08 | Functional | Choose the Mixed plasterboard option | User selected Plasterboard and the handling options are visible | Mixed | Click Mixed | Mixed is selected and Continue becomes enabled | Pass |
| TC-09 | Functional | Select the 5-yard skip | User is on the skip selection screen | 5-yard | Click the 5-yard skip option | The review section appears and shows the selected 5-yard skip | Pass |
| TC-10 | Functional | Verify review details | The review section is visible | - | Check the postcode, address, waste type, handling option, and skip | All review details match the user selections | Pass |
| TC-11 | Functional | Confirm the booking | The review section is visible | - | Click Confirm Booking | A success message and booking ID are displayed | Pass |
| TC-12 | Negative | Try to look up with an empty postcode | User is on the home screen | Empty | Click Lookup without entering a postcode | The lookup should not proceed | Pass |
| TC-13 | Negative | Enter an invalid postcode format | User is on the home screen | INVALID | Enter an invalid postcode and click Lookup | An error message is displayed | Pass |
| TC-14 | Negative | Waste type screen should not open before address selection | User is on address list screen | - | Do not select any address | The waste type screen does not open | Pass |
| TC-15 | Negative | Try to continue without selecting a waste type | User is on the waste type screen | - | Do not select any waste type | The skip selection screen does not open | Pass |
| TC-16 | Negative | Try to continue without selecting a skip | User is on the skip selection screen | - | Do not select any skip | The review section does not appear | Pass |
| TC-17 | Negative | Try to proceed without selecting a plasterboard option | User selected Plasterboard and handling options are visible | - | Do not select Bagged, Sheeted, or Mixed | The skip selection screen does not open | Pass |
| TC-18 | Negative | Click a disabled skip option | User selected Heavy waste type and disabled skip options are visible | - | Click a disabled skip | The skip is not selected | Pass |
| TC-19 | Negative | Trigger postcode lookup error | User is on the home screen | BS1 4DJ | Enter the postcode and click Lookup | The message "Temporary server error. Please retry." is displayed | Pass |
| TC-20 | Negative | Retry after postcode lookup error | The error state is visible | BS1 4DJ | Click Lookup | The lookup runs again and data loads | Pass |
| TC-21 | Negative | Only one skip selection is allowed at a time | User is on the skip selection screen | - | Select one skip then select another skip | The first skip is deselected and only the second skip remains selected | Pass |
| TC-22 | Negative | Prevent duplicate booking submission | The review section is visible and booking has already been confirmed | - | Click Confirm Booking again without changing any data | A second booking should not be created and no new booking ID should be generated | Pass — Second booking was prevented and no additional booking ID was generated |
| TC-23 | Negative | Disable confirm action after successful booking | A booking has been completed successfully | - | Observe the Confirm Booking action after success | The confirm action should be disabled or should not allow another submission | Pass — Confirm action is disabled after success and repeated submission is not possible |
| TC-24 | Edge | Display a large address list | User is on the home screen | SW1A 1AA | Enter the postcode and click Lookup | A list of 12 or more addresses is displayed correctly | Pass |
| TC-25 | Edge | Display the empty address state | User is on the home screen | EC1A 1BB | Enter the postcode and click Lookup | No addresses are shown and manual address fields appear | Pass |
| TC-26 | Edge | Add a manual address after an empty result | The empty state is visible | EC1A 1BB, Test Street 1 / London | Enter a manual address and click Add address | The new address is added and becomes selectable | Pass |
| TC-27 | Edge | Show a loading state during delayed lookup | User is on the home screen | M1 1AE | Enter the postcode and click Lookup | A loading state is shown before the results appear | Pass |
| TC-28 | Edge | Navigate back from the skip selection screen | User is on the skip selection screen | - | Click Back | The user returns to the waste type screen | Pass |
| TC-29 | Edge | Reset safely after refreshing the page | User is mid-flow | - | Refresh the browser page | The application resets safely to the initial step | Pass |
| TC-30 | API | Handle postcode lookup API failure | User is on the home screen | BS1 4DJ | Enter the postcode and click Lookup | The UI shows an error state | Pass |
| TC-31 | API | Recover successfully after retrying postcode lookup | The error state is visible | BS1 4DJ | Click Lookup | The API returns data and the address list is shown | Pass |
| TC-32 | API | Handle skip list API failure | User is moving to the skip selection screen | Simulated failure | Select a waste type and attempt to load skip options | An error message is displayed and the skip list is not shown | Not tested |
| TC-33 | API | Handle booking API failure | User is on the review screen | Simulated failure | Click Confirm Booking | An error message is displayed and booking is not completed | Not tested |
| TC-34 | State | Move from Step 1 to Step 2 | User is on the home screen and addresses are visible | SW1A 1AA | Select an address | The waste type screen opens | Pass |
| TC-35 | State | Move from Step 2 to Step 3 | User is on the waste type screen | - | Select a waste type | The skip selection screen opens | Pass |
| TC-36 | State | Move from Step 3 to Review | User is on the skip selection screen | - | Select a skip | The review section appears | Pass |
| TC-37 | State | Move from Review to Success | The review section is visible | - | Click Confirm Booking | The success state appears | Pass |
| TC-38 | State | Reset skip selection when waste type changes | User has selected a waste type and a skip | - | Navigate back to waste type selection and choose a different waste type | The previous skip selection is cleared | Pass |
| TC-39 | UI | Show the success state clearly | A booking was completed successfully | - | Observe the success state | The success message is visible in a green confirmation container | Pass |
| TC-40 | UI | Highlight the selected waste type clearly | The waste type screen is visible | - | Select a waste type | The selected waste type is visually highlighted | Pass |
| TC-41 | UI | Highlight the selected skip clearly | The skip selection screen is visible | - | Select a skip | The selected skip is visually highlighted | Pass |


## Summary

- Total test cases: 41  
- Functional tests: 11  
- Negative tests: 12  
- Edge cases: 6  
- API tests: 4  
- State transition tests: 5  
- UI validation tests: 3  

This test suite provides comprehensive coverage of the waste booking flow, including:

- core functional user journeys  
- validation and negative scenarios  
- API failure and retry handling  
- state transitions across booking steps  
- UI feedback and usability validation  
- defect-driven scenarios (including duplicate booking behavior)  
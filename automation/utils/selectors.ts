/**
 * Central selector registry.
 *
 * This file contains all user-facing text used by the UI.
 *
 * Benefits:
 * - avoids duplicated strings across tests
 * - simplifies maintenance when UI labels change
 * - improves readability of page objects and tests
 *
 * Selectors are grouped by UI role for clarity.
 */
export const selectors = {
  // Page headings used for step/state validation
  headings: {
    home: "REM Waste Booking Flow",
    wasteType: "Select Waste Type",
    skip: "Select Skip",
  },

  // Button labels used for user actions
  buttons: {
    lookup: "Lookup",
    general: "General",
    heavy: "Heavy",
    plasterboard: "Plasterboard",

    // Regex used to allow flexible matching (e.g. loading states or variations)
    confirmBooking: /Confirm Booking/i,
  },

  // Visible text used for assertions
  text: {
    review: "Review",

    // Success state validation
    bookingSuccess: /Booking confirmed successfully/i,
    bookingId: /ID:/i,

    // Review / pricing validation
    priceBreakdown: /Price breakdown/i,
    postcode: /Postcode:/i,
    address: /Address:/i,
    wasteType: /Waste type:/i,
    skip: /Skip:/i,
    basePrice: /Base price:/i,
    vat: /VAT \(20%\):/i,
    total: /Total:/i,
  },

  // Input field identifiers
  placeholders: {
    postcode: "Enter postcode",
  },
};
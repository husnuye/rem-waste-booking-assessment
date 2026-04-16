/**
 * Deterministic test data used by automated flows.
 *
 * Purpose:
 * - ensure consistent and repeatable test results
 * - eliminate dependency on external or random data
 * - align with controlled fixture requirements in the assessment
 *
 * This approach reduces flakiness and makes failures easier to debug.
 */
export const testData = {
  // Predefined postcodes mapped to specific system behaviors
  postcodes: {
    happyPath: "SW1A 1AA",   // returns valid address list
    empty: "EC1A 1BB",       // returns no addresses
    delayed: "M1 1AE",       // simulates loading / latency
    retry: "BS1 4DJ",        // fails first, succeeds on retry
  },

  // Address selection using regex for flexible matching
  addresses: {
    primary: /10 Downing Street/i,
  },

  // Skip selections and business rule validation
  skips: {
    general: "4-yard - £120",

    // Enabled skip for heavy waste
    heavyEnabled: /10-yard - £240/i,

    // Disabled skips to validate business rules
    heavyDisabled12: /12-yard/i,
    heavyDisabled14: /14-yard/i,
  },

  // Pricing validation values
  // Strings are used to match UI output directly (including currency formatting)
  pricing: {
    general: {
      base: "£120",
      vat: "£24",
      total: "£144",
    },
    heavy: {
      base: "£240",
      vat: "£48",
      total: "£288",
    },
  },
};
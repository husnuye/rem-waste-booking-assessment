import { test } from "@playwright/test";
import { BookingPage } from "../pages/bookingPage";
import { testData } from "../utils/testData";

/**
 * Heavy waste booking flow
 *
 * This test validates a restricted business-rule journey:
 * - successful postcode lookup
 * - address selection
 * - heavy waste selection
 * - disabled skip enforcement
 * - valid skip selection
 * - review verification
 * - booking confirmation
 *
 * The goal is to verify that restricted options behave correctly
 * while the user can still complete a valid booking.
 */
test.describe("Booking Flow - Heavy Waste", () => {
  test("should complete the heavy booking flow and enforce disabled skip rules", async ({
    page,
  }) => {
    const bookingPage = new BookingPage(page);

    await test.step("Open home page and verify landing state", async () => {
      await bookingPage.openHomePage();
      await bookingPage.expectHomePageLoaded();
    });

    await test.step("Lookup postcode and verify deterministic address results", async () => {
      await bookingPage.enterPostcodeAndLookup(testData.postcodes.happyPath);
      await bookingPage.expectAddressVisible(testData.addresses.primary);
    });

    await test.step("Select address and verify transition to waste type step", async () => {
      await bookingPage.selectAddress(testData.addresses.primary);
      await bookingPage.expectWasteTypeStepLoaded();
    });

    await test.step("Select Heavy waste and verify transition to skip step", async () => {
      await bookingPage.selectWasteType("Heavy");
      await bookingPage.expectSkipStepLoaded();
    });

    await test.step("Verify heavy waste business rules disable restricted skip sizes", async () => {
      await bookingPage.expectSkipDisabled(testData.skips.heavyDisabled12);
      await bookingPage.expectSkipDisabled(testData.skips.heavyDisabled14);
    });

    await test.step("Select a valid enabled skip option for heavy waste", async () => {
      await bookingPage.expectSkipEnabled(testData.skips.heavyEnabled);
      await bookingPage.selectSkip(testData.skips.heavyEnabled);
    });

    await test.step("Verify review data and price breakdown are correct", async () => {
      await bookingPage.expectReviewVisible();
      await bookingPage.expectReviewPostcode(testData.postcodes.happyPath);
      await bookingPage.expectReviewAddress("10 Downing Street");
      await bookingPage.expectReviewWasteType("heavy");
      await bookingPage.expectReviewSkip("10-yard");
      await bookingPage.expectPriceBreakdown(
        testData.pricing.heavy.base,
        testData.pricing.heavy.vat,
        testData.pricing.heavy.total
      );
    });

    await test.step("Confirm booking and verify success state", async () => {
      await bookingPage.confirmBooking();
      await bookingPage.expectBookingSuccess();
    });
  });
});
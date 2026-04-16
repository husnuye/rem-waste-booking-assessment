import { test } from "@playwright/test";
import { BookingPage } from "../pages/bookingPage";
import { testData } from "../utils/testData";

/**
 * General waste booking flow
 *
 * This test validates the standard happy-path journey:
 * - successful postcode lookup
 * - address selection
 * - waste type selection
 * - skip selection
 * - review verification
 * - booking confirmation
 *
 * The goal is to prove that the core booking journey works end-to-end.
 */
test.describe("Booking Flow - General Waste", () => {
  test("should complete the general booking flow successfully", async ({ page }) => {
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

    await test.step("Select General waste and verify transition to skip step", async () => {
      await bookingPage.selectWasteType("General");
      await bookingPage.expectSkipStepLoaded();
    });

    await test.step("Select a valid enabled skip option", async () => {
      await bookingPage.expectSkipEnabled(testData.skips.general);
      await bookingPage.selectSkip(testData.skips.general);
    });

    await test.step("Verify review data and price breakdown are correct", async () => {
      await bookingPage.expectReviewVisible();
      await bookingPage.expectReviewPostcode(testData.postcodes.happyPath);
      await bookingPage.expectReviewAddress("10 Downing Street");
      await bookingPage.expectReviewWasteType("general");
      await bookingPage.expectReviewSkip("4-yard");
      await bookingPage.expectPriceBreakdown(
        testData.pricing.general.base,
        testData.pricing.general.vat,
        testData.pricing.general.total
      );
    });

    await test.step("Confirm booking and verify success state", async () => {
      await bookingPage.confirmBooking();
      await bookingPage.expectBookingSuccess();
    });
  });
});
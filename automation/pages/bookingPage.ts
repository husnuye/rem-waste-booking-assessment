import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { selectors } from "../utils/selectors";

/**
 * BookingPage
 *
 * Represents the full booking journey from postcode lookup to booking confirmation.
 *
 * Design goals:
 * - keep selectors centralized
 * - expose business-level actions
 * - provide reusable assertions for test stability
 *
 * This structure keeps tests readable for junior engineers
 * while remaining scalable and maintainable at a senior level.
 */
export class BookingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ---------- LOCATORS ----------
  // Centralized locator definitions improve maintainability and reduce duplication.

  postcodeInput(): Locator {
    return this.getByPlaceholder(selectors.placeholders.postcode);
  }

  lookupButton(): Locator {
    return this.getByButton(selectors.buttons.lookup);
  }

  addressButton(addressName: string | RegExp): Locator {
    return this.getByButton(addressName);
  }

  wasteTypeButton(type: "General" | "Heavy" | "Plasterboard"): Locator {
    return this.getByButton(type);
  }

  skipButton(name: string | RegExp): Locator {
    return this.getByButton(name);
  }

  confirmBookingButton(): Locator {
    return this.getByButton(selectors.buttons.confirmBooking);
  }

  // ---------- ACTIONS ----------
  // Business-level actions abstract UI interaction details from test cases.

  // Navigate to the home page.
  async openHomePage() {
    await this.goto("/");
  }

  // Enter postcode and trigger lookup in a single step.
  async enterPostcodeAndLookup(postcode: string) {
    await this.fill(this.postcodeInput(), postcode);
    await this.click(this.lookupButton());
  }

  // Select an address from the lookup results.
  async selectAddress(addressName: string | RegExp) {
    await this.click(this.addressButton(addressName));
  }

  // Select a waste type option.
  async selectWasteType(type: "General" | "Heavy" | "Plasterboard") {
    await this.click(this.wasteTypeButton(type));
  }

  // Select a skip size.
  async selectSkip(skipName: string | RegExp) {
    await this.click(this.skipButton(skipName));
  }

  // Confirm the booking action.
  async confirmBooking() {
    await this.click(this.confirmBookingButton());
  }

  // ---------- ASSERTIONS ----------
  // Assertions are centralized to ensure consistency across tests.

  async expectHomePageLoaded() {
    await this.expectVisible(this.getByHeading(selectors.headings.home));
    await this.expectVisible(this.postcodeInput());
    await this.expectVisible(this.lookupButton());
  }

  async expectAddressVisible(addressName: string | RegExp) {
    await this.expectVisible(this.addressButton(addressName));
  }

  async expectWasteTypeStepLoaded() {
    await this.expectVisible(this.getByHeading(selectors.headings.wasteType));
    await this.expectVisible(this.wasteTypeButton("General"));
    await this.expectVisible(this.wasteTypeButton("Heavy"));
    await this.expectVisible(this.wasteTypeButton("Plasterboard"));
  }

  async expectSkipStepLoaded() {
    await this.expectVisible(this.getByHeading(selectors.headings.skip));
  }

  // Validate business rule: disabled skips cannot be selected.
  async expectSkipDisabled(skipName: string | RegExp) {
    await this.expectDisabled(this.skipButton(skipName));
  }

  // Validate skip is selectable.
  async expectSkipEnabled(skipName: string | RegExp) {
    await this.expectEnabled(this.skipButton(skipName));
  }

  async expectReviewVisible() {
    await this.expectVisible(this.getByText(selectors.text.review));
  }

  // 🔥 Stable review assertions
  // Use paragraph filtering + .first() to avoid strict-mode conflicts
  // when similar labels appear multiple times (e.g. review + success card).

  async expectReviewPostcode(postcode: string) {
    await expect(
      this.page.locator("p").filter({ hasText: "Postcode:" }).first()
    ).toContainText(postcode);
  }

  async expectReviewAddress(address: string) {
    await expect(
      this.page.locator("p").filter({ hasText: "Address:" }).first()
    ).toContainText(address);
  }

  async expectReviewWasteType(type: string) {
    await expect(
      this.page.locator("p").filter({ hasText: "Waste type:" }).first()
    ).toContainText(type);
  }

  async expectReviewSkip(skip: string) {
    await expect(
      this.page.locator("p").filter({ hasText: "Skip:" }).first()
    ).toContainText(skip);
  }

  // Validate pricing calculation shown to the user.
  async expectPriceBreakdown(base: string, vat: string, total: string) {
    await expect(this.getByText(selectors.text.priceBreakdown).first()).toBeVisible();

    await expect(
      this.page.locator("p").filter({ hasText: "Base price:" }).first()
    ).toContainText(base);

    await expect(
      this.page.locator("p").filter({ hasText: "VAT (20%):" }).first()
    ).toContainText(vat);

    await expect(
      this.page.locator("p").filter({ hasText: "Total:" }).first()
    ).toContainText(total);
  }

  // Validate end-to-end success state after booking confirmation.
  async expectBookingSuccess() {
    await expect(
      this.getByText(selectors.text.bookingSuccess).first()
    ).toBeVisible();

    await expect(
      this.getByText(selectors.text.bookingId).first()
    ).toBeVisible();
  }
}
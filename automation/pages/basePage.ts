import { expect, Locator, Page } from "@playwright/test";

/**
 * BasePage
 *
 * Provides low-level reusable browser utilities shared across all page objects.
 *
 * Design principles:
 * - avoid duplication of common Playwright interactions
 * - centralize locator strategies
 * - keep test files focused on business logic, not UI mechanics
 *
 * This abstraction improves maintainability and readability,
 * especially in larger test suites.
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a given path.
   * Defaults to the root of the application.
   */
  async goto(path = "/") {
    await this.page.goto(path);
  }

  /**
   * Locate a button using ARIA role.
   * Preferred for stability and accessibility alignment.
   */
  getByButton(name: string | RegExp): Locator {
    return this.page.getByRole("button", { name });
  }

  /**
   * Locate a heading element.
   * Used for validating page/step transitions.
   */
  getByHeading(name: string | RegExp): Locator {
    return this.page.getByRole("heading", { name });
  }

  /**
   * Locate visible text.
   * Use carefully as it can match multiple elements.
   */
  getByText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }

  /**
   * Locate input fields by placeholder text.
   */
  getByPlaceholder(text: string): Locator {
    return this.page.getByPlaceholder(text);
  }

  /**
   * Assert that an element is visible.
   */
  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert that an element is enabled.
   */
  async expectEnabled(locator: Locator) {
    await expect(locator).toBeEnabled();
  }

  /**
   * Assert that an element is disabled.
   */
  async expectDisabled(locator: Locator) {
    await expect(locator).toBeDisabled();
  }

  /**
   * Click on an element.
   */
  async click(locator: Locator) {
    await locator.click();
  }

  /**
   * Fill an input field.
   */
  async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }
}
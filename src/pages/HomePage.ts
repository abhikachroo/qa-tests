import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage — locators and simple UI actions for the unauthenticated and
 * authenticated states of https://fra-vanilla-preprod.dev.spark.sonepar.com/
 *
 * Confirmed from live UI inspection (previous session):
 * - Two login entry points exist: header link and personalized-pricing banner link
 * - After login the Login link is replaced by an account/user indicator
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Header login link — visible in unauthenticated state
  // TODO: verify selector against live UI — role+name confirmed in accessibility snapshot
  headerLoginLink    = () => this.page.getByRole('link', { name: /se connecter|login|sign in/i });

  // Personalized pricing banner — visible in unauthenticated state
  pricingBanner      = () => this.page.locator('[data-testid="personalized-pricing-banner"], .personalized-pricing-banner, [class*="pricingBanner"]');

  // Banner CTA login link inside the pricing banner
  bannerLoginLink    = () => this.pricingBanner().getByRole('link', { name: /login|se connecter|sign in/i });

  // Post-login: user/account indicator in header (Login link replaced)
  userAccountWidget  = () => this.page.locator('[data-testid="account-widget"], [data-testid="user-menu"], [aria-label*="account"], [aria-label*="compte"]');

  async navigateToHome(): Promise<void> {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async clickHeaderLoginLink(): Promise<void> {
    await this.headerLoginLink().click();
  }

  async clickBannerLoginLink(): Promise<void> {
    await this.bannerLoginLink().click();
  }

  async isPricingBannerVisible(): Promise<boolean> {
    return this.pricingBanner().isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async isHeaderLoginLinkVisible(): Promise<boolean> {
    return this.headerLoginLink().isVisible({ timeout: 5_000 }).catch(() => false);
  }
}

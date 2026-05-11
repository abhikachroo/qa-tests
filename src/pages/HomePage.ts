import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Header navigation — pre-login state (strategy: data-testid, unique on page)
  headerLoginLink = (): Locator => this.page.getByTestId('login-button');

  // Header navigation — guest signup state (strategy: data-testid, unique on page)
  signUpLink = (): Locator => this.page.getByTestId('signup-button');

  // Header navigation — post-login authenticated state (strategy: data-testid)
  userDetailsButton = (): Locator => this.page.getByTestId('user-details-button');

  // Header cart link/count (strategy: data-testid, unique on page)
  cartButton = (): Locator => this.page.getByTestId('cart-button');

  // Homepage hero content (strategy: role+name, level=1)
  welcomeHeading = (): Locator => this.page.getByRole('heading', { name: 'Welcome', level: 1 });

  // Search bar (strategy: data-testid)
  searchBarInput = (): Locator => this.page.getByTestId('search-bar-input');

  // Guest pricing banner (strategy: visible text)
  guestPricingBanner = (): Locator => this.page.getByText(/Log in or sign up to access your personalized pricing!/i);

  async clickHeaderLoginLink(): Promise<void> {
    await this.headerLoginLink().click();
  }

  async getUserDetailsButtonText(): Promise<string> {
    return (await this.userDetailsButton().textContent()) ?? '';
  }

  async getCartButtonText(): Promise<string> {
    return (await this.cartButton().textContent()) ?? '';
  }
}

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) { super(page); }

  // Header navigation — pre-login state (strategy: data-testid, unique on page)
  headerLoginLink = () => this.page.getByTestId('login-button');

  // Header navigation — post-login authenticated state (strategy: data-testid)
  userDetailsButton = () => this.page.getByTestId('user-details-button');
  cartButton        = () => this.page.getByTestId('cart-button');

  // Homepage hero content (strategy: role+name, level=1)
  welcomeHeading = () => this.page.getByRole('heading', { name: 'Welcome', level: 1 });

  // Search bar (strategy: data-testid)
  searchBarInput = () => this.page.getByTestId('search-bar-input');

  // --- Simple UI actions ---

  async clickHeaderLoginLink(): Promise<void> {
    await this.headerLoginLink().click();
  }

  async getUserDetailsButtonText(): Promise<string> {
    return (await this.userDetailsButton().textContent()) ?? '';
  }
}

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductsPage — Select Products / product listing with EUR pricing
 * Selectors are approximate — TODO: verify via live UI inspection.
 */
export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Product list & pricing
  // TODO: verify selector
  productCards      = () => this.page.locator('[data-testid="product-card"], [class*="product-card"]');
  productPriceItems = () => this.page.locator('[data-testid="product-price"], [class*="price"]');
  addProductBtn     = (index: number = 0) => this.productCards().nth(index).getByRole('button', { name: /add|select/i });

  // Total Amount
  // TODO: verify selector
  totalAmountLabel  = () => this.page.getByTestId('total-amount');
  totalAmountText   = () => this.page.getByText(/total.*€|€.*total/i);

  // SLD tab / navigation
  // TODO: verify selector
  sldTab            = () => this.page.getByRole('tab', { name: /single line diagram|SLD/i });

  async addProduct(index: number = 0): Promise<void> {
    await this.addProductBtn(index).click();
  }

  async getTotalAmountText(): Promise<string> {
    return (await this.totalAmountText().textContent()) ?? '';
  }

  async getProductPriceTexts(): Promise<string[]> {
    const handles = await this.productPriceItems().all();
    return Promise.all(handles.map(h => h.textContent().then(t => t ?? '')));
  }

  async clickSldTab(): Promise<void> {
    await this.sldTab().click();
  }

  async getProductCount(): Promise<number> {
    return this.productCards().count();
  }
}

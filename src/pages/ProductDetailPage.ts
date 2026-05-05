import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage — Layer 2: Locators & basic UI actions only.
 *
 * Covers locators present on BOTH the search results page and the product detail
 * page for product 6968173. All selectors are verified via live browser inspection
 * on https://fra-vanilla-preprod.dev.spark.sonepar.com.
 */
export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Add-to-Cart CTA — data-testid consistent across search results & detail pages (verified live)
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');

  // Price restriction error — product-ID-specific testid (verified live on both pages)
  priceError = (productId: string) => this.page.getByTestId(`price-error-${productId}`);

  // Product card on search results page — data-testid='product-list-card-{productId}'
  productListCard = (productId: string) => this.page.getByTestId(`product-list-card-${productId}`);

  // Quantity controls — aria-label strategy, consistent across both pages (verified live)
  decrementButton = () => this.page.getByLabel('Decrement');
  incrementButton = () => this.page.getByLabel('Increment');

  // Quantity spinbutton — product detail page only (id: buybox-counter)
  quantitySelector = () => this.page.locator('#buybox-counter');

  // Quantity spinbutton — search results page (id: quantity-counter-{productId})
  quantitySelectorOnResults = (productId: string) => this.page.locator(`#quantity-counter-${productId}`);

  // H1 product title
  productTitle = () => this.page.locator('h1');

  // ProductID reference element
  productIdRef = () => this.page.getByTestId('ref-product-productId');

  // ManufacturerRefID reference element
  manufacturerRef = () => this.page.getByTestId('ref-product-manufacturerRefId');

  async navigateToProductDetail(slug: string): Promise<void> {
    await this.navigate(`/catalog/en-gb/products/${slug}`);
    await this.waitForPageLoad();
  }
}

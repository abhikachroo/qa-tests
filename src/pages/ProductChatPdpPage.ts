import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductChatPdpPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productHeading = () => this.page.getByRole('heading', { name: /NEXANS - Flexible PVC installation cable/i });
  productIdButton = () => this.page.getByTestId('ref-product-productId');
  manufacturerRefButton = () => this.page.getByTestId('ref-product-manufacturerRefId');
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');
  priceErrorMessage = () => this.page.getByTestId('price-error-699c3c52696e38abea84c7d6_AI_ERP');
  quantitySelector = () => this.page.locator('#buybox-counter'); // strategy: id

  stickyChatBar = () => this.page.getByTestId('rl-chat-box-pdp-sticky-bar'); // TODO: verify selector
  chatEntryButton = () => this.page.getByTestId('rl-chat-box-pdp-entry'); // TODO: verify selector
  chatPromptInput = () => this.page.getByTestId('rl-chat-box-pdp-input'); // TODO: verify selector
  chatHelperText = () => this.page.getByText('ask anything about this product');
  confirmChatButton = () => this.page.getByTestId('rl-chat-box-pdp-confirm'); // TODO: verify selector
  chatDrawer = () => this.page.getByTestId('rl-chat-drawer'); // TODO: verify selector
  chatDrawerHeader = () => this.page.getByTestId('rl-chat-drawer-header'); // TODO: verify selector
  chatContextContainer = () => this.page.getByTestId('rl-chat-context'); // TODO: verify selector
  chatLoadingIcon = () => this.page.getByTestId('rl-chat-loading-icon'); // TODO: verify selector
  chatLoadingLabel = () => this.page.getByTestId('rl-chat-loading-label'); // TODO: verify selector
  chatFollowUpInput = () => this.page.getByTestId('rl-chat-follow-up-input'); // TODO: verify selector
  minimizeDrawerButton = () => this.page.getByRole('button', { name: /minimize/i }); // strategy: role+text
  resumeConversationText = () => this.page.getByText(/resume to conversation/i); // TODO: verify selector/copy
  resumeConversationButton = () => this.page.getByRole('button', { name: /resume|expand/i }); // TODO: verify selector/copy

  specificProductCard = () => this.page.getByTestId('product-list-card-699c3c52696e38abea84c7d6_AI_ERP');
  genericProductTitle = () => this.page.getByTestId('product-list-card-title');

  async openSpecificProductCard(): Promise<void> {
    await this.specificProductCard().click();
  }

  async clickChatEntryButton(): Promise<void> {
    await this.chatEntryButton().click();
  }

  async fillChatPrompt(prompt: string): Promise<void> {
    await this.chatPromptInput().fill(prompt);
  }

  async clickConfirmChatButton(): Promise<void> {
    await this.confirmChatButton().click();
  }

  async clickMinimizeDrawerButton(): Promise<void> {
    await this.minimizeDrawerButton().click();
  }

  async clickResumeConversationButton(): Promise<void> {
    await this.resumeConversationButton().click();
  }

  async waitForPdpUrl(): Promise<void> {
    await this.page.waitForURL('**/catalog/products/**', { timeout: 30_000 });
  }

  async getGenericProductTitleCount(): Promise<number> {
    return this.genericProductTitle().count();
  }

  async getStickyChatBarCount(): Promise<number> {
    return this.stickyChatBar().count();
  }

  async getChatEntryButtonCount(): Promise<number> {
    return this.chatEntryButton().count();
  }

  async getPromptInputValue(): Promise<string> {
    return this.chatPromptInput().inputValue();
  }

  async getCurrentPageUrl(): Promise<string> {
    return this.getCurrentUrl();
  }

  async isDrawerVisible(): Promise<boolean> {
    return this.chatDrawer().isVisible().catch(() => false);
  }

  async getDrawerInteractiveElements(): Promise<Locator[]> {
    return [
      this.chatDrawerHeader(),
      this.chatContextContainer(),
      this.chatFollowUpInput(),
    ];
  }
}

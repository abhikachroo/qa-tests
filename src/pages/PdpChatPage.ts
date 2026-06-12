import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PdpChatPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productTitleHeading = () => this.page.getByRole('heading', { name: 'FLUKE - Digital thermometer 1 input' }); // strategy: role+text
  productIdReference  = () => this.page.getByTestId('ref-product-productId');
  loginButton         = () => this.page.getByTestId('login-button');

  chatEntryPoint = () =>
    this.page
      .locator('[data-testid*="chat"], [data-testid*="drawer"]') // TODO: verify selector
      .filter({ hasText: /ask|chat|conversation|product/i })
      .first();

  chatPromptInput = () =>
    this.page
      .locator('textarea, input[placeholder*="product" i], input[placeholder*="ask" i]') // TODO: verify selector
      .first();

  chatPromptHelperText = () => this.page.getByText('ask anything about this product', { exact: false });

  confirmCta = () =>
    this.page
      .locator('[data-testid*="confirm"], [data-testid*="chat-submit"], button') // TODO: verify selector
      .filter({ hasText: /confirm|send|continue|ask/i })
      .first();

  conversationDrawer = () =>
    this.page
      .locator('[data-testid*="drawer"], [role="dialog"], [aria-label*="conversation" i]') // TODO: verify selector
      .first();

  drawerProductTitle = () =>
    this.conversationDrawer().getByText('FLUKE - Digital thermometer 1 input', { exact: false }); // strategy: role+text/product title

  minimizeButton = () =>
    this.conversationDrawer()
      .locator('[data-testid*="minimize"], button[aria-label*="minimize" i], button') // TODO: verify selector
      .filter({ hasText: /minimize|reduce|collapse/i })
      .first();

  drawerContextArea = () =>
    this.conversationDrawer()
      .locator('[data-testid*="context"], [data-testid*="conversation"], [data-testid*="message"]') // TODO: verify selector
      .first();

  loadingIndicator = () =>
    this.conversationDrawer()
      .locator('[data-testid*="loading"], [role="status"], svg[aria-label*="loading" i]') // TODO: verify selector
      .first();

  loadingLabel = () =>
    this.conversationDrawer()
      .locator('[data-testid*="loading"], [role="status"]') // TODO: verify selector
      .first();

  followUpChatInput = () =>
    this.conversationDrawer()
      .locator('textarea, input[placeholder*="message" i], input[placeholder*="ask" i]') // TODO: verify selector
      .last();

  resumedChatBox = () =>
    this.page
      .locator('[data-testid*="chat"], [data-testid*="resume"], [data-testid*="drawer"]') // TODO: verify selector
      .filter({ hasText: /resume|conversation|chat/i })
      .first();

  resumeText = () => this.page.getByText(/resume.*conversation|conversation.*resume/i);

  expandConversationButton = () =>
    this.page
      .locator('[data-testid*="expand"], button[aria-label*="expand" i], button') // TODO: verify selector
      .filter({ hasText: /expand|resume|open/i })
      .first();

  async openFirstSearchResultForProduct(productId: string): Promise<void> {
    await this.page.getByTestId('product-list-card-title').filter({ hasText: productId }).first().click();
  }

  async clickChatEntryPoint(): Promise<void> {
    await this.chatEntryPoint().click();
  }

  async fillInitialPrompt(prompt: string): Promise<void> {
    await this.chatPromptInput().fill(prompt);
  }

  async clickConfirmCta(): Promise<void> {
    await this.confirmCta().click();
  }

  async clickMinimize(): Promise<void> {
    await this.minimizeButton().click();
  }

  async clickExpandConversation(): Promise<void> {
    await this.expandConversationButton().click();
  }

  async getChatEntryPointCount(): Promise<number> {
    return this.chatEntryPoint().count();
  }

  async getConfirmCtaDisabledState(): Promise<boolean> {
    const cta: Locator = this.confirmCta();
    return cta.isDisabled().catch(() => false);
  }
}

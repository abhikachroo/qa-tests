import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ChatPdpPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productHeading = (): Locator => this.page.getByRole('heading', { name: 'NEXANS - Flexible PVC installation cable 3G1.5 mm², white, 50 m coil' }); // strategy: role+text
  loginButton = (): Locator => this.page.getByTestId('login-button');
  signUpButton = (): Locator => this.page.getByTestId('signup-button');
  priceError = (): Locator => this.page.getByTestId('price-error-699c3c52696e38abea84c7d6_AI_ERP');
  stickyChatEntry = (): Locator => this.page.getByText(/ask anything about this product/i); // TODO: verify selector when feature is enabled
  chatInput = (): Locator => this.page.getByLabel(/search box|ask anything/i); // TODO: verify selector when feature is enabled
  confirmationCta = (): Locator => this.page.getByRole('button', { name: /open conversation|ask follow up|continue/i }); // TODO: verify selector when feature is enabled
  drawerShell = (): Locator => this.page.getByRole('complementary'); // TODO: verify selector when feature is enabled
  drawerProductName = (): Locator => this.page.getByRole('heading', { name: /NEXANS - Flexible PVC installation cable 3G1\.5 mm², white, 50 m coil/i });
  minimizeButton = (): Locator => this.page.getByRole('button', { name: /minimize|collapse/i }); // strategy: role+text
  chatContextBox = (): Locator => this.page.getByText(/open conversation|resume conversation/i); // TODO: verify selector when feature is enabled
  chatBoxComponent = (): Locator => this.page.getByRole('textbox', { name: /ask follow up|ask anything|search box/i }); // TODO: verify selector when feature is enabled
  askFollowUpLabel = (): Locator => this.page.getByText(/ask follow up/i);
  loadingStateLabel = (): Locator => this.page.getByText(/loading/i); // TODO: verify selector when feature is enabled
  loadingStateIcon = (): Locator => this.page.locator('[role="status"] svg, [data-testid*="loading"], [aria-label*="loading"]'); // TODO: verify selector when feature is enabled
  resumeConversationLabel = (): Locator => this.page.getByText(/resume conversation/i);
  expandButton = (): Locator => this.page.getByRole('button', { name: /resume conversation|expand|open conversation/i }); // TODO: verify selector when feature is enabled

  async openPdp(path: string): Promise<void> {
    await this.navigate(path);
  }

  async clickStickyChatEntry(): Promise<void> {
    await this.stickyChatEntry().click();
  }

  async fillChatInput(prompt: string): Promise<void> {
    await this.chatInput().fill(prompt);
  }

  async clickConfirmationCta(): Promise<void> {
    await this.confirmationCta().click();
  }

  async clickMinimizeButton(): Promise<void> {
    await this.minimizeButton().click();
  }

  async clickExpandButton(): Promise<void> {
    await this.expandButton().click();
  }
}

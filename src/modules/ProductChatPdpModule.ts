import { expect } from '@playwright/test';
import { config } from '@config/index';
import { ProductChatPdpPage } from '@pages/ProductChatPdpPage';
import { SearchModule } from '@modules/SearchModule';
import { LoginModule } from '@modules/LoginModule';
import { Logger } from '@utils/Logger';

export class ProductChatPdpModule {
  private logger: Logger;

  constructor(
    private productChatPdpPage: ProductChatPdpPage,
    private searchModule: SearchModule,
    private loginModule: LoginModule,
  ) {
    this.logger = new Logger('ProductChatPdpModule');
  }

  async navigateToProductPdpFromSearch(keyword: string = 'cable'): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to PDP from search with keyword: ${keyword}`);
    await this.searchModule.submitSearch(keyword);
    await this.productChatPdpPage.openSpecificProductCard();
    await this.productChatPdpPage.waitForPdpUrl();
    await this.productChatPdpPage.waitForPageLoad();
    this.logger.info('PDP loaded from search results');
  }

  async verifyPdpAnchors(): Promise<void> {
    await expect(this.productChatPdpPage.productHeading()).toBeVisible();
    await expect(this.productChatPdpPage.productIdButton()).toBeVisible();
    await expect(this.productChatPdpPage.manufacturerRefButton()).toBeVisible();
    await expect(this.productChatPdpPage.addToCartButton()).toBeVisible();
  }

  async loginAndNavigateToProductPdp(keyword: string = 'cable'): Promise<void> {
    this.logger.info('Logging in before navigating to PDP for authenticated chat checks');
    await this.loginModule.doLogin();
    await this.loginModule.verifyLoginSuccess();
    await this.navigateToProductPdpFromSearch(keyword);
  }

  async verifyChatUnavailableForAnonymousUser(): Promise<void> {
    await expect(this.productChatPdpPage.productHeading()).toBeVisible();
    await expect(this.productChatPdpPage.priceErrorMessage()).toBeVisible();
    await expect(this.productChatPdpPage.stickyChatBar()).toHaveCount(0);
    await expect(this.productChatPdpPage.chatEntryButton()).toHaveCount(0);
  }

  async verifyStickyChatBarVisibleForEligibleUser(): Promise<void> {
    await expect(this.productChatPdpPage.stickyChatBar()).toBeVisible();
    await expect(this.productChatPdpPage.chatEntryButton()).toBeVisible();
  }

  async expandChatEntry(): Promise<void> {
    this.logger.info('Expanding PDP chat entry');
    await this.productChatPdpPage.clickChatEntryButton();
  }

  async verifyExpandedChatInputState(): Promise<void> {
    await expect(this.productChatPdpPage.chatPromptInput()).toBeVisible();
    await expect(this.productChatPdpPage.chatHelperText()).toBeVisible();
  }

  async enterChatPrompt(prompt: string): Promise<void> {
    this.logger.info('Typing PDP chat prompt');
    await this.productChatPdpPage.fillChatPrompt(prompt);
  }

  async verifyPromptRetainedAndConfirmVisible(prompt: string): Promise<void> {
    await expect(this.productChatPdpPage.chatPromptInput()).toHaveValue(prompt);
    await expect(this.productChatPdpPage.confirmChatButton()).toBeVisible();
    await expect(this.productChatPdpPage.confirmChatButton()).toBeEnabled();
  }

  async verifyConfirmUnavailableForWhitespacePrompt(): Promise<void> {
    await expect(this.productChatPdpPage.chatPromptInput()).toHaveValue(/^\s*$/);
    await expect(this.productChatPdpPage.confirmChatButton()).toBeHidden();
  }

  async openChatDrawer(): Promise<void> {
    this.logger.info('Opening chat drawer from PDP chat box');
    await this.productChatPdpPage.clickConfirmChatButton();
  }

  async verifyChatDrawerOpened(): Promise<void> {
    await expect(this.productChatPdpPage.chatDrawer()).toBeVisible();
    await expect(this.productChatPdpPage.chatEntryButton()).toHaveCount(0);
  }

  async verifyChatDrawerComponents(): Promise<void> {
    await expect(this.productChatPdpPage.chatDrawerHeader()).toBeVisible();
    await expect(this.productChatPdpPage.productHeading()).toBeVisible();
    await expect(this.productChatPdpPage.minimizeDrawerButton()).toBeVisible();
    await expect(this.productChatPdpPage.chatContextContainer()).toBeVisible();
    await expect(this.productChatPdpPage.chatFollowUpInput()).toBeVisible();
  }

  async verifyLoadingStateWhenVisible(): Promise<void> {
    await expect(this.productChatPdpPage.chatLoadingIcon()).toBeVisible();
    await expect(this.productChatPdpPage.chatLoadingLabel()).toBeVisible();
  }

  async minimizeDrawer(): Promise<void> {
    this.logger.info('Minimizing chat drawer');
    await this.productChatPdpPage.clickMinimizeDrawerButton();
  }

  async verifyDrawerMinimizedAndChatRestored(): Promise<void> {
    await expect(this.productChatPdpPage.chatDrawer()).toHaveCount(0);
    await expect(this.productChatPdpPage.chatEntryButton()).toBeVisible();
    await expect(this.productChatPdpPage.productHeading()).toBeVisible();
  }

  async verifyResumeConversationState(): Promise<void> {
    await expect(this.productChatPdpPage.resumeConversationText()).toBeVisible();
    await expect(this.productChatPdpPage.resumeConversationButton()).toBeVisible();
    await expect(this.productChatPdpPage.resumeConversationButton()).toBeEnabled();
  }

  async reopenDrawerFromResumeState(): Promise<void> {
    this.logger.info('Reopening drawer from resume state');
    await this.productChatPdpPage.clickResumeConversationButton();
  }

  async verifyDrawerReopened(): Promise<void> {
    await expect(this.productChatPdpPage.chatDrawer()).toBeVisible();
    await expect(this.productChatPdpPage.resumeConversationButton()).toHaveCount(0);
  }
}

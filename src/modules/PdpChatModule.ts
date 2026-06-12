import { expect } from '@playwright/test';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { PdpChatPage } from '@pages/PdpChatPage';
import { LoginModule } from '@modules/LoginModule';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class PdpChatModule {
  private logger: Logger;

  constructor(
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private pdpChatPage: PdpChatPage,
    private loginModule: LoginModule,
  ) {
    this.logger = new Logger('PdpChatModule');
  }

  async loginAndOpenPdp(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Logging in and opening PDP for product: ${productId}`);
    await this.loginModule.doLogin();
    await this.loginModule.verifyLoginSuccess();
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
    await this.headerSearchPage.fillSearchInput(productId);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(productId);
    await expect(this.searchResultsPage.productIdText(productId)).toBeVisible();
    await this.searchResultsPage.productCard(productId).click();
    await this.pdpChatPage.waitForPageLoad();
    await expect(this.pdpChatPage.productIdReference()).toContainText(productId);
    await expect(this.pdpChatPage.productTitleHeading()).toBeVisible();
    this.logger.info('Authenticated PDP is open');
  }

  async openGuestPdp(productId: string): Promise<void> {
    this.logger.info(`Opening PDP as guest for product: ${productId}`);
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
    await this.headerSearchPage.fillSearchInput(productId);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(productId);
    await expect(this.searchResultsPage.productIdText(productId)).toBeVisible();
    await this.searchResultsPage.productCard(productId).click();
    await this.pdpChatPage.waitForPageLoad();
    await expect(this.pdpChatPage.productIdReference()).toContainText(productId);
    await expect(this.pdpChatPage.productTitleHeading()).toBeVisible();
    this.logger.info('Guest PDP is open');
  }

  async verifyStickyChatEntryPointVisible(): Promise<void> {
    await expect(this.pdpChatPage.chatEntryPoint()).toBeVisible();
  }

  async expandChatFromStickyBar(): Promise<void> {
    await this.pdpChatPage.clickChatEntryPoint();
    await expect(this.pdpChatPage.chatPromptInput()).toBeVisible();
  }

  async verifyExpandedPromptState(): Promise<void> {
    await expect(this.pdpChatPage.chatPromptHelperText()).toBeVisible();
    await expect(this.pdpChatPage.chatPromptInput()).toBeVisible();
  }

  async enterInitialPrompt(prompt: string): Promise<void> {
    await this.pdpChatPage.fillInitialPrompt(prompt);
    await expect(this.pdpChatPage.chatPromptInput()).toHaveValue(prompt);
  }

  async verifyConfirmationCtaVisible(): Promise<void> {
    await expect(this.pdpChatPage.confirmCta()).toBeVisible();
    await expect(this.pdpChatPage.confirmCta()).toBeEnabled();
  }

  async submitInitialPrompt(): Promise<void> {
    await this.pdpChatPage.clickConfirmCta();
    await expect(this.pdpChatPage.conversationDrawer()).toBeVisible();
  }

  async verifyDrawerShell(): Promise<void> {
    await expect(this.pdpChatPage.conversationDrawer()).toBeVisible();
    await expect(this.pdpChatPage.drawerProductTitle()).toBeVisible();
    await expect(this.pdpChatPage.minimizeButton()).toBeVisible();
    await expect(this.pdpChatPage.drawerContextArea()).toBeVisible();
    await expect(this.pdpChatPage.loadingIndicator()).toBeVisible();
    await expect(this.pdpChatPage.loadingLabel()).toBeVisible();
    await expect(this.pdpChatPage.followUpChatInput()).toBeVisible();
  }

  async minimizeDrawer(): Promise<void> {
    await this.pdpChatPage.clickMinimize();
    await expect(this.pdpChatPage.conversationDrawer()).not.toBeVisible();
  }

  async verifyResumedChatBoxState(): Promise<void> {
    await expect(this.pdpChatPage.resumedChatBox()).toBeVisible();
    await expect(this.pdpChatPage.resumeText()).toBeVisible();
    await expect(this.pdpChatPage.expandConversationButton()).toBeVisible();
  }

  async reopenDrawerFromResumedState(): Promise<void> {
    await this.pdpChatPage.clickExpandConversation();
    await expect(this.pdpChatPage.conversationDrawer()).toBeVisible();
  }

  async verifyEmptyPromptSubmissionBlocked(): Promise<void> {
    await expect(this.pdpChatPage.chatPromptInput()).toHaveValue('');
    await expect(this.pdpChatPage.confirmCta()).toBeDisabled().catch(async () => {
      await expect(this.pdpChatPage.conversationDrawer()).toHaveCount(0);
    });
  }

  async verifyChatHiddenForGuest(): Promise<void> {
    await expect(this.pdpChatPage.loginButton()).toBeVisible();
    await expect(this.pdpChatPage.chatEntryPoint()).toHaveCount(0);
  }

  async verifyLoadingStateDuringInitialization(): Promise<void> {
    await expect(this.pdpChatPage.conversationDrawer()).toBeVisible();
    await expect(this.pdpChatPage.loadingIndicator()).toBeVisible();
    await expect(this.pdpChatPage.loadingLabel()).toBeVisible();
  }
}

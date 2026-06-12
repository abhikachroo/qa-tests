import { expect } from '@playwright/test';
import { config } from '@config/index';
import { ChatPdpPage } from '@pages/ChatPdpPage';
import { LoginModule } from '@modules/LoginModule';
import { Logger } from '@utils/Logger';

export class ChatPdpModule {
  private logger: Logger;
  private readonly pdpPath = '/catalog/en-gb/products/nexans-nexans-flexible-pvc-installation-cable-3g1-5-mm2-white-50-m-coil-699c3c52696e38abea84c7d6_AI_ERP';

  constructor(
    private chatPdpPage: ChatPdpPage,
    private loginModule: LoginModule,
  ) {
    this.logger = new Logger('ChatPdpModule');
  }

  async loginAndOpenPdp(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening PDP after authentication`);
    await this.loginModule.doLogin();
    await this.chatPdpPage.openPdp(this.pdpPath);
    await this.chatPdpPage.waitForPageLoad();
    await this.chatPdpPage.dismissCookieBannerIfPresent();
    await expect(this.chatPdpPage.productHeading()).toBeVisible();
  }

  async openPdpAsGuest(): Promise<void> {
    this.logger.info('Opening PDP as guest user');
    await this.chatPdpPage.openPdp(this.pdpPath);
    await this.chatPdpPage.waitForPageLoad();
    await this.chatPdpPage.dismissCookieBannerIfPresent();
    await expect(this.chatPdpPage.productHeading()).toBeVisible();
  }

  async openStickyChatEntry(): Promise<void> {
    this.logger.info('Opening sticky PDP chat entry');
    await expect(this.chatPdpPage.stickyChatEntry()).toBeVisible();
    await this.chatPdpPage.clickStickyChatEntry();
    await expect(this.chatPdpPage.chatInput()).toBeVisible();
  }

  async enterPrompt(prompt: string): Promise<void> {
    this.logger.info('Entering PDP chat prompt');
    await this.chatPdpPage.fillChatInput(prompt);
  }

  async openDrawerFromConfirmationCta(): Promise<void> {
    this.logger.info('Opening PDP chat drawer from confirmation CTA');
    await expect(this.chatPdpPage.confirmationCta()).toBeVisible();
    await this.chatPdpPage.clickConfirmationCta();
    await expect(this.chatPdpPage.drawerShell()).toBeVisible();
  }

  async verifyDrawerShell(): Promise<void> {
    this.logger.info('Verifying drawer shell content');
    await expect(this.chatPdpPage.drawerShell()).toBeVisible();
    await expect(this.chatPdpPage.drawerProductName()).toBeVisible();
    await expect(this.chatPdpPage.minimizeButton()).toBeVisible();
    await expect(this.chatPdpPage.chatContextBox()).toBeVisible();
    await expect(this.chatPdpPage.chatBoxComponent()).toBeVisible();
    await expect(this.chatPdpPage.askFollowUpLabel()).toBeVisible();
  }

  async verifyLoadingStateVisible(): Promise<void> {
    this.logger.info('Verifying drawer loading state');
    await expect(this.chatPdpPage.loadingStateLabel()).toBeVisible();
    await expect(this.chatPdpPage.loadingStateIcon()).toBeVisible();
  }

  async minimizeDrawer(): Promise<void> {
    this.logger.info('Minimizing drawer');
    await this.chatPdpPage.clickMinimizeButton();
  }

  async verifyMinimizedState(): Promise<void> {
    this.logger.info('Verifying minimized chat state');
    await expect(this.chatPdpPage.resumeConversationLabel()).toBeVisible();
    await expect(this.chatPdpPage.expandButton()).toBeVisible();
  }

  async reopenDrawer(): Promise<void> {
    this.logger.info('Reopening drawer from minimized state');
    await this.chatPdpPage.clickExpandButton();
    await expect(this.chatPdpPage.drawerShell()).toBeVisible();
  }

  async verifyGuestStateHasNoChatEntry(): Promise<void> {
    this.logger.info('Verifying guest state does not expose PDP chat entry');
    await expect(this.chatPdpPage.loginButton()).toBeVisible();
    await expect(this.chatPdpPage.signUpButton()).toBeVisible();
    await expect(this.chatPdpPage.stickyChatEntry()).toHaveCount(0);
  }

  async verifyFeatureDisabledStateHasNoChatEntry(): Promise<void> {
    this.logger.info('Verifying authenticated but feature-disabled state does not expose PDP chat entry');
    await expect(this.chatPdpPage.priceError()).toBeVisible();
    await expect(this.chatPdpPage.stickyChatEntry()).toHaveCount(0);
  }

  async verifyConfirmationCtaNotAvailableForWhitespace(prompt: string): Promise<void> {
    this.logger.info('Verifying whitespace-only prompt does not activate confirmation CTA');
    await this.chatPdpPage.fillChatInput(prompt);
    await expect(this.chatPdpPage.confirmationCta()).toHaveCount(0);
  }

  async verifyLoadingStateTransitions(): Promise<void> {
    this.logger.info('Verifying loading state transitions to interactive chat content');
    await expect(this.chatPdpPage.loadingStateLabel()).toBeVisible();
    await expect(this.chatPdpPage.chatBoxComponent()).toBeVisible();
    await expect(this.chatPdpPage.loadingStateLabel()).toHaveCount(0);
  }
}

import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

test.describe(`@ChatDrawer @PdpChat Chat box on PDP Drawer — ${config.displayName} on ${config.environment}`, () => {
  const promptText = 'What is this product used for?';
  const whitespacePrompt = '   ';

  test('@P0 @Smoke TC-001: Open PDP sticky chat entry with feature enabled displays chat input helper text', async ({ chatPdpModule, chatPdpPage }) => {
    await test.step('Login and open the target PDP', async () => {
      await chatPdpModule.loginAndOpenPdp();
    });

    await test.step('Open the sticky chat entry and verify the helper text', async () => {
      await chatPdpModule.openStickyChatEntry();
      await expect(chatPdpPage.stickyChatEntry()).toBeVisible();
      await expect(chatPdpPage.chatInput()).toBeVisible();
    });
  });

  test('@P0 @Smoke TC-003: Click confirmation CTA hides sticky chat box and opens drawer for the selected product', async ({ chatPdpModule, chatPdpPage }) => {
    await test.step('Login, open the PDP, and enter a valid prompt', async () => {
      await chatPdpModule.loginAndOpenPdp();
      await chatPdpModule.openStickyChatEntry();
      await chatPdpModule.enterPrompt(promptText);
    });

    await test.step('Open the drawer from the confirmation CTA', async () => {
      await chatPdpModule.openDrawerFromConfirmationCta();
      await expect(chatPdpPage.drawerShell()).toBeVisible();
    });
  });

  test('@P1 @Regression TC-002: Type into PDP chat input displays confirmation CTA', async ({ chatPdpModule, chatPdpPage }) => {
    await test.step('Login, open the PDP, and expand the sticky chat entry', async () => {
      await chatPdpModule.loginAndOpenPdp();
      await chatPdpModule.openStickyChatEntry();
    });

    await test.step('Type a non-empty prompt and verify the confirmation CTA becomes visible', async () => {
      await chatPdpModule.enterPrompt(promptText);
      await expect(chatPdpPage.confirmationCta()).toBeVisible();
      await expect(chatPdpPage.chatInput()).toHaveValue(promptText);
    });
  });

  test('@P1 @Regression TC-004: Open drawer displays product name, loading state, context area, chat box, and ask follow up label', async ({ chatPdpModule }) => {
    await test.step('Login, open the PDP, and open the drawer', async () => {
      await chatPdpModule.loginAndOpenPdp();
      await chatPdpModule.openStickyChatEntry();
      await chatPdpModule.enterPrompt(promptText);
      await chatPdpModule.openDrawerFromConfirmationCta();
    });

    await test.step('Verify the drawer shell, product name, loading state, and chat content', async () => {
      await chatPdpModule.verifyLoadingStateVisible();
      await chatPdpModule.verifyDrawerShell();
    });
  });

  test('@P1 @Regression TC-005: Minimize CTA closes drawer and restores the PDP chat entry state', async ({ chatPdpModule, chatPdpPage }) => {
    await test.step('Login, open the PDP chat drawer, and minimize it', async () => {
      await chatPdpModule.loginAndOpenPdp();
      await chatPdpModule.openStickyChatEntry();
      await chatPdpModule.enterPrompt(promptText);
      await chatPdpModule.openDrawerFromConfirmationCta();
      await chatPdpModule.minimizeDrawer();
    });

    await test.step('Verify the minimized or restored PDP chat entry state is visible', async () => {
      await chatPdpModule.verifyMinimizedState();
      await expect(chatPdpPage.drawerShell()).toHaveCount(0);
    });
  });

  test('@P1 @Regression TC-007: Expand CTA reopens the drawer from minimized state', async ({ page, chatPdpModule, chatPdpPage }) => {
    await test.step('Login, open the PDP chat drawer, and minimize it', async () => {
      await chatPdpModule.loginAndOpenPdp();
      await chatPdpModule.openStickyChatEntry();
      await chatPdpModule.enterPrompt(promptText);
      await chatPdpModule.openDrawerFromConfirmationCta();
      await chatPdpModule.minimizeDrawer();
    });

    await test.step('Reopen the drawer from the minimized state and verify the PDP URL remains stable', async () => {
      await chatPdpModule.reopenDrawer();
      await expect(chatPdpPage.drawerShell()).toBeVisible();
      await expect(page).toHaveURL(/\/catalog\/en-gb\/products\//);
    });
  });

  test('@P1 @Regression TC-008: Guest user does not see PDP chat entry point', async ({ chatPdpModule }) => {
    await test.step('Open the target PDP as a guest user', async () => {
      await chatPdpModule.openPdpAsGuest();
    });

    await test.step('Verify the guest session does not expose any PDP chat entry point', async () => {
      await chatPdpModule.verifyGuestStateHasNoChatEntry();
    });
  });

  test('@P1 @Regression TC-009: Authenticated user with chat feature disabled does not see PDP chat entry point', async ({ chatPdpModule }) => {
    await test.step('Login and open the target PDP with the current feature-disabled account state', async () => {
      await chatPdpModule.loginAndOpenPdp();
    });

    await test.step('Verify no PDP chat entry point is rendered when the feature is disabled', async () => {
      await chatPdpModule.verifyFeatureDisabledStateHasNoChatEntry();
    });
  });

  test('@P2 @Regression TC-006: Minimized chat state shows resume conversation text and expand CTA', async ({ chatPdpModule }) => {
    await test.step('Login, open the PDP chat drawer, and minimize it', async () => {
      await chatPdpModule.loginAndOpenPdp();
      await chatPdpModule.openStickyChatEntry();
      await chatPdpModule.enterPrompt(promptText);
      await chatPdpModule.openDrawerFromConfirmationCta();
      await chatPdpModule.minimizeDrawer();
    });

    await test.step('Verify the minimized state shows resume conversation text and an expand CTA', async () => {
      await chatPdpModule.verifyMinimizedState();
    });
  });

  test('@P2 @Regression TC-010: Empty or whitespace chat input keeps confirmation CTA hidden or disabled', async ({ chatPdpModule, chatPdpPage }) => {
    const unusedPrompt = DataGenerator.randomString(5);

    await test.step('Login, open the PDP, and expand the sticky chat entry', async () => {
      await chatPdpModule.loginAndOpenPdp();
      await chatPdpModule.openStickyChatEntry();
      await expect(chatPdpPage.confirmationCta()).toHaveCount(0);
    });

    await test.step('Enter whitespace only and verify the confirmation CTA stays unavailable', async () => {
      await chatPdpModule.verifyConfirmationCtaNotAvailableForWhitespace(whitespacePrompt);
      await expect(chatPdpPage.chatInput()).not.toHaveValue(unusedPrompt);
    });
  });

  test('@P2 @Regression TC-011: Drawer initialization loading state transitions to interactive chat content without persistent loader', async ({ chatPdpModule }) => {
    await test.step('Login, open the PDP chat drawer, and trigger initialization', async () => {
      await chatPdpModule.loginAndOpenPdp();
      await chatPdpModule.openStickyChatEntry();
      await chatPdpModule.enterPrompt(promptText);
      await chatPdpModule.openDrawerFromConfirmationCta();
    });

    await test.step('Verify the loading state transitions to interactive chat content', async () => {
      await chatPdpModule.verifyLoadingStateTransitions();
    });
  });
});

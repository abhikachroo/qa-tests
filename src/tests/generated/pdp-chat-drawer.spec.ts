import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const productId = '0362772';
const productTitle = 'FLUKE - Digital thermometer 1 input';
const initialPrompt = 'What is this product used for?';

test.describe(`@P0 @P1 @P2 @Smoke @Regression @PdpChat PDP Chat Drawer — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke TC-001: Search for a product from the header and open its PDP successfully', async ({ page, loginModule, searchModule, searchResultsPage, pdpChatPage }) => {
    await test.step('Authenticate with the configured preprod user', async () => {
      await loginModule.doLogin();
      await loginModule.verifyLoginSuccess();
    });

    await test.step('Submit a header search for the target product', async () => {
      await searchModule.submitSearch(productId);
      await expect(page).toHaveURL(/\/search\/0362772/);
    });

    await test.step('Open the product PDP from the search results', async () => {
      await expect(searchResultsPage.productIdText(productId)).toBeVisible();
      await searchModule.openSearchResultByProductId(productId);
    });

    await test.step('Verify the PDP product title is visible', async () => {
      await expect(pdpChatPage.productTitleHeading()).toBeVisible();
      await expect(pdpChatPage.productIdReference()).toContainText(productId);
    });
  });

  test('@P0 @Smoke TC-005: Confirm the initial prompt and open the conversation drawer', async ({ pdpChatModule }) => {
    await test.step('Authenticate and open the PDP for the target product', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
    });

    await test.step('Expand the sticky chat box and enter the initial prompt', async () => {
      await pdpChatModule.expandChatFromStickyBar();
      await pdpChatModule.enterInitialPrompt(initialPrompt);
      await pdpChatModule.verifyConfirmationCtaVisible();
    });

    await test.step('Confirm the initial prompt and open the conversation drawer', async () => {
      await pdpChatModule.submitInitialPrompt();
    });
  });

  test('@P1 @Regression TC-002: Display the sticky chat bar on PDP for an eligible logged-in user', async ({ pdpChatModule }) => {
    await test.step('Authenticate and open the PDP for the target product', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
    });

    await test.step('Verify the sticky chat entry point is visible and interactable', async () => {
      await pdpChatModule.verifyStickyChatEntryPointVisible();
    });
  });

  test('@P1 @Regression TC-003: Expand the sticky chat bar and show the product-specific prompt text', async ({ pdpChatModule }) => {
    await test.step('Authenticate and open the PDP for the target product', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
    });

    await test.step('Expand the sticky chat bar', async () => {
      await pdpChatModule.expandChatFromStickyBar();
    });

    await test.step('Verify the product-specific helper text and prompt input are shown', async () => {
      await pdpChatModule.verifyExpandedPromptState();
    });
  });

  test('@P1 @Regression TC-004: Show the confirmation CTA after the user types in the PDP chat input', async ({ pdpChatModule }) => {
    await test.step('Authenticate and open the PDP for the target product', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
    });

    await test.step('Expand the sticky chat box and type an initial prompt', async () => {
      await pdpChatModule.expandChatFromStickyBar();
      await pdpChatModule.enterInitialPrompt(initialPrompt);
    });

    await test.step('Verify the confirmation CTA becomes visible and enabled', async () => {
      await pdpChatModule.verifyConfirmationCtaVisible();
    });
  });

  test('@P1 @Regression TC-006: Render the required drawer shell elements after opening the conversation drawer', async ({ pdpChatModule }) => {
    await test.step('Authenticate, open the PDP, and submit the initial prompt', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
      await pdpChatModule.expandChatFromStickyBar();
      await pdpChatModule.enterInitialPrompt(initialPrompt);
      await pdpChatModule.submitInitialPrompt();
    });

    await test.step('Verify the drawer shell elements are rendered', async () => {
      await pdpChatModule.verifyDrawerShell();
    });
  });

  test('@P1 @Regression TC-007: Minimize the open conversation drawer and restore the PDP chat box', async ({ pdpChatModule, pdpChatPage }) => {
    await test.step('Authenticate, open the PDP, and open the conversation drawer', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
      await pdpChatModule.expandChatFromStickyBar();
      await pdpChatModule.enterInitialPrompt(initialPrompt);
      await pdpChatModule.submitInitialPrompt();
    });

    await test.step('Minimize the drawer', async () => {
      await pdpChatModule.minimizeDrawer();
    });

    await test.step('Verify the PDP chat box is visible again', async () => {
      await expect(pdpChatPage.resumedChatBox()).toBeVisible();
    });
  });

  test('@P1 @Regression TC-009: Reopen the conversation drawer from the resumed chat box expand CTA', async ({ pdpChatModule }) => {
    await test.step('Authenticate, open the PDP, and minimize the conversation drawer', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
      await pdpChatModule.expandChatFromStickyBar();
      await pdpChatModule.enterInitialPrompt(initialPrompt);
      await pdpChatModule.submitInitialPrompt();
      await pdpChatModule.minimizeDrawer();
    });

    await test.step('Reopen the conversation drawer from the resumed chat box', async () => {
      await pdpChatModule.reopenDrawerFromResumedState();
    });

    await test.step('Verify the conversation drawer is visible again', async () => {
      await pdpChatModule.verifyLoadingStateDuringInitialization();
    });
  });

  test('@P1 @Regression TC-010: Block or ignore empty initial prompt submission from the PDP chat box', async ({ pdpChatModule }) => {
    await test.step('Authenticate and open the PDP for the target product', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
    });

    await test.step('Expand the sticky chat box without entering prompt text', async () => {
      await pdpChatModule.expandChatFromStickyBar();
    });

    await test.step('Verify empty prompt submission is blocked', async () => {
      await pdpChatModule.verifyEmptyPromptSubmissionBlocked();
    });
  });

  test('@P1 @Regression TC-011: Hide the PDP chat component for unauthenticated or ineligible users', async ({ pdpChatModule }) => {
    await test.step('Open the PDP as a guest user', async () => {
      await pdpChatModule.openGuestPdp(productId);
    });

    await test.step('Verify the PDP chat entry point is not displayed for a guest user', async () => {
      await pdpChatModule.verifyChatHiddenForGuest();
    });
  });

  test('@P2 @Regression TC-008: Show the resumed chat box state with resume text and expand CTA after minimize', async ({ pdpChatModule }) => {
    await test.step('Authenticate, open the PDP, and minimize the conversation drawer', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
      await pdpChatModule.expandChatFromStickyBar();
      await pdpChatModule.enterInitialPrompt(initialPrompt);
      await pdpChatModule.submitInitialPrompt();
      await pdpChatModule.minimizeDrawer();
    });

    await test.step('Verify the resumed chat box state is shown', async () => {
      await pdpChatModule.verifyResumedChatBoxState();
    });
  });

  test('@P2 @Regression TC-012: Show a visible loading state while the drawer conversation is initializing', async ({ pdpChatModule }) => {
    const generatedPrompt = `What is this product used for? ${DataGenerator.randomString(6)}`;

    await test.step('Authenticate and open the PDP for the target product', async () => {
      await pdpChatModule.loginAndOpenPdp(productId);
    });

    await test.step('Open the chat box and submit a unique prompt', async () => {
      await pdpChatModule.expandChatFromStickyBar();
      await pdpChatModule.enterInitialPrompt(generatedPrompt);
      await pdpChatModule.submitInitialPrompt();
    });

    await test.step('Verify the loading state is visible while the drawer initializes', async () => {
      await pdpChatModule.verifyLoadingStateDuringInitialization();
    });
  });
});

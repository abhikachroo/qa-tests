import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const validPrompt = 'Is this cable suitable for indoor installation?';
const whitespacePrompt = '   ';

test.describe(`@ProductChat @Search @PDP Product Search to PDP Chat Components — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke TC-005: Open chat drawer from confirm CTA and hide original PDP chat box', async ({
    productChatPdpModule,
  }) => {
    await test.step('Log in and navigate from search results to the product PDP', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
    });

    await test.step('Expand the sticky chat entry and type a valid prompt', async () => {
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
      await productChatPdpModule.expandChatEntry();
      await productChatPdpModule.verifyExpandedChatInputState();
      await productChatPdpModule.enterChatPrompt(validPrompt);
      await productChatPdpModule.verifyPromptRetainedAndConfirmVisible(validPrompt);
    });

    await test.step('Open the chat drawer and verify the original chat box is hidden', async () => {
      await productChatPdpModule.openChatDrawer();
      await productChatPdpModule.verifyChatDrawerOpened();
    });
  });

  test('@P0 @Smoke TC-002: Display sticky PDP chat bar for eligible logged-in users after PDP load', async ({
    productChatPdpModule,
  }) => {
    await test.step('Log in and navigate from search to the supported PDP', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
    });

    await test.step('Verify the sticky PDP chat bar is visible for the eligible authenticated user', async () => {
      await productChatPdpModule.verifyPdpAnchors();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
    });
  });

  test('@P1 @Functional TC-001: Search for a product and open a PDP that can host chat validation', async ({
    page,
    productChatPdpModule,
  }) => {
    await test.step('Submit a search and open the specific NEXANS product PDP', async () => {
      await productChatPdpModule.navigateToProductPdpFromSearch();
    });

    await test.step('Verify the PDP loads for the selected product', async () => {
      await productChatPdpModule.verifyPdpAnchors();
      await expect(page).toHaveURL(/\/catalog\/products\//);
    });
  });

  test('@P1 @Functional TC-003: Expand sticky PDP chat bar and show product prompt input state', async ({
    productChatPdpModule,
  }) => {
    await test.step('Log in and navigate to the PDP chat experience', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
    });

    await test.step('Expand the sticky chat entry and verify the prompt input state', async () => {
      await productChatPdpModule.expandChatEntry();
      await productChatPdpModule.verifyExpandedChatInputState();
    });
  });

  test('@P1 @Functional TC-004: Show confirmation CTA after the user types a chat prompt', async ({
    productChatPdpModule,
  }) => {
    await test.step('Log in, reach the PDP, and expand the chat entry', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
      await productChatPdpModule.expandChatEntry();
    });

    await test.step('Type a valid prompt and verify the confirmation CTA becomes available', async () => {
      await productChatPdpModule.enterChatPrompt(validPrompt);
      await productChatPdpModule.verifyPromptRetainedAndConfirmVisible(validPrompt);
    });
  });

  test('@P1 @Functional TC-006: Render required components inside the PDP chat drawer', async ({
    productChatPdpModule,
  }) => {
    await test.step('Log in, navigate to PDP, expand chat, and open the drawer', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
      await productChatPdpModule.expandChatEntry();
      await productChatPdpModule.enterChatPrompt(validPrompt);
      await productChatPdpModule.verifyPromptRetainedAndConfirmVisible(validPrompt);
      await productChatPdpModule.openChatDrawer();
    });

    await test.step('Verify the required chat drawer components are rendered', async () => {
      await productChatPdpModule.verifyChatDrawerOpened();
      await productChatPdpModule.verifyChatDrawerComponents();
    });
  });

  test('@P1 @Functional TC-007: Minimize drawer and restore the PDP chat box state', async ({
    page,
    productChatPdpModule,
  }) => {
    await test.step('Open the chat drawer from the PDP', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
      await productChatPdpModule.expandChatEntry();
      await productChatPdpModule.enterChatPrompt(validPrompt);
      await productChatPdpModule.verifyPromptRetainedAndConfirmVisible(validPrompt);
      await productChatPdpModule.openChatDrawer();
      await productChatPdpModule.verifyChatDrawerOpened();
    });

    await test.step('Minimize the drawer and verify the PDP chat box is restored without navigation', async () => {
      await productChatPdpModule.minimizeDrawer();
      await productChatPdpModule.verifyDrawerMinimizedAndChatRestored();
      await expect(page).toHaveURL(/\/catalog\/products\//);
    });
  });

  test('@P1 @Functional TC-009: Reopen the drawer from the restored expand CTA', async ({
    productChatPdpModule,
  }) => {
    await test.step('Open and minimize the chat drawer to reach the resume state', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
      await productChatPdpModule.expandChatEntry();
      await productChatPdpModule.enterChatPrompt(validPrompt);
      await productChatPdpModule.verifyPromptRetainedAndConfirmVisible(validPrompt);
      await productChatPdpModule.openChatDrawer();
      await productChatPdpModule.verifyChatDrawerOpened();
      await productChatPdpModule.minimizeDrawer();
      await productChatPdpModule.verifyDrawerMinimizedAndChatRestored();
      await productChatPdpModule.verifyResumeConversationState();
    });

    await test.step('Reopen the drawer from the restored resume CTA', async () => {
      await productChatPdpModule.reopenDrawerFromResumeState();
      await productChatPdpModule.verifyDrawerReopened();
    });
  });

  test('@P1 @Negative TC-010: Prevent chat entry point for logged-out users or users without the feature flag', async ({
    productChatPdpModule,
  }) => {
    await test.step('Navigate anonymously from search results to the PDP', async () => {
      await productChatPdpModule.navigateToProductPdpFromSearch();
    });

    await test.step('Verify chat entry points are not exposed for the anonymous PDP journey', async () => {
      await productChatPdpModule.verifyChatUnavailableForAnonymousUser();
    });
  });

  test('@P1 @Negative TC-011: Keep confirm CTA unavailable for empty or whitespace-only prompt submission', async ({
    productChatPdpModule,
  }) => {
    await test.step('Log in, navigate to PDP, and expand the chat entry', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
      await productChatPdpModule.expandChatEntry();
      await productChatPdpModule.verifyExpandedChatInputState();
    });

    await test.step('Enter whitespace-only input and verify confirmation CTA is unavailable', async () => {
      await productChatPdpModule.enterChatPrompt(whitespacePrompt);
      await productChatPdpModule.verifyConfirmUnavailableForWhitespacePrompt();
    });
  });

  test('@P2 @Functional TC-008: Show resume conversation state after drawer minimize', async ({
    productChatPdpModule,
  }) => {
    await test.step('Reach the restored chat state after minimizing the drawer', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
      await productChatPdpModule.expandChatEntry();
      await productChatPdpModule.enterChatPrompt(validPrompt);
      await productChatPdpModule.verifyPromptRetainedAndConfirmVisible(validPrompt);
      await productChatPdpModule.openChatDrawer();
      await productChatPdpModule.verifyChatDrawerOpened();
      await productChatPdpModule.minimizeDrawer();
      await productChatPdpModule.verifyDrawerMinimizedAndChatRestored();
    });

    await test.step('Verify the resume conversation state is visible and actionable', async () => {
      await productChatPdpModule.verifyResumeConversationState();
    });
  });

  test('@P2 @Negative TC-012: Show a recoverable loading state while drawer content initializes', async ({
    productChatPdpModule,
  }) => {
    await test.step('Open the drawer from the PDP chat flow', async () => {
      await productChatPdpModule.loginAndNavigateToProductPdp();
      await productChatPdpModule.verifyStickyChatBarVisibleForEligibleUser();
      await productChatPdpModule.expandChatEntry();
      await productChatPdpModule.enterChatPrompt(validPrompt);
      await productChatPdpModule.verifyPromptRetainedAndConfirmVisible(validPrompt);
      await productChatPdpModule.openChatDrawer();
    });

    await test.step('Verify the drawer loading indicators are rendered during initialization', async () => {
      await productChatPdpModule.verifyLoadingStateWhenVisible();
      await productChatPdpModule.verifyChatDrawerOpened();
    });
  });

  test('@P2 @Regression TC-013: Preserve product search usability when no results are returned', async ({
    searchModule,
  }) => {
    const unknownKeyword = config.noResultsKeyword || DataGenerator.randomString(12);

    await test.step('Navigate to the search results page with a no-results keyword', async () => {
      await searchModule.navigateToSearchResults(unknownKeyword);
    });

    await test.step('Verify the empty state is shown and no product cards are displayed', async () => {
      await searchModule.verifyNoResultsDisplayed();
    });
  });
});

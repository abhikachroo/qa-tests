import { expect }    from '@playwright/test';
import { SLDPage }   from '@pages/SLDPage';
import { Logger }    from '@utils/Logger';
import { config }    from '@config/index';

/**
 * SLDModule — business logic for the Single Line Diagram view.
 *
 * Validates that the SLD diagram correctly reflects workbench quantities.
 * All browser interaction goes through SLDPage methods.
 */
export class SLDModule {
  private logger: Logger;

  constructor(private sldPage: SLDPage) {
    this.logger = new Logger('SLDModule');
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  async navigateToSLD(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to SLD page`);
    await this.sldPage.navigate(config.sldPath ?? '/sld');
    await this.sldPage.waitForSLDLoaded();
    this.logger.info('SLD page loaded');
  }

  async waitForSLDReady(): Promise<void> {
    this.logger.info('Waiting for SLD diagram to be ready');
    await this.sldPage.waitForSLDLoaded();
    await expect(
      this.sldPage.sldDiagramContainer(),
      'SLD diagram container should be visible',
    ).toBeVisible();
    this.logger.info('SLD diagram ready');
  }

  // ── Quantity validation ──────────────────────────────────────────────────

  async verifyQuantityOnNode(nodeIndex: number, expectedQty: number): Promise<void> {
    this.logger.info(`Verifying SLD node ${nodeIndex} shows quantity ${expectedQty}`);
    const label = this.sldPage.quantityLabelOnNode(nodeIndex);
    await expect(
      label,
      `Quantity label on SLD node ${nodeIndex} should be visible`,
    ).toBeVisible();
    await expect(
      label,
      `SLD node ${nodeIndex} should display quantity "${expectedQty}"`,
    ).toContainText(String(expectedQty));
    this.logger.info(`SLD node ${nodeIndex} quantity verified: ${expectedQty}`);
  }

  async verifyRootNodeQuantity(expectedQty: number): Promise<void> {
    this.logger.info(`Verifying root SLD node quantity: ${expectedQty}`);
    await this.verifyQuantityOnNode(0, expectedQty);
  }

  async verifyEndOfBranchNodeQuantity(expectedQty: number): Promise<void> {
    this.logger.info(`Verifying end-of-branch SLD node quantity: ${expectedQty}`);
    const count = await this.sldPage.getSLDNodeCount();
    await this.verifyQuantityOnNode(count - 1, expectedQty);
  }

  async verifyMidBranchNodeQuantity(positionIndex: number, expectedQty: number): Promise<void> {
    this.logger.info(`Verifying mid-branch SLD node at ${positionIndex} quantity: ${expectedQty}`);
    await this.verifyQuantityOnNode(positionIndex, expectedQty);
  }

  async verifySLDNodeCount(expectedCount: number): Promise<void> {
    this.logger.info(`Verifying SLD node count: ${expectedCount}`);
    await expect(
      this.sldPage.allSLDNodes(),
      `SLD should render exactly ${expectedCount} nodes`,
    ).toHaveCount(expectedCount);
    this.logger.info(`SLD node count verified: ${expectedCount}`);
  }

  async verifyAllNodeQuantities(quantityMap: Record<number, number>): Promise<void> {
    this.logger.info('Cross-validating all SLD node quantities', quantityMap);
    for (const [indexStr, expectedQty] of Object.entries(quantityMap)) {
      await this.verifyQuantityOnNode(Number(indexStr), expectedQty);
    }
    this.logger.info('All SLD node quantities verified');
  }

  async verifySLDIsRendered(): Promise<void> {
    this.logger.info('Verifying SLD diagram is rendered');
    await expect(
      this.sldPage.sldDiagramContainer(),
      'SLD diagram container must be visible',
    ).toBeVisible();
    await expect(
      this.sldPage.allSLDNodes(),
      'SLD diagram must contain at least one product node',
    ).not.toHaveCount(0);
    this.logger.info('SLD diagram render verified');
  }
}

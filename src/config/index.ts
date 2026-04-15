import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

export interface EnvConfig {
  displayName: string;
  baseUrl: string;
  /** Path for search results, e.g. /catalog/en-gb/search */
  searchPath: string;
  noResultsKeyword: string;
  /** Full path to a known purchasable product PDP, e.g. /catalog/en-gb/products/{slug} */
  productPath: string;
  /** Path to the cart / basket page, e.g. /checkout/en-gb/ */
  cartPath: string;
}

const environment = (process.env.ENVIRONMENT ?? 'preprod').toLowerCase();
const opco        = process.env.OPCO ?? 'AUTH_POC';

// Resolves to: src/config/env/<environment>/<OPCO>/config.json
const configPath = path.join(__dirname, 'env', environment, opco, 'config.json');

if (!fs.existsSync(configPath)) {
  throw new Error(
    `No config found for ENVIRONMENT="${environment}" OPCO="${opco}".\n` +
    `Expected file: ${configPath}\n` +
    `Add a config.json at: src/config/env/${environment}/${opco}/config.json`,
  );
}

const envConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as EnvConfig;

export const config = {
  environment,
  opco,
  ...envConfig,
  logging: {
    level: process.env.LOG_LEVEL ?? 'INFO',
  },
};

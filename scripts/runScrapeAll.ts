import { SCRAPE_TYPES } from "./13F/13F.config";
import { ScrapeAll } from "./utils/ScrapeAll";


/**
 * runs ScrapeAll on CIKs and CUSIPs
 * 
 * @example
 * through package.json:
 * ```shell
 * yarn run scripts:scrape
 * ```
 */
export const run = async () => {
  await ScrapeAll(SCRAPE_TYPES.CIK);
  await ScrapeAll(SCRAPE_TYPES.CUSIP);
}

run();

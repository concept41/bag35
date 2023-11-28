import { SCRAPE_TYPES } from "./13F/13F.config";
import { IdentifyAll } from "./utils/IdentifyAll";

/**
 * runs IdentifyAll on CIKs and CUSIPs
 * 
 * @example
 * through package.json:
 * ```shell
 * yarn run scripts:identify
 * ```
 */
export const run = async () => {
  await IdentifyAll(SCRAPE_TYPES.CIK);
  await IdentifyAll(SCRAPE_TYPES.CUSIP);
}

run();

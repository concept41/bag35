import { SCRAPE_TYPES } from "./13F/13F.config";
import { IdentifyAll } from "./utils/IdentifyAll";


export const run = async () => {
  await IdentifyAll(SCRAPE_TYPES.CIK);
  await IdentifyAll(SCRAPE_TYPES.CUSIP);
}

run();

import { SCRAPE_TYPES } from "./13F/13F.config";
import { ScrapeAll } from "./utils/ScrapeAll";


export const run = async () => {
  await ScrapeAll(SCRAPE_TYPES.CIK);
  await ScrapeAll(SCRAPE_TYPES.CUSIP);
}

run();

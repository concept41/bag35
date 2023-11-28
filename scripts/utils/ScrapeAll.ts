import { SCRAPE_TYPES } from "../13F/13F.config"
import { getUnscrapedQuarters } from "./getUnscrapedQuarters"
import { ScrapeCIK } from "./ScrapeCIK";
import { ScrapeCUSIP } from "./ScrapeCUSIP";

/**
 * calls ScrapeCIK or ScrapeCUSIP for all unscraped quarters
 * 
 * @param scrapeType 
 */
export const ScrapeAll = async (scrapeType: SCRAPE_TYPES) => {
  console.log(`running ScrapeAll(${scrapeType})`);
  // get unscraped quarters
  const unscraped = getUnscrapedQuarters(scrapeType);
  // scrape them
  for(let i = 0; i < unscraped.length; i++) {
    const currQuarter = unscraped[i];
    console.log(`scraping for quarter ${currQuarter}`);
    switch(scrapeType) {
      case SCRAPE_TYPES.CIK:
        await ScrapeCIK(currQuarter);
        break;
      case SCRAPE_TYPES.CUSIP:
        await ScrapeCUSIP(currQuarter);
        break;
    }
  }

  console.log(`ScrapeAll(${scrapeType}) complete!`);
}

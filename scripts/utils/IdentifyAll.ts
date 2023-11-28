import { SCRAPE_TYPES } from "../13F/13F.config";
import { getScrapedQuarters } from "./getScrapedQuarters";
import { IdentifyCIK } from "./IdentifyCIK";
import { IdentifyCUSIP } from "./IdentifyCUSIP";


/**
 * runs IdentifyCIK or Identify CUSIP on scraped quarterly filings
 * 
 * @param scrapeType 
 */
export const IdentifyAll = async (scrapeType: SCRAPE_TYPES) => {
  console.log(`running IdentifyAll(${scrapeType})`);
  // get all scraped items
  const unidentified = getScrapedQuarters(scrapeType);
  // identify them
  for(let i = 0; i < unidentified.length; i++) {
    const currQuarter = unidentified[i];
    console.log(`identifiying for quarter ${currQuarter}`);
    switch(scrapeType) {
      case SCRAPE_TYPES.CIK:
        await IdentifyCIK(currQuarter);
        break;
      case SCRAPE_TYPES.CUSIP:
        await IdentifyCUSIP(currQuarter);
        break;
    }
  }

  console.log(`IdentifyAll(${scrapeType}) complete!`);
}

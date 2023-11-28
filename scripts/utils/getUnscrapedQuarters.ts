import { SCRAPE_TYPES } from "../13F/13F.config";
import { getQuarterlyDownloads } from "./getQuarterlyDownloads";
import { getScrapedQuarters } from "./getScrapedQuarters"


/**
 * 
 * @param scrapeType 
 * @returns an array of the names of quarterly filings that have not been scraped
 */
export const getUnscrapedQuarters = (scrapeType: SCRAPE_TYPES): string[] => {
  const scraped = new Set(getScrapedQuarters(scrapeType));
  const downloaded = getQuarterlyDownloads().map((fileName) => fileName.split('_')[0]);

  return downloaded.filter((quarter) => !scraped.has(quarter));
}

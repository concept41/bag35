import { SCRAPE_CONFIG, SCRAPE_TYPES } from "../13F/13F.config";
import { FSClient } from "./FSClient";

/**
 * 
 * @param scrapeType 
 * @returns an array of the names of quarterly filings that have been scraped
 */
export const getScrapedQuarters = (scrapeType: SCRAPE_TYPES): string[] => {
  return FSClient.getFilesInDir(SCRAPE_CONFIG.SCRAPED_WRITE_LOCATION)
    .filter(fileName => {
      return fileName.match(new RegExp(`RAW_${scrapeType}`, 'g'));
    })
    .map((scrapedFileName) => {
      const fileNameWithoutExtension = scrapedFileName.split('.')[0];
      const fileNameWithoutHeader = fileNameWithoutExtension.split('_')[2];

      return fileNameWithoutHeader;
    });
}

import { SCRAPE_CONFIG, SCRAPE_TYPES } from "../13F/13F.config";
import { FSClient } from "./FSClient";

export const getScrapedQuarters = (scrapeType: SCRAPE_TYPES) => {
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

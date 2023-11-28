import { SCRAPE_CONFIG } from "../13F/13F.config"
import { FSClient } from "./FSClient"

/**
 * 
 * @returns an array of the names of quarterly filings downloaded
 */
export const getQuarterlyDownloads = (): string[] => {
  return FSClient.getFilesInDir(SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION)
    .filter(fileName => {
      return fileName.match(SCRAPE_CONFIG.QUARTERLY_SUMMARY_NAME_FORMAT);
    });
}

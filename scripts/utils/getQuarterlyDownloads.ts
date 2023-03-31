import { SCRAPE_CONFIG } from "../13F/13F.config"
import { FSClient } from "./FSClient"


export const getQuarterlyDownloads = () => {
  return FSClient.getFilesInDir(SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION)
    .filter(fileName => {
      return fileName.match(SCRAPE_CONFIG.QUARTERLY_SUMMARY_NAME_FORMAT);
    });
}

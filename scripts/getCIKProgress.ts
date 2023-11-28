import { SCRAPE_TYPES } from "./13F/13F.config";
import { getQuarterlyDownloads } from "./utils/getQuarterlyDownloads";
import { getScrapedQuarters } from "./utils/getScrapedQuarters";

/**
 * for CIK, Logs the number of quarters processed, number of quarters with available data, and the quarters that have been completed
 * 
 * @example
 * through package.json:
 * ```shell
 * yarn run scripts:progress:scraped:CIK
 * ```
 * 
 */
export const getCIKProgress = () => {
  const listOfAllDownloads = getQuarterlyDownloads().map((downloadFolderName) => downloadFolderName.split('_')[0]);
  const listOfAllCompletedQuarters = getScrapedQuarters(SCRAPE_TYPES.CIK);
  
  console.log(`Progress: ${listOfAllCompletedQuarters.length}/${listOfAllDownloads.length}`);
  console.log('Completed quarters:')
  console.log(listOfAllCompletedQuarters);
}

getCIKProgress();

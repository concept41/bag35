import { SCRAPE_TYPES } from "./13F/13F.config";
import { getQuarterlyDownloads } from "./utils/getQuarterlyDownloads";
import { getScrapedQuarters } from "./utils/getScrapedQuarters";

export const getCUSIPProgress = () => {
  const listOfAllDownloads = getQuarterlyDownloads().map((downloadFolderName) => downloadFolderName.split('_')[0]);
  const listOfAllCompletedQuarters = getScrapedQuarters(SCRAPE_TYPES.CUSIP);
  
  console.log(`Progress: ${listOfAllCompletedQuarters.length}/${listOfAllDownloads.length}`);
  console.log('Completed quarters:')
  console.log(listOfAllCompletedQuarters);
}

getCUSIPProgress();

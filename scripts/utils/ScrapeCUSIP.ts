import { SCRAPE_CONFIG, QUARTERLY_SUMMARY_FILE_NAMES, COLUMN_NAMES } from '../13F/13F.config';
import { FSClient } from './FSClient';


export const ScrapeCUSIPWriteLocation = (quarter: string) => `${SCRAPE_CONFIG.SCRAPED_WRITE_LOCATION}/RAW_CUSIP_${quarter}_form13f.tsv`;

export const ScrapeCUSIP = (quarter: string) => {
  const writeLocation = ScrapeCUSIPWriteLocation(quarter);
  console.log('running ScrapeCUSIP()');
  console.log(`configured writeLocation: ${writeLocation}`);
  console.log('scraping...');
  const CUSIPs = FSClient.readSVIntoJson(`${SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION}/${quarter}_form13f/${QUARTERLY_SUMMARY_FILE_NAMES.INFOTABLE}`, '\t')
    .map((row: Record<string,string>) => row[COLUMN_NAMES.CUSIP])
    .reduce((acc, c) => {
      if(!c) {
        return acc;
      }
      return acc.add(c);
    }, new Set<string>());
  console.log('completed scraping!');
  console.log('writing...');
  FSClient.writeFile(writeLocation, new Array(...CUSIPs).join('\n'));
  console.log('completed writing!');
  console.log('ScrapeCUSIP() finished running');
}

import { SCRAPE_CONFIG, QUARTERLY_SUMMARY_FILE_NAMES, COLUMN_NAMES } from './13F/13F.config';
import { FSClient } from './utils/FSClient';


export const ScrapeCUSIPWriteLocation = `${SCRAPE_CONFIG.SCRAPED_WRITE_LOCATION}/RAW_CUSIP_${SCRAPE_CONFIG.SUMMARIES['2022Q4']}.tsv`;

export const ScrapeCUSIP = () => {
  console.log('running ScrapeCUSIP()');
  console.log(`configured writeLocation: ${ScrapeCUSIPWriteLocation}`);
  console.log('scraping...');
  const CUSIPs = FSClient.readSVIntoJson(`${SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION}//${SCRAPE_CONFIG.SUMMARIES['2022Q4']}/${QUARTERLY_SUMMARY_FILE_NAMES.INFOTABLE}`, '\t')
    .map((row: Record<string,string>) => row[COLUMN_NAMES.CUSIP])
    .reduce((acc, c) => {
      if(!c) {
        return acc;
      }
      return acc.add(c);
    }, new Set<string>());
    console.log('completed scraping!');
    console.log('writing...');
  FSClient.writeFile(ScrapeCUSIPWriteLocation, new Array(...CUSIPs).join('\n'));
  console.log('completed writing!');
  console.log('ScrapeCUSIP() finished running');
}

ScrapeCUSIP()
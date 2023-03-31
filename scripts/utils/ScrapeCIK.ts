import { SCRAPE_CONFIG, QUARTERLY_SUMMARY_FILE_NAMES, COLUMN_NAMES } from '../13F/13F.config';
import { FSClient } from './FSClient';

export const ScrapeCIKWriteLocation = (quarter: string) => `${SCRAPE_CONFIG.SCRAPED_WRITE_LOCATION}/RAW_CIK_${quarter}_form13f.tsv`;

export async function ScrapeCIK(quarter: string) {
  const writeLocation = ScrapeCIKWriteLocation(quarter);
  console.log('running ScrapeCIK()');
  console.log(`configured writeLocation: ${writeLocation}`);
  console.log('scraping...');
  // extract CIKs
  const CIKs = FSClient.readSVIntoJson(`${SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION}/${quarter}_form13f/${QUARTERLY_SUMMARY_FILE_NAMES.SUBMISSION}`, '\t')
    .reduce((acc: Set<string>, row: Record<string, string>) => {
      if (row[COLUMN_NAMES.CIK]) {
        return acc.add(row[COLUMN_NAMES.CIK]);
      }

      return acc;
    }, new Set<string>());
  console.log('completed scraping!');
  console.log('writing...');
  FSClient.writeFile(writeLocation, new Array(...CIKs).join('\n'));
  console.log('completed writing!');
  console.log('ScrapeCIK() finished running');
}

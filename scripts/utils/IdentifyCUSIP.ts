import { FIDELITY_CONFIG, SCRAPE_CONFIG } from '../13F/13F.config';
import { ScrapeCUSIPWriteLocation } from './ScrapeCUSIP';
import { curlAndExtract } from './curlAndExtract';
import { FSClient } from './FSClient';
import { sleep } from './sleep';

export const IdentifyCUSIPWriteLocation = `${SCRAPE_CONFIG.SCRAPED_WRITE_LOCATION}/IDENTIFIED_CUSIP.tsv`;

/**
 * identifies CUSIPs for a given quarter
 * 
 * @param quarter 
 */
export const IdentifyCUSIP = async (quarter: string) => {
  let CUSIPs = FSClient.readFile(ScrapeCUSIPWriteLocation(quarter)).split('\n');

  // Check if identification process has started
  if (FSClient.exists(IdentifyCUSIPWriteLocation)) {
    // remove identified CUSIPs
    // create a set of identified CUSIPs
    const identifiedCUSIPs = FSClient.readFile(IdentifyCUSIPWriteLocation).split('\n')
      .reduce((acc, c) => {
        if(!c) {
          return acc;
        }

        return acc.add(c.split('\t')[0]);
      }, new Set<string>());

      // filter CUSIPs
      CUSIPs = CUSIPs.filter(val => !identifiedCUSIPs.has(val));
  }

  
  const generateQueryFromCUSIP = (CUSIP: string) => `https://quotes.fidelity.com/mmnet/SymLookup.phtml?reqforlookup=REQUESTFORLOOKUP&productid=mmnet&isLoggedIn=mmnet&rows=50&for=stock&by=cusip&criteria=${CUSIP}&submit=Search`;
  const queryDelay = FIDELITY_CONFIG.THROTTLE;
  const regex = "SID_VALUE_ID=\\w+";
  const additonalProcessing = (match: string) => match.split('=')[1];

  const handleCUSIP = async (CUSIP: string) => {
    console.log(`looking up ticker for CUSIP [${CUSIP}]`);
    const ticker = await curlAndExtract(generateQueryFromCUSIP, CUSIP, regex, additonalProcessing);
    console.log(`ticker, [${ticker}] found for CUSIP [${CUSIP}]`);
    FSClient.appendFile(IdentifyCUSIPWriteLocation, `${CUSIP}\t${ticker}\n`);
    console.log('appended ticker to file');
    console.log(`queryDelay to throttle requests for ${queryDelay}ms`);
    await sleep(queryDelay * (1 + Math.random()));
  }

  for(let i = 0; i < CUSIPs.length; i++) {
    await handleCUSIP(CUSIPs[i]);
  }
}

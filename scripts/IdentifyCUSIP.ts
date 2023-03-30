import fetch from 'node-fetch';
import { FIDELITY_CONFIG, SCRAPE_CONFIG } from './13F/13F.config';
import { ScrapeCUSIPWriteLocation } from './ScrapeCUSIP';
import { FSClient } from './utils/FSClient';
import { sleep } from './utils/sleep';

const IdentifyCUSIPWriteLocation = `${SCRAPE_CONFIG.SCRAPED_WRITE_LOCATION}/IDENTIFIED_CUSIP_${SCRAPE_CONFIG.SUMMARIES['2022Q4']}.tsv`;

export const IdentifyCUSIP = async () => {
  let CUSIPs = FSClient.readFile(ScrapeCUSIPWriteLocation).split('\n');

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
  const queryDelay = FIDELITY_CONFIG.THROTTLE
  const extractTickerFromResponseText = (responseText: string) => {
    const match = responseText.match(/SID_VALUE_ID=\w+/g);
    if (!match) {
      return 'NO MATCH';
    }
    
    return match[0].split('=')[1];
  }
  const handleCUSIP = async (CUSIP: string) => {
    console.log(`looking up ticker for CUSIP [${CUSIP}]`);
    const queryString = generateQueryFromCUSIP(CUSIP);
    const responseText = await fetch(queryString).then(resp => resp.text());
    const ticker = extractTickerFromResponseText(responseText);
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

IdentifyCUSIP();

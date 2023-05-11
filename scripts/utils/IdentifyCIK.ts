import { EDGARCOMPANY_CONFIG, SCRAPE_CONFIG } from '../13F/13F.config';
import { ScrapeCIKWriteLocation } from './ScrapeCIK';
import { curlAndExtract } from './curlAndExtract';
import { FSClient } from './FSClient';
import { sleep } from './sleep';

export const IdentifyCIKWriteLocation = `${SCRAPE_CONFIG.SCRAPED_WRITE_LOCATION}/IDENTIFIED_CIK.tsv`;

export const IdentifyCIK = async (quarter: string) => {
  let CIKs = FSClient.readFile(ScrapeCIKWriteLocation(quarter)).split('\n');

  // Check if identification process has started
  if (FSClient.exists(IdentifyCIKWriteLocation)) {
    // remove identified CIKs
    // create a set of identified CIKs
    const identifiedCIKs = FSClient.readFile(IdentifyCIKWriteLocation).split('\n')
      .reduce((acc, c) => {
        if(!c) {
          return acc;
        }

        return acc.add(c.split('\t')[0]);
      }, new Set<string>());

      // filter CIKs
      CIKs = CIKs.filter(val => !identifiedCIKs.has(val));
  }
  
  const generateQueryFromCIK = (CIK: string) => `https://www.edgarcompany.sec.gov/servlet/CompanyDBSearch?start_row=-1&end_row=-1&main_back=1&cik=${CIK}&company_name=&reporting_file_number=&series_id=&series_name=&class_contract_id=&class_contract_name=&state_country=NONE&city=&state_incorporation=NONE&zip_code=&last_update_from=&last_update_to=&page=summary&submit_button=View+Summary`;
  const queryDelay = EDGARCOMPANY_CONFIG.THROTTLE;
  const regex = "cik=\\d+&m[^>]+>[^<]+<";
  const additonalProcessing = (match: string) => match.split('>')[1].split('<')[0]; // its gross but it works okay


  const handleCIK = async (CIK: string) => {
    console.log(`looking up entity for CIK [${CIK}]`);
    const entity = await curlAndExtract(generateQueryFromCIK, CIK, regex, additonalProcessing);
    console.log(`entity, [${entity}] found for CIK [${CIK}]`);
    FSClient.appendFile(IdentifyCIKWriteLocation, `${CIK}\t${entity}\n`);
    console.log('appended entity to file');
    console.log(`queryDelay to throttle requests for ${queryDelay}ms`);
    await sleep(queryDelay * (1 + Math.random()));
  }

  for(let i = 0; i < CIKs.length; i++) {
    await handleCIK(CIKs[i]);
  }
}

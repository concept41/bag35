import { QUARTERLY_SUMMARY_FILE_NAMES, SCRAPE_CONFIG } from "./13F/13F.config";
import { Neo4jClient } from "./neo4j/Neo4jClient";
import { FSClient } from "./utils/FSClient";
import { getQuarterlyDownloads } from "./utils/getQuarterlyDownloads";
import { time } from './utils/time';



export interface INFOTABLE_DATA {
  ACCESSION_NUMBER: string,
  INFOTABLE_SK: number,
  NAMEOFISSUER: string,
  TITLEOFCLASS: string,
  CUSIP: string,
  VALUE: number,
  SSHPRNAMT: number,
  SSHPRNAMTTYPE: string,
  PUTCALL: string,
  INVESTMENTDISCRETION: string,
  OTHERMANAGER: string,
  VOTING_AUTH_SOLE: number,
  VOTING_AUTH_SHARED: number,
  VOTING_AUTH_NONE: number
}

export interface Holding {
  INFOTABLE_SK: string,
  TITLEOFCLASS: string,
  VALUE: number,
  ShareAmount: number,
  ShareType: number,
  OptionType: number,
  VOTING_AUTH_SOLE: number,
  VOTING_AUTH_SHARED: number,
  VOTING_AUTH_NONE: number,
}

const IMPORT_RELATIVE_PATH = 'import'
const IMPORT_PATH = `${process.env.PATH_TO_NEO4J_ROOT}/${IMPORT_RELATIVE_PATH}`;
const escapePath = (path: string) => `\'${path}\'`

const untitledScript = async () => {
  const test_quarter = '2022q4_form13f';
  // do this for one quarter at a time
  // get location of original quarter
  const infotableFilePathFromFolderName = (folderName: string) => `${SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION}/${folderName}/${QUARTERLY_SUMMARY_FILE_NAMES.INFOTABLE}`;
  const sourceFilePath = infotableFilePathFromFolderName(test_quarter);
  // affirm that the file exists
  const sourceFilePathExists = FSClient.exists(sourceFilePath);
  if (!sourceFilePathExists) {
    throw new Error(`file does not exist at source, ${sourceFilePath}`);
  }
  // create file name for csv
  const destinationFileName = `${test_quarter}_infotable.csv`
  const destinationFilePath = `${IMPORT_PATH}/${destinationFileName}`;
  const destinationFileExists = FSClient.exists(escapePath(destinationFilePath));
  // check that file does not exist at import path
  if (destinationFileExists) {
    throw new Error(`file already exists at destination, ${destinationFilePath}`);
  }
  // read source file
  const sourceFile: INFOTABLE_DATA[] = FSClient.readSVIntoJson(sourceFilePath, '\t') as unknown as INFOTABLE_DATA[];
  // transform into destination file
  const destinationFile = sourceFile.map((row) => {
    console.log(row);
    const newRow =  Object.values(row).reduce((acc, value) => acc === '' ? `${value}` : `${acc},${value}`, '');
    console.log(newRow);
    return newRow;
  });
  // write destination


  // run loading query
  // delete csv?
}



export const holdingFromInfotableData = ({
  INFOTABLE_SK,
  TITLEOFCLASS,
  VALUE,
  SSHPRNAMT,
  SSHPRNAMTTYPE,
  PUTCALL,
  VOTING_AUTH_SOLE,
  VOTING_AUTH_SHARED,
  VOTING_AUTH_NONE
}: INFOTABLE_DATA) => {
  return {
    INFOTABLE_SK: INFOTABLE_SK,
    TITLEOFCLASS: TITLEOFCLASS,
    VALUE: VALUE,
    ShareAmount: SSHPRNAMT,
    ShareType: SSHPRNAMTTYPE,
    OptionType: PUTCALL,
    VOTING_AUTH_SOLE: VOTING_AUTH_SOLE,
    VOTING_AUTH_SHARED: VOTING_AUTH_SHARED,
    VOTING_AUTH_NONE: VOTING_AUTH_NONE,
  }
}

export const ingestHoldingsForQuarter = async (quarter: string) => {
  console.log(`running ingestHoldings(${quarter})`);
  console.log('creating Neo4j Client');
  const client = new Neo4jClient();
  const holdingQuery = (data: INFOTABLE_DATA): [string, Record<string, any>] => [
    ` MATCH (submission:SUBMISSION) WHERE submission.ACCESSION_NUMBER = $ACCESSION_NUMBER
      MATCH (security:SECURITY) WHERE security.CUSIP = $CUSIP
      MERGE (holding:HOLDING {INFOTABLE_SK: $INFOTABLE_SK})
      MERGE (submission)-[:DECLARES]->(holding)
      MERGE (holding)-[:OF]->(security)
      SET holding.TITLEOFCLASS = $TITLEOFCLASS,
        holding.VALUE = $VALUE,
        holding.TITLEOFCLASS = $TITLEOFCLASS,
        holding.VALUE = $VALUE,
        holding.ShareAmount = $ShareAmount,
        holding.ShareType = $ShareType,
        holding.OptionType = $OptionType,
        holding.VOTING_AUTH_SOLE = $VOTING_AUTH_SOLE,
        holding.VOTING_AUTH_SHARED = $VOTING_AUTH_SHARED,
        holding.VOTING_AUTH_NONE = $VOTING_AUTH_NONE
      RETURN true;
      `,
    {
      ...holdingFromInfotableData(data),
      ACCESSION_NUMBER: data.ACCESSION_NUMBER,
      CUSIP: data.CUSIP,
    }
  ];
  console.log('generating queries');
  const holdingQueries = FSClient.readSVIntoJson(`${SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION}/${quarter}/${QUARTERLY_SUMMARY_FILE_NAMES.INFOTABLE}`, '\t')
    .map((row: Record<string, string>) => holdingQuery(row as unknown as INFOTABLE_DATA));
  console.log('running queries');
  const startTime = time();
  for(const query of holdingQueries) {
    console.log(`ingesting holding with SK [${query[1].INFOTABLE_SK}]`)
    await client.write(...query);
  }
  const endTime = time();
  console.log(`queries finished in ${endTime - startTime}ms`);

  // await client.close();
  console.log(`ingestHoldingForQuarter(${quarter}) complete`);
}


/**
 * ingests holdings into neo4j nodes for all quarterly data
 * holdings indicate the ownershihp of a security by an investor
 * 
 * @example
 * through package.json:
 * ```shell
 * yarn run scripts:ingest:holdings
 * ```
 */
export const ingestHoldings = async () => {
  const quarters = getQuarterlyDownloads();
  for(const quarter of quarters) {
    await ingestHoldingsForQuarter(quarter);
  }
}

untitledScript();

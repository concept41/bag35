import { QUARTERLY_SUMMARY_FILE_NAMES, SCRAPE_CONFIG } from "./13F/13F.config";
import { Neo4jClient } from "./neo4j/Neo4jClient";
import { FSClient } from "./utils/FSClient";
import { getQuarterlyDownloads } from "./utils/getQuarterlyDownloads";


/**
 * ingests submissions into neo4j nodes.
 * submissions are quarterly, and associated with a filer. it has a unique ACCESSION_NUMBER, and a particular quarter that it is filed for
 * 
 * @example
 * through package.json:
 * ```shell
 * yarn run scripts:ingest:submissions
 * ```
 */
export const ingestSubmissions = async () => {
  // get all quarterly folders and convert to a map of quarter to submission file path
  const submissionFilePathFromFolderName = (folderName: string) => `${SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION}/${folderName}/${QUARTERLY_SUMMARY_FILE_NAMES.SUBMISSION}`;
  const folders = getQuarterlyDownloads()
    .map((folderName) => {
      // form of folderName is YYYYq#_form13f
      const year: number = parseInt(folderName.substring(0,4));
      const quarter: number = parseInt(folderName.substring(5,6));

      return {
        year,
        quarter,
        path: submissionFilePathFromFolderName(folderName),
      }
    });
  
    for(let idx = 0; idx < folders.length; idx++) {
      const { year, quarter, path } = folders[idx];
      console.log(`processing submission for ${year}q${quarter}`);
      await ingestSubmission(year, quarter, path);
      console.log(`finished processing submission for ${year}q${quarter}`);
    }
};


interface RawSubmission {
  ACCESSION_NUMBER: string,
  FILING_DATE: string,
  SUBMISSIONTYPE: string,
  CIK: string,
  PERIODOFREPORT: string,
}

interface Submission {
  ACCESSION_NUMBER: string,
  FILING_DATE: string,
  SUBMISSIONTYPE: string,
  CIK: string,
  PERIODOFREPORT: string,
  YEAR: number,
  QUARTER: number,
}

const ingestSubmission = async (year: number, quarter: number, path: string) => {
  const client = new Neo4jClient();
  const queries = FSClient.readSVIntoJson(path, '\t')
    .map((row) => {
      return {
        ...row,
        YEAR: year,
        QUARTER: quarter,
      }
    })
    .map((submission) => {
      const query = `
        MATCH (filer:FILER) WHERE filer.CIK = $CIK
        MERGE (filer)-[:FILES]->(submission:SUBMISSION {ACCESSION_NUMBER: $ACCESSION_NUMBER})
        SET submission.FILING_DATE = $FILING_DATE,
            submission.SUBMISSIONTYPE = $SUBMISSIONTYPE,
            submission.CIK = $CIK,
            submission.PERIODOFREPORT = $PERIODOFREPORT,
            submission.YEAR = $YEAR,
            submission.QUARTER = $QUARTER
        RETURN true;
      `
      

      return [
        query,
        submission,
      ] as [string, Record<string, string | number>]
    });

  for(let i = 0; i < queries.length; i++) {
    const query: [string, Record<string, string | number>] = queries[i];
    console.log(`processing query number ${i}:`);
    await client.write(...query);
    console.log(`successfully processed query number ${i}`);
  }
}

ingestSubmissions();

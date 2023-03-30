
import { SCRAPE_CONFIG, QUARTERLY_SUMMARY_FILE_NAMES, COLUMN_WITH_NAME_INFO, COLUMN_NAMES } from './13F/13F.config';
import { FSClient } from './utils/FSClient';

const accessionNumberToCIK = (accessionNumber: string) => {
  return accessionNumber.split('-')[0];
}

export async function ScrapeCIK() {
  // extract CIKs
  const CIKs = FSClient.readSVIntoJson(`${SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION}/${SCRAPE_CONFIG.SUMMARIES['2022Q4']}/${QUARTERLY_SUMMARY_FILE_NAMES.SUBMISSION}`, '\t')
    .reduce((acc: Set<string>, row: Record<string, string>) => {
      if (row[COLUMN_NAMES.CIK]) {
        return acc.add(row[COLUMN_NAMES.CIK]);
      }

      return acc;
    }, new Set<string>());
  // extract ACCESSION_NUMBER by NAME for files
  const filesWithNames = [
    QUARTERLY_SUMMARY_FILE_NAMES.COVERPAGE,
    QUARTERLY_SUMMARY_FILE_NAMES.INFOTABLE,
    QUARTERLY_SUMMARY_FILE_NAMES.OTHERMANAGER,
    QUARTERLY_SUMMARY_FILE_NAMES.OTHERMANAGER2,
  ];

  // extract names by CIKs
  const nameByCIK = {} as Record<string, Set<string>>;
  filesWithNames.forEach((fileName: string) => {
    const addNameToNameByCIK = (name: string, CIK: string) => {
      if (nameByCIK[CIK]) {
        nameByCIK[CIK].add(name);
      } else {
        nameByCIK[CIK] = new Set([name]);
      }
    }

    FSClient.readSVIntoJson(`${SCRAPE_CONFIG.QUARTERLY_SUMMARY_LOCATION}/${fileName}`, '\t').forEach((row: Record<string, string>) => {
      const fileNameWithoutExtension = fileName.split('.')[0];
      addNameToNameByCIK(
        row[COLUMN_WITH_NAME_INFO[fileNameWithoutExtension]],
        accessionNumberToCIK(row[COLUMN_NAMES.ACCESSION_NUMBER])
      );
    });
  });

  console.log(CIKs.size, Object.entries(nameByCIK).length);
  console.log('CIKs not found in submission list');
  Object.keys(nameByCIK).forEach(CIK => {
    if(!CIKs.has(CIK)) {
      console.log(CIK);
    }
  });
  console.log('CIKs only found in submission list');
  CIKs.forEach(cik => {
    if(!nameByCIK[cik]) {
      console.log(cik);
    }
  });
  console.log('CIKs found in both');
  Object.keys(nameByCIK).forEach(CIK => {
    if(CIKs.has(CIK)) {
      console.log(CIK);
    }
  });

  // compare stats
  // write somewhere
}

ScrapeCIK();

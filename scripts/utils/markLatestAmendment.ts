import { Neo4jClient } from "../neo4j/Neo4jClient"
import { FSClient } from "./FSClient";
import { IdentifyCIKWriteLocation } from "./IdentifyCIK";
import { time } from "./time";

const LATEST_AMENDMENT_QUERY = `
  // match submissions for a specific filer
  match (submission:SUBMISSION) where submission.CIK = $CIK
  with submission

  // order submissions by year and quarter
  order by submission.YEAR DESC, submission.QUARTER DESC

  // collect submissions by period of report
  with submission.PERIODOFREPORT as groupValue, COLLECT(submission) as submissionsPerPeriod

  // select top node as latest filing/amendment for the period
  WITH groupValue, HEAD(submissionsPerPeriod) AS topNode
  SET topNode:LATEST_AMENDMENT
  return topNode
`;

export const markLatestAmendmentForFiler = async (CIK: string) => {
  console.log(`running markLatestAmendmentForFiler(${CIK})`);
  console.log('creating Neo4j Client');
  const client = new Neo4jClient();
  const markLatestAmendmentQuery: [string, Record<string, string>] = [
    LATEST_AMENDMENT_QUERY,
    {
      CIK,
    }
  ];
  console.log('running query');
  const startTime = time();
  await client.write(...markLatestAmendmentQuery);
  const endTime = time();
  console.log(`query finished in ${endTime - startTime}ms`);

  await client.close();
  console.log('markLatestAmendmentForFiler() complete');
}

export const markLatestAmendmentForFilers = async () => {
  console.log(`running markLatestAmendmentForFilers()`);
  console.log('creating Neo4j Client');
  const client = new Neo4jClient();
  console.log('generating queries');
  const CIKs = FSClient.readFile(IdentifyCIKWriteLocation)
    .split('\n')
    .map(row => {
      const [ CIK ] = row.split('\t');

      return CIK;
    });
  console.log('running queries');
  const startTime = time();
  for(const CIK of CIKs) {
    await markLatestAmendmentForFiler(CIK);
  }
  const endTime = time();
  console.log(`all queries finished in ${endTime - startTime}ms`);

  await client.close();
  console.log('markLatestAmendmentForFilers() complete');
}

export const removeLatestAmendmentLabelForFiler = async (CIK: string) => {
  console.log(`running removeLatestAmendmentLabel(${CIK})`);
  console.log('creating Neo4j Client');
  const client = new Neo4jClient();
  const removeLabelQuery: [string, Record<string, string>] = [
    'MATCH (n:LATEST_AMENDMENT) WHERE CIK = $CIK REMOVE n:LATEST_AMENDMENT',
    {
      CIK,
    }
  ];
  console.log('running query');
  const startTime = time();
  await client.write(...removeLabelQuery);
  const endTime = time();
  console.log(`query finished in ${endTime - startTime}ms`);
  await client.close();
  console.log('removeLatestAmendmentLabel() complete');
}

export const removeLatestAmendmentLabelForFilers = async () => {
  console.log(`running removeLatestAmendmentLabelForFilers()`);
  console.log('creating Neo4j Client');
  const client = new Neo4jClient();
  const removeLabelQuery = 'MATCH (n:LATEST_AMENDMENT) REMOVE n:LATEST_AMENDMENT';
  console.log('running query');
  const startTime = time();
  await client.write(removeLabelQuery);
  const endTime = time();
  console.log(`query finished in ${endTime - startTime}ms`);
  await client.close();
  console.log('removeLatestAmendmentLabelForFilers() complete');
}

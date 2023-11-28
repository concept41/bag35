import { Neo4jClient } from "./neo4j/Neo4jClient";
import { DEFAULT_NO_MATCH_VAL } from "./utils/curlAndExtract";
import { FSClient } from "./utils/FSClient";
import { IdentifyCUSIPWriteLocation } from "./utils/IdentifyCUSIP";
import { time } from './utils/time';


/**
 * ingests equities into neo4j nodes.
 * equities are securities with a CUSIP identifier and a ticker
 * 
 * @example
 * through package.json:
 * ```shell
 * yarn run scripts:ingest:equities
 * ```
 */
export const ingestEquities = async () => {
  console.log('running ingestEquities()');
  console.log('creating Neo4j Client');
  const client = new Neo4jClient();
  const CUSIPQuery = (CUSIP: string, Ticker: string): [string, Record<string, string>] => [
    'MERGE (n:SECURITY:EQUITY {CUSIP: $CUSIP, Ticker: $Ticker})',
    {
      CUSIP,
      Ticker,
    }
  ];
  console.log('generating queries');
  const CUSIPQueries = FSClient.readFile(IdentifyCUSIPWriteLocation)
    .split('\n')
    .map(row => row.split('\t'))
    .filter(([_CUSIP, TickerValue]) => TickerValue !== DEFAULT_NO_MATCH_VAL)
    .map(([CUSIP, Ticker]) => CUSIPQuery(CUSIP, Ticker));
  
  console.log('running queries');
  const startTime = time();
  await Promise.all(CUSIPQueries.map((query) => client.write(...query)));
  const endTime = time();
  console.log(`queries finished in ${endTime - startTime}ms`);

  await client.close();
  console.log('ingestEquities() complete');
}

ingestEquities();

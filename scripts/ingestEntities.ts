import { Neo4jClient } from "./neo4j/Neo4jClient";
import { FSClient } from "./utils/FSClient";
import { IdentifyCIKWriteLocation } from "./utils/IdentifyCIK";
import { time } from './utils/time';

/**
 * ingests filers into neo4j nodes.
 * filers are financial entities with a CIK identifier
 * 
 * @example
 * through package.json:
 * ```shell
 * yarn run scripts:ingest:entities
 * ```
 */
export const ingestEntities = async () => {
  console.log('running ingestEntities()');
  console.log('creating Neo4j Client');
  const client = new Neo4jClient();
  const CIKQuery = (CIK: string, EntityName: string): [string, Record<string, string>] => [
    'MERGE (n:FILER {CIK: $CIK, Name: $EntityName})',
    {
      CIK,
      EntityName,
    }
  ];
  console.log('generating queries');
  const CIKQueries = FSClient.readFile(IdentifyCIKWriteLocation)
    .split('\n')
    .map(row => {
      const [CIK, EntityName] = row.split('\t');

      return CIKQuery(CIK, EntityName);
    });
  
  console.log('running queries');
  const startTime = time();
  await Promise.all(CIKQueries.map((query) => client.write(...query)));
  const endTime = time();
  console.log(`queries finished in ${endTime - startTime}ms`);

  await client.close();
  console.log('ingestEntities() complete');
}

ingestEntities();

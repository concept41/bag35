import { Neo4jClient } from "./neo4j/Neo4jClient";
import { FSClient } from "./utils/FSClient";
import { IdentifyCIKWriteLocation } from "./utils/IdentifyCIK";
import { measureTime } from './utils/measureTime';


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
  const startTime = measureTime();
  await Promise.all(CIKQueries.map((query) => client.write(...query)));
  const endTime = measureTime();
  console.log(`queries finished in ${endTime - startTime}ms`);

  await client.close();
  console.log('ingestEntities() complete');
}

ingestEntities();

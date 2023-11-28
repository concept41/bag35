import neo4j, { Driver, ResultSummary } from 'neo4j-driver';
import dotenv from 'dotenv';


dotenv.config();

const NEO4J_CONFIG = {
  SCHEME: process.env.NEO4J_SCHEME,
  HOST: process.env.NEO4J_HOST,
  PORT: process.env.NEO4J_PORT,
  USER: process.env.NEO4J_USER || '',
  PASSWORD: process.env.NEO4J_PASS || '',
}

export class Neo4jClient {
  private driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      `${NEO4J_CONFIG.SCHEME}://${NEO4J_CONFIG.HOST}:${NEO4J_CONFIG.PORT}`,
      neo4j.auth.basic(NEO4J_CONFIG.USER, NEO4J_CONFIG.PASSWORD)
    );
  }

  // sample response:
  // {
  //   records: [
  //     Record {
  //       keys: [Array],
  //       length: 1,
  //       _fields: [Array],
  //       _fieldLookup: [Object]
  //     }
  //   ],
  //   summary: ResultSummary {
  //     query: { text: 'CREATE (n) return n', parameters: {} },
  //     queryType: 'rw',
  //     counters: QueryStatistics { _stats: [Object], _systemUpdates: 0 },
  //     updateStatistics: QueryStatistics { _stats: [Object], _systemUpdates: 0 },
  //     plan: false,
  //     profile: false,
  //     notifications: [],
  //     server: ServerInfo {
  //       address: 'localhost:7687',
  //       agent: 'Neo4j/5.5.0',
  //       protocolVersion: 5.1
  //     },
  //     resultConsumedAfter: Integer { low: 7, high: 0 },
  //     resultAvailableAfter: Integer { low: 19, high: 0 },
  //     database: { name: 'neo4j' }
  //   }
  // }

  /**
   * writes query to neo4j
   * 
   * @param query
   * @param params 
   * @returns 
   */
  async write(query: string, params?: Record<string, unknown>): Promise<any> {
    let session;
    try {
      session = this.driver.session();
      return await session.executeWrite(tx => tx.run(query, params));
    } catch (err) {
      console.error(`Neo4jClient.write(${query}, ${JSON.stringify(params)}) failed:`);
      console.error(err);
    } finally {
      await session?.close();
    }
  }

  /**
   * executes read query from neo4j and returns results
   * 
   * @param query 
   * @returns 
   */
  async read(query: string): Promise<any> {
    let session;
    try {
      session = this.driver.session();
      return await session.executeRead(tx => tx.run(query));
    } catch (err) {
      console.error(`Neo4jClient.read(${query}) failed:`);
      console.error(err);
    } finally {
      await session?.close();
    }
  }

  /**
   * closes driver for neo4j client
   */
  async close(): Promise<void> {
    await this.driver.close();
  }

  /**
   * deletes all nodes in neo4j
   */
  async deleteAllNodes(): Promise<void> {
    await this.write( 'MATCH (n) DETACH DELETE n;');
  }
}

import { DEFAULT_NO_MATCH_VAL } from "./utils/curlAndExtract";
import { FSClient } from "./utils/FSClient";
import { IdentifyCUSIPWriteLocation } from "./utils/IdentifyCUSIP";

/**
 * Returns the number of CUSIPs identified by reading the identified CUSIP file
 * 
 * @returns the number of CUSIPs identified
 * 
 * @example
 * through package.json:
 * ```shell
 * yarn run scripts:metrics:matched:CUSIP
 * ```
 * 
 */
export const getMatchedCUSIP = (): number => {
  let identifiedCUSIPs = FSClient.readFile(IdentifyCUSIPWriteLocation).split('\n');

  return identifiedCUSIPs.filter(row => !row.includes(DEFAULT_NO_MATCH_VAL)).length;
}

console.log(getMatchedCUSIP());

import { DEFAULT_NO_MATCH_VAL } from "./utils/curlAndExtract";
import { FSClient } from "./utils/FSClient";
import { IdentifyCUSIPWriteLocation } from "./utils/IdentifyCUSIP";

export const getMatchedCUSIP = () => {
  let identifiedCUSIPs = FSClient.readFile(IdentifyCUSIPWriteLocation).split('\n');

  return identifiedCUSIPs.filter(row => !row.includes(DEFAULT_NO_MATCH_VAL)).length;
}

console.log(getMatchedCUSIP());

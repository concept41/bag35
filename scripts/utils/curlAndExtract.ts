import fetch from 'node-fetch';

export const DEFAULT_NO_MATCH_VAL = 'NO MATCH';

/**
 * curls a url, extracts text using regex, and processes it into a string
 * 
 * @param queryBuilder function that takes a string [param] and returns a URL to query
 * @param param for use in queryBuilder
 * @param regex used to extract text from response text
 * @param additonalProcessing function that takes a match from the [regex] and returns a string
 * @param noMatchValue optional default value when there is no match, defaults to [DEFAULT_NO_MATCH_VAL]
 * @returns Promise<string> that resolves as the extracted text
 */
export const curlAndExtract = async (
  queryBuilder: (param: string) => string,
  param: string,
  regex: string,
  additonalProcessing: (match: string) => string,
  noMatchValue: string = DEFAULT_NO_MATCH_VAL,
): Promise<string> => {
  const query = queryBuilder(param);
  const responseText = await fetch(query).then(resp => resp.text());
  const extractFromResponseText = (responseText: string) => {
    const match = responseText.match(new RegExp(regex, 'g'));
    if (!match) {
      return noMatchValue;
    }
    
    return additonalProcessing(match[0]);
  }

  return extractFromResponseText(responseText);
}

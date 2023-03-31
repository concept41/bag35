import fetch from 'node-fetch';

export const DEFAULT_NO_MATCH_VAL = 'NO MATCH';

export const curlAndExtract = async (
  queryBuilder: (param: string) => string,
  param: string,
  regex: string,
  additonalProcessing: (match: string) => string,
  noMatchValue: string = DEFAULT_NO_MATCH_VAL,
) => {
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

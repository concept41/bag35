import fetch from 'node-fetch';
import { EDGARCONFIG } from "./EDGAR.config";

export class EDGARClient {
  public helloWorld() {
    console.log('hello world');
  }

  public async get() {
    return fetch("https://www.sec.gov/Archives/Filings", {
      headers: EDGARCONFIG.EDGARRequestHeaders,
    }).then(response => response.text());
  }
}

// question 1: how do we tailor a search to get all companies that make 13f filings?
// question 2: how do we gather existing 13f filings?
// question 3: how do we continually update our site for 13f filings?
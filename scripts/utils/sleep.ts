/**
 * 
 * @param ms milliseconds for promise to return
 * @returns a promise that will wait for [ms] milliseconds, then return
 */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

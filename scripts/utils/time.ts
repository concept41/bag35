
/**
 * 
 * @returns time in ms
 */
export const time = (): number => {
  // returns in ms
  const [s, ns] = process.hrtime();
  const ms = s * Math.pow(10,3) + Math.floor(ns * Math.pow(10,-6));

  return ms;
}

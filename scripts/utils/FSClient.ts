import { appendFile, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, accessSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

export class FSClient {
  constructor() {
  }

  /**
   * used to resolve a path using a relative path from a directory
   * 
   * @param dirName 
   * @param relativePath 
   * @returns a string of the path relative to the passed [dirName]
   */
  public static path(dirName: string, relativePath: string): string {
    return path.resolve(path.join(dirName, relativePath));
  }

  /**
   * used to extract the containing directory of a given path
   * 
   * @param dirName 
   * @param relativePath 
   * @returns 
   */
  public static getContainingDirName(dirName: string, relativePath: string): string {
    const fullPath = this.path(dirName, relativePath).split('/');
    return fullPath[fullPath.length - 1];
  }

  /**
   * calls ls at the passed [relativePath] and returns the result
   * 
   * @param relativePath 
   * @returns a whitespace separated string of the files in a given path, [relativePath]
   */
  public static ls(relativePath: string): string {
    return execSync(`ls ${relativePath}`, { encoding: 'utf-8' });
  }

  /**
   * creates a directory at the passed [path]. returns false if the directory already exists
   * 
   * @param path 
   * @returns boolean, true if the directory was created
   */
  public static createDir(path: string): boolean {  
    if (!existsSync(path)) {
      mkdirSync(path);
      return true;
    }
  
    return false;
  }

  /**
   * returns an array of file names at the path, [path]
   * 
   * @param path 
   * @returns an array of the filenames in the directory at [path]
   */
  public static getFilesInDir(path: string): string[] {
    return readdirSync(path);
  }

  /**
   * reads the file at [path] into a string
   * 
   * @param path 
   * @returns a string containing the file's contents
   */
  public static readFile(path: string): string {
    return readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    })
  }

  /**
   * writes a file at [path] with contents [contents]
   * 
   * @param path 
   * @param contents 
   */
  public static writeFile(path: string, contents: string) {
    writeFileSync(path, contents, {
      encoding: 'utf8',
      flag: 'w',
    })
  }

  /**
   * checks if a file exists at the passed [path]
   * 
   * @param path 
   * @returns a boolean, true if the file exists at the passed [path]
   */
  public static exists(path: string): boolean {
    return existsSync(path);
  }

  /**
   * reads a _SV file into a json object
   * 
   * @param path
   * @param separator character used to separate values
   * @returns a record where the keys are the headers of the _SV file
   */
  public static readSVIntoJson(path: string, separator: string): Record<string, string>[] {
    const file = FSClient.readFile(path).split('\n');
    const headers = (file.shift() || 'no headers').split(separator);

    return file.map((line) => {
      const values = line.split(separator);

      return headers.reduce((acc, c, idx) => {
        return {
          ...acc,
          [c]: values[idx],
        }
      }, {});
    });
  }

  /**
   * appends [contents] to the file at [path]
   * 
   * @param path 
   * @param contents to append to the file at [path]
   * @param callback to call after the append is complete
   */
  public static appendFile(path: string, contents: string, callback: () => void = () => {}) {
    appendFile(path, contents, callback);
  }
}

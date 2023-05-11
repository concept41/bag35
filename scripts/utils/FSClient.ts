import { appendFile, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, accessSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

export class FSClient {
  constructor() {
  }

  public static path(dirName: string, relativePath: string) {
    return path.resolve(path.join(dirName, relativePath));
  }

  public static getContainingDirName(dirName: string, relativePath: string) {
    const fullPath = this.path(dirName, relativePath).split('/');
    return fullPath[fullPath.length - 1];
  }

  public static ls(relativePath: string) {
    return execSync(`ls ${relativePath}`, { encoding: 'utf-8' });
  }

  public static createDir(path: string) {  
    if (!existsSync(path)) {
      mkdirSync(path);
      return true;
    }
  
    return false;
  }

  public static getFilesInDir(path: string) {
    return readdirSync(path);
  }

  public static readFile(path: string) {
    return readFileSync(path, {
      encoding: 'utf8',
      flag: 'r',
    })
  }

  public static writeFile(path: string, contents: string) {
    writeFileSync(path, contents, {
      encoding: 'utf8',
      flag: 'w',
    })
  }

  public static exists(path: string) {
    return existsSync(path);
  }

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

  public static appendFile(path: string, contents: string, callback: () => void = () => {}) {
    appendFile(path, contents, callback);
  }
}

import { DESKTOP_PATH } from "@/constants";
import FileStats from "@/models/FileSystem/FileStats";
import {
  generateUniqueName,
  getFileExtensionFromName,
  getFileNameFromPath,
  getFileNameWithoutExtension,
} from "./fileSystemUtils";

export const createDirectory = (path: string, overwrite = false): Promise<any> => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.mkdir(path, { flag: overwrite ? "w" : "wx" }, (error: any) => (error ? reject(error) : resolve(true)));
  });
};

export const createFile = (path: string, text = "", encoding = "utf8"): Promise<any> => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.writeFile(path, text, encoding, (error: any) => {
      error && error.code !== "EEXIST" ? reject(error) : resolve(!error);
    });
  });
};

export const existsFile = (path: string): Promise<boolean> => {
  const fs = (window as any).fs;

  return new Promise((resolve) => {
    fs.exists(path, resolve);
  });
};

export const renameFile = (newFilePath: string, oldFilePath: string): Promise<any> => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.rename(oldFilePath, newFilePath, (error: any) => (error ? reject(error) : resolve(true)));
  });
};

export const deleteFile = (filePath: string): Promise<any> => {
  const fs = (window as any).fs;
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error: any) => (error ? reject(error) : resolve(true)));
  });
};

export const getFiles = async (path: string, fullPath = false): Promise<string[]> => {
  const fs = (window as any).fs;

  const filesPromise: string[] = await new Promise((resolve, reject) => {
    fs.readdir(path, (error: any, res: string[]) => (error ? reject(error) : resolve(res)));
  });

  if (fullPath) {
    return filesPromise.map((file) => path + "/" + file);
  }

  return filesPromise;
};

export const getDesktopFiles = (fullPath = false): Promise<string[]> => {
  return getFiles(DESKTOP_PATH, fullPath);
};

export const isDir = async (path: string): Promise<boolean> => {
  const fs = (window as any).fs;

  const fileStat: any = await new Promise((resolve, reject) => {
    fs.stat(path, (error: any, res: any) => (error ? reject(error) : resolve(res)));
  });

  return fileStat.isDirectory();
};

export const getStat = (path: string): Promise<FileStats> => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.stat(path, (error: any, res: FileStats) => (error ? reject(error) : resolve(res)));
  });
};

export const readFile = async (path: string, encoding = "utf8"): Promise<string> => {
  const fs = (window as any).fs;

  const fileToRead: any = await new Promise((resolve, reject) => {
    fs.readFile(path, (error: any, res: any) => (error ? reject(error) : resolve(res)));
  });

  return fileToRead.toString(encoding);
};

export const copyFile = async (filePath: string, destinationPath: string) => {
  //const fs = require("fs");

  const fileData = await readFile(filePath);
  const filesName = await getFiles(destinationPath, true);
  const nameToCheck = getFileNameWithoutExtension(destinationPath + "/" + getFileNameFromPath(filePath));
  const extension = getFileExtensionFromName(filePath);
  const uniqueFilePath = generateUniqueName(nameToCheck, filesName) + `.${extension}`;

  await createFile(uniqueFilePath, fileData);

  // CHECK THERE

  // create  a file should have the path and the buffer if not a directory
  // uniquePath = await createPath(
  //   newBasePath,
  //   directory,
  //   await readFile(entry)
  // );
};

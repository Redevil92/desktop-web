import FileStats from "@/models/FileSystem/FileStats";
import { reject } from "lodash";

export const createDirectory = (path: string, storage = ""): Promise<any> => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, (error: any) => (error ? reject(error) : resolve(true)));
  });
};

export const createFile = (path: string, text = "", encoding = "utf8") => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.writeFile(path, text, encoding, (error: any) => {
      error && error.code !== "EEXIST" ? reject(error) : resolve(!error);
    });
  });
};

export const renameFile = (newFilePath: string, oldFilePath: string) => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.rename(oldFilePath, newFilePath, (error: any) => (error: any) => error ? reject(error) : resolve(true));
  });
};

export const deleteFile = (filePath: string) => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error: any) => (error: any) => error ? reject(error) : resolve(true));
  });
};

export const getFiles = (path: string, fullPath = false): string[] => {
  const fs = (window as any).fs;

  const result: string[] = fs.readdirSync(path);
  if (fullPath) {
    return result.map((file) => path + "/" + file);
  }
  return result;
};

export const getDesktopFiles = (fullPath = false): string[] => {
  const desktopPath = "my PC/Desktop";
  return getFiles(desktopPath, fullPath);
};

export const isDir = (path: string): boolean => {
  const fs = (window as any).fs;
  const isDir = fs.statSync(path).isDirectory();
  return isDir;
};

export const getStat = (path: string): FileStats => {
  const fs = (window as any).fs;
  return fs.statSync(path);
};

export const readFile = (path: string, encoding = "utf8"): string => {
  const fs = (window as any).fs;
  const data: any = fs.readFileSync(path).toString(encoding).split("\n");

  return data;
};

// utilities
export const getFileNameFromPath = (filePath: string): string => {
  const filePaths = filePath.split("/");

  if (filePaths.length > 0) {
    return filePaths[filePaths.length - 1];
  }

  return "";
};

export const getFileExtensionFromName = (fileName: string): string => {
  const fileSplits = fileName.split(".");

  if (fileSplits.length > 0) {
    return fileSplits[fileSplits.length - 1];
  }
  return "";
};

export const getExtensionIcon = (extension: string, folderPath = "./src/assets/fileIcons"): string => {
  return folderPath + "/" + "icon-" + extension;
};

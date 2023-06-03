import FileStats from "@/models/FileSystem/FileStats";

export interface IFileSystem {
  createDirectory(path: string, overwrite?: boolean, overwriteIfSameName?: boolean): Promise<string>;
  createFile(path: string, text: string, encoding?: string, overwriteIfSameName?: boolean): Promise<string>;
  existsFile(path: string): Promise<boolean>;
  renameFile(newFilePath: string, oldFilePath: string): Promise<any>;
  getFiles(path: string, fullPath: boolean): Promise<string[]>;
  getDesktopFiles(fullPath: boolean): Promise<string[]>;
  isDir(path: string): Promise<boolean>;
  deleteFileSystemItem(path: string): Promise<void>;
  deleteFile(filePath: string): Promise<any>;
  deleteFolder(path: string): Promise<void>;
  deleteEmptyFolder(path: string): Promise<any>;
  getStat(path: string): Promise<FileStats>;
  readFile(path: string, encoding?: string): Promise<string>;
  copyFolder(filePath: string, destinationPath: string): Promise<void>;
  copyFile(filePath: string, destinationPath: string): Promise<void>;
  copyFileSystemItem(filePath: string, destinationPath: string): Promise<void>;
  moveFiles(filesToMove: string[], destinationPath: string, keepOriginal: boolean): Promise<void>;
  downloadFiles(filesPath: string[]): Promise<void>;
}

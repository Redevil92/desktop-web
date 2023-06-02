import { IFileSystem } from "./IFileSystem";
import { DESKTOP_PATH } from "@/constants";
import FileStats from "@/models/FileSystem/FileStats";
import {
  generateUniqueName,
  getFileExtensionFromName,
  getFileNameFromPath,
  getFileNameWithoutExtension,
  getSourcePathFromFilePath,
  MIME_TYPES,
} from "../fileSystemUtils";

export class BrowserFSFileSystem implements IFileSystem {
  ensureDirectoryExistence = async (filePath: string) => {
    const dirname = getSourcePathFromFilePath(filePath);

    if ((await this.existsFile(dirname)) || !dirname) {
      return true;
    }
    await this.ensureDirectoryExistence(dirname);
    await this.createDirectory(dirname);
  };

  createDirectory = async (path: string, overwrite = false, overwriteIfSameName = false): Promise<string> => {
    const fs = (window as any).fs;
    await this.ensureDirectoryExistence(path);
    let uniquePath = path;

    if (!overwriteIfSameName) {
      const exists = await this.existsFile(path);
      if (exists) {
        const destinationPathFileList = await this.getFiles(getSourcePathFromFilePath(path), true);
        uniquePath = generateUniqueName(path, destinationPathFileList);
      }
    }

    return new Promise((resolve, reject) => {
      fs.mkdir(uniquePath, { flag: overwrite ? "w" : "wx" }, (error: any) =>
        error ? reject(error) : resolve(uniquePath)
      );
    });
  };

  createFile = async (path: string, text = "", encoding = "utf8", overwriteIfSameName = true): Promise<string> => {
    const fs = (window as any).fs;
    await this.ensureDirectoryExistence(path);

    let uniqueFilePath = path;
    if (!overwriteIfSameName) {
      const exists = await this.existsFile(path);
      if (exists) {
        const destinationPathFileList = await this.getFiles(getSourcePathFromFilePath(path), true);
        uniqueFilePath = generateUniqueName(getFileNameWithoutExtension(path), destinationPathFileList);
        uniqueFilePath = uniqueFilePath + "." + getFileExtensionFromName(path);
      }
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(uniqueFilePath, text, encoding, (error: any) => {
        error && error.code !== "EEXIST" ? reject(error) : resolve(uniqueFilePath);
      });
    });
  };

  existsFile = (path: string): Promise<boolean> => {
    const fs = (window as any).fs;

    return new Promise((resolve) => {
      fs.exists(path, resolve);
    });
  };

  renameFile = (newFilePath: string, oldFilePath: string): Promise<any> => {
    const fs = (window as any).fs;

    return new Promise((resolve, reject) => {
      fs.rename(oldFilePath, newFilePath, (error: any) => (error ? reject(error) : resolve(true)));
    });
  };

  getFiles = async (path: string, fullPath = false): Promise<string[]> => {
    const fs = (window as any).fs;
    const filesPromise: string[] = await new Promise((resolve, reject) => {
      fs.readdir(path, (error: any, res: string[]) => (error ? reject(error) : resolve(res)));
    });

    if (fullPath) {
      return filesPromise.map((file) => path + "/" + file);
    }

    return filesPromise;
  };

  getDesktopFiles = (fullPath = false): Promise<string[]> => {
    return this.getFiles(DESKTOP_PATH, fullPath);
  };

  isDir = async (path: string): Promise<boolean> => {
    const fs = (window as any).fs;

    const fileStat: any = await new Promise((resolve, reject) => {
      fs.stat(path, (error: any, res: any) => (error ? reject(error) : resolve(res)));
    });

    return fileStat.isDirectory();
  };

  deleteFileSystemItem = async (path: string) => {
    const isFolder = await this.isDir(path);
    if (isFolder) {
      await this.deleteFolder(path);
    } else {
      await this.deleteFile(path);
    }
  };

  deleteFile = (filePath: string): Promise<any> => {
    const fs = (window as any).fs;
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (error: any) => (error ? reject(error) : resolve(true)));
    });
  };

  deleteFolder = async (path: string) => {
    const isFolder = await this.isDir(path);
    if (isFolder) {
      const dirContents = await this.getFiles(path, true);
      for (const content of dirContents) {
        await this.deleteFolder(content);
      }
      await this.deleteEmptyFolder(path);
    } else {
      this.deleteFile(path);
    }
  };

  deleteEmptyFolder = async (path: string) => {
    const fs = (window as any).fs;

    return new Promise((resolve, reject) => {
      fs.rmdir(path, (error: any, res: FileStats) => (error ? reject(error) : resolve(res)));
    });
  };

  getStat = (path: string): Promise<FileStats> => {
    const fs = (window as any).fs;

    return new Promise((resolve, reject) => {
      fs.stat(path, (error: any, res: FileStats) => (error ? reject(error) : resolve(res)));
    });
  };

  readFile = async (path: string, encoding = "utf8"): Promise<string> => {
    const fs = (window as any).fs;
    const fileToRead: any = await new Promise((resolve, reject) => {
      fs.readFile(path, (error: any, res: any) => (error ? reject(error) : resolve(res)));
    });

    return fileToRead.toString(encoding);
  };

  copyFolder = async (filePath: string, destinationPath: string) => {
    const destinationPathFileList = await this.getFiles(destinationPath);
    const uniqueFolderName = generateUniqueName(getFileNameFromPath(filePath), destinationPathFileList);
    const newFolderPath = destinationPath + "/" + uniqueFolderName;
    await this.createDirectory(newFolderPath);
    const filesName = await this.getFiles(filePath, true);
    for (const file of filesName) {
      await this.copyFileSystemItem(file, newFolderPath);
    }
  };

  copyFile = async (filePath: string, destinationPath: string) => {
    const fileData = await this.readFile(filePath);
    const filesName = await this.getFiles(destinationPath, true);

    const nameToCheck = getFileNameWithoutExtension(destinationPath + "/" + getFileNameFromPath(filePath));
    const extension = getFileExtensionFromName(filePath);
    const uniqueFilePath = generateUniqueName(nameToCheck, filesName) + `.${extension}`;

    await this.createFile(uniqueFilePath, fileData);
  };

  copyFileSystemItem = async (filePath: string, destinationPath: string) => {
    const isDirectory = await this.isDir(filePath);

    if (isDirectory) {
      await this.copyFolder(filePath, destinationPath);
    } else {
      await this.copyFile(filePath, destinationPath);
    }
  };

  moveFiles = async (filesToMove: string[], destinationPath: string, keepOriginal = false) => {
    for (const filePath of filesToMove) {
      // if (getSourcePathFromFilePath(filePath) === destinationPath) {
      //   break;
      // }

      await this.copyFileSystemItem(filePath, destinationPath);
      if (!keepOriginal) {
        await this.deleteFileSystemItem(filePath);
      }
    }
  };

  downloadFiles = async (filesPath: string[]) => {
    //TODO: if multiple filesPath -> create a zip file and then download
    for (const filePath of filesPath) {
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      let fileData = await this.readFile(filePath);

      if (!fileData.startsWith("data:")) {
        const mimeType = MIME_TYPES[getFileExtensionFromName(filePath)];
        fileData = `data:${mimeType};base64,${fileData}`;
      }

      downloadLink.href = fileData;
      downloadLink.target = "_self";
      downloadLink.download = getFileNameFromPath(filePath);
      downloadLink.click();
    }
  };
}

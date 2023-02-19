import { DESKTOP_PATH } from "@/constants";
import FileStats from "@/models/FileSystem/FileStats";
import {
  generateUniqueName,
  getFileExtensionFromName,
  getFileNameFromPath,
  getFileNameWithoutExtension,
  getSourcePathFromFilePath,
  MIME_TYPES,
} from "./fileSystemUtils";

const ensureDirectoryExistence = async (filePath: string) => {
  const dirname = getSourcePathFromFilePath(filePath);

  if ((await existsFile(dirname)) || !dirname) {
    return true;
  }
  console.log("creating dir", dirname);
  await ensureDirectoryExistence(dirname);
  await createDirectory(dirname);
};

export const createDirectory = async (
  path: string,
  overwrite = false,
  overwriteIfSameName = false
): Promise<string> => {
  const fs = (window as any).fs;
  await ensureDirectoryExistence(path);
  let uniquePath = path;

  if (!overwriteIfSameName) {
    const exists = await existsFile(path);
    if (exists) {
      const destinationPathFileList = await getFiles(getSourcePathFromFilePath(path), true);
      uniquePath = generateUniqueName(path, destinationPathFileList);
    }
  }

  return new Promise((resolve, reject) => {
    fs.mkdir(uniquePath, { flag: overwrite ? "w" : "wx" }, (error: any) =>
      error ? reject(error) : resolve(uniquePath)
    );
  });
};

export const createFile = async (
  path: string,
  text = "",
  encoding = "utf8",
  overwriteIfSameName = true
): Promise<string> => {
  const fs = (window as any).fs;
  await ensureDirectoryExistence(path);

  let uniqueFilePath = path;
  if (!overwriteIfSameName) {
    const exists = await existsFile(path);
    if (exists) {
      const destinationPathFileList = await getFiles(getSourcePathFromFilePath(path), true);
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

export const deleteFileSystemItem = async (path: string) => {
  const isFolder = await isDir(path);
  if (isFolder) {
    await deleteFolder(path);
  } else {
    await deleteFile(path);
  }
};

const deleteFile = (filePath: string): Promise<any> => {
  const fs = (window as any).fs;
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error: any) => (error ? reject(error) : resolve(true)));
  });
};

const deleteFolder = async (path: string) => {
  const isFolder = await isDir(path);
  if (isFolder) {
    const dirContents = await getFiles(path, true);
    for (const content of dirContents) {
      await deleteFolder(content);
    }
    await deleteEmptyFolder(path);
  } else {
    deleteFile(path);
  }
};

const deleteEmptyFolder = async (path: string) => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.rmdir(path, (error: any, res: FileStats) => (error ? reject(error) : resolve(res)));
  });
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

const copyFolder = async (filePath: string, destinationPath: string) => {
  const destinationPathFileList = await getFiles(destinationPath);
  const uniqueFolderName = generateUniqueName(getFileNameFromPath(filePath), destinationPathFileList);
  const newFolderPath = destinationPath + "/" + uniqueFolderName;
  await createDirectory(newFolderPath);
  const filesName = await getFiles(filePath, true);
  for (const file of filesName) {
    await copyFileSystemItem(file, newFolderPath);
  }
};

const copyFile = async (filePath: string, destinationPath: string) => {
  const fileData = await readFile(filePath);
  const filesName = await getFiles(destinationPath, true);

  const nameToCheck = getFileNameWithoutExtension(destinationPath + "/" + getFileNameFromPath(filePath));
  const extension = getFileExtensionFromName(filePath);
  const uniqueFilePath = generateUniqueName(nameToCheck, filesName) + `.${extension}`;

  await createFile(uniqueFilePath, fileData);
};

export const copyFileSystemItem = async (filePath: string, destinationPath: string) => {
  const isDirectory = await isDir(filePath);

  if (isDirectory) {
    await copyFolder(filePath, destinationPath);
  } else {
    await copyFile(filePath, destinationPath);
  }
};

export const moveFiles = async (filesToMove: string[], destinationPath: string, keepOriginal = false) => {
  for (const filePath of filesToMove) {
    if (getSourcePathFromFilePath(filePath) === destinationPath) {
      break;
    }

    await copyFileSystemItem(filePath, destinationPath);
    if (!keepOriginal) {
      await deleteFileSystemItem(filePath);
    }
  }
};

export const downloadFiles = async (filesPath: string[]) => {
  //TODO: if multiple filesPath -> create a zip file and then download
  for (const filePath of filesPath) {
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    let fileData = await readFile(filePath);
    console.log(fileData);

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

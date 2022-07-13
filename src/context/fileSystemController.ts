import FileStats from "@/models/FileSystem/FileStats";

export const createDirectory = (path: string): Promise<any> => {
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
    fs.rename(oldFilePath, newFilePath, (error: any) => (error ? reject(error) : resolve(true)));
  });
};

export const deleteFile = (filePath: string) => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error: any) => (error ? reject(error) : resolve(true)));
  });
};

export const getFiles = async (path: string, fullPath = false): Promise<string[]> => {
  const fs = (window as any).fs;

  const filesPromise: string[] = await new Promise((resolve, reject) => {
    fs.readdir(path, (error: any) => (error ? reject(error) : resolve([])));
  });

  if (fullPath) {
    return filesPromise.map((file) => path + "/" + file);
  }

  return filesPromise;
};

export const getDesktopFiles = async (fullPath = false): Promise<string[]> => {
  const desktopPath = "my PC/Desktop";
  return getFiles(desktopPath, fullPath);
};

export const isDir = async (path: string): Promise<boolean> => {
  const fs = (window as any).fs;

  const fileStat: any = await new Promise((resolve, reject) => {
    fs.stat(path, (error: any) => (error ? reject(error) : resolve([])));
  });

  return fileStat.isDirectory();
};

export const getStat = (path: string): Promise<FileStats> => {
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.stat(path, (error: any) => (error ? reject(error) : resolve({} as FileStats)));
  });
};

export const readFile = async (path: string, encoding = "utf8"): Promise<string> => {
  const fs = (window as any).fs;

  const fileToRead: any = await new Promise((resolve, reject) => {
    fs.readFile(path, (error: any) => (error ? reject(error) : resolve([])));
  });

  return fileToRead.toString(encoding).split("\n");
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

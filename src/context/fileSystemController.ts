import FileStats from "@/models/FileSystem/FileStats";

export const DESKTOP_PATH = "my PC/Desktop";

export const createDirectory = (path: string, overwrite = false): Promise<any> => {
  // mkdir: (path, overwrite = false) =>
  // new Promise((resolve, reject) => {
  //   fs?.mkdir(path, { flag: overwrite ? "w" : "wx" }, (error) =>
  //     error ? reject(error) : resolve(true)
  //   );
  // }),
  console.log("CREATING DIR", path);
  const fs = (window as any).fs;

  return new Promise((resolve, reject) => {
    fs.mkdir(path, { flag: overwrite ? "w" : "wx" }, (error: any) => (error ? reject(error) : resolve(true)));
  });
};

export const createFile = (path: string, text = "", encoding = "utf8"): Promise<any> => {
  const fs = (window as any).fs;
  console.log("CREATING FILE", path, fs);
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

export const copyFile = (filePath: string, destinationPath: string) => {
  //const fs = require("fs");

  console.log("need implementation");
  // create  a file should have the path and the buffer if not a directory
  // uniquePath = await createPath(
  //   newBasePath,
  //   directory,
  //   await readFile(entry)
  // );
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

export const getFilesAsync = (path: string, fullPath = false): string[] => {
  const fs = (window as any).fs;

  const result: string[] = fs.readdirSync(path);
  if (fullPath) {
    return result.map((file) => path + "/" + file);
  }
  return result;
};

export const getDesktopFiles = (fullPath = false): Promise<string[]> => {
  const desktopPath = "my PC/Desktop";
  return getFiles(desktopPath, fullPath);
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

  return fileToRead.toString(encoding).split("\n");
};

// utilities, TODO create a new file for utilities
export const getFileNameFromPath = (filePath: string): string => {
  const filePaths = filePath.split("/");

  if (filePaths.length > 0) {
    return filePaths[filePaths.length - 1];
  }

  return "";
};

export const getFileExtensionFromName = (filePath: string): string => {
  const fileName = getFileNameFromPath(filePath);
  if (fileName.includes(".")) {
    const splittedFile = fileName.split(".");
    return splittedFile[splittedFile.length - 1];
  }
  return "";
};

export const getExtensionIcon = (extension: string, folderPath = "./src/assets/fileIcons"): string => {
  return folderPath + "/" + "icon-" + extension;
};

export const getFileNameWithoutExtension = (path: string): string => {
  return path.replace(/\.[^/.]+$/, "");
};

export const testCreateFiles = async () => {
  //window.localStorage.clear();

  await createFile("newFile.txt");

  await createDirectory("my PC");

  await createFile("secondFile.txt", "my beautiful text");

  await createFile("my PC/mysecondFile.txt", "my beautiful text");

  await createDirectory("my PC/Desktop");

  await createFile("my PC/Desktop/file_desktop3.txt", "MY start text to test.");
  await createDirectory("my PC/Desktop/FOLDER");

  // base64 string
  // const img =
  //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0" +
  //   "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO" +
  //   "3gAAAABJRU5ErkJggg==";

  // await createFile("my PC/Desktop/image.png", img);

  //createFile("my PC/Desktop/FOLDER/new_file1.txt", "This is my text file.");
  await createFile("my PC/Desktop/FOLDER/mountain", "");

  await createDirectory("my PC/Desktop/FOLDER/sub directory");
  await createDirectory("my PC/Desktop/FOLDER/another sub directory");
  await createFile("my PC/Desktop/FOLDER/another sub directory/another file.txt", "This is my text file 2.");
};

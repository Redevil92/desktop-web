import FileStats from "@/models/FileSystem/FileStats";

export const DESKTOP_PATH = "my PC/Desktop";

export const createDirectory = (path: string, storage = ""): void => {
  const fs = (window as any).fs;
  try {
    fs.mkdir(storage + path, { recursive: true });
  } catch (error) {
    console.error(error);
  }
};

export const createFile = (path: string, text = "", encoding = "utf8") => {
  const fs = (window as any).fs;
  fs.writeFileSync(path, text, encoding, (err: any) => {
    if (err) {
      alert(err);
    }
  });
};

export const renameFile = (newFilePath: string, oldFilePath: string) => {
  const fs = (window as any).fs;
  fs.renameSync(oldFilePath, newFilePath);
};

export const deleteFile = (filePath: string) => {
  const fs = (window as any).fs;
  fs.unlinkSync(filePath);
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
  return getFiles(DESKTOP_PATH, fullPath);
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
  // path.parse(filename).name; //=> "hello"
  // path.parse(filename).ext; //=> ".html"
  // path.parse(filename).base;

  const fileSplits = fileName.split(".");

  if (fileSplits.length > 0) {
    return fileSplits[fileSplits.length - 1];
  }
  return "";
};

export const getExtensionIcon = (extension: string, folderPath = "./src/assets/fileIcons"): string => {
  return folderPath + "/" + "icon-" + extension;
};

export const getFileNameWithoutExtension = (path: string): string => {
  return path.replace(/\.[^/.]+$/, "");
};

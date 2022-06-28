import FileStats from "@/models/FileSystem/FileStats";

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

export const getFiles = (path: string, fullPath = false): string[] => {
  const fs = (window as any).fs;

  try {
    const result: string[] = fs.readdirSync(path);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
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

export const getFile = (path: string, encoding = "utf8"): ArrayBuffer => {
  const fs = (window as any).fs;
  const data: any = fs.readFileSync(path);

  return data;
};

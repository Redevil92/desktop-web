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

export const initializeFiles = async () => {
  console.log("CREATING ALL");
  await createFile("/newFile.txt", "mama");
  await createFile("/newFile2.txt", "mama");
  setTimeout(async () => {
    console.log("TRYING 0");
    const files = await getFiles("/");
    console.log("FILEEESSS!", files);
  }, 5000);
  // createFile("secondFile.txt", "my beautiful text");

  const fileRead = await readFile("newFile.txt");
  console.log("File:", fileRead);

  console.log("TRYING", window);

  await createDirectory("my PC");
  // await createDirectory("my PC1");
  // await createDirectory("my PC2");
  // await createDirectory("my PC3");
  // await createDirectory("my PC4");
  // await createDirectory("my PC5");
  // await createDirectory("my PC6");
  // await createDirectory("my PC7");
  // await createDirectory("my PC8");
  // await createDirectory("my PC9");
  // await createDirectory("my PC11");

  // await createFile("my PC/mysecondFile.txt", "my beautiful text");

  await createDirectory("my PC/Desktop");

  await createFile("my PC/Desktop/file_desktop3.txt", "MY start text to test.");

  // await createDirectory("my PC/Desktop/FOLDER");

  // await createFile("my PC/Desktop/FOLDER/new_file1.txt", "This is my text file.");
  // await createFile("my PC/Desktop/FOLDER/mountain.jpg", "");
  // await createFile("my PC/Desktop/FOLDER/new_file2.txt", "This is my text file 2.");
  // await createDirectory("my PC/Desktop/FOLDER/sub directory");
  // await createDirectory("my PC/Desktop/FOLDER/another sub directory");
  // await createFile("my PC/Desktop/FOLDER/another sub directory/another file.txt", "This is my text file 2.");
};

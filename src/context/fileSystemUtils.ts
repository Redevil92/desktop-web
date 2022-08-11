import { createDirectory, createFile } from "./fileSystemController";

export const generateUniqueName = (nameWithoutExtension: string, nameList: string[]) => {
  let myName = nameWithoutExtension;
  let currentIndex = 0;
  let isUnique = false;
  while (!isUnique && currentIndex < 100) {
    isUnique = nameList.findIndex((name) => getFileNameWithoutExtension(name) === myName) === -1;

    if (!isUnique) {
      currentIndex++;
      myName = `${nameWithoutExtension} (${currentIndex})`;
    }
  }
  return myName;
};

export const getFileNameFromPath = (filePath: string): string => {
  const filePaths = filePath.split("/");

  if (filePaths.length > 0) {
    return filePaths[filePaths.length - 1];
  }

  return "";
};

export const getSourcePathFromFilePath = (filePath: string): string => {
  const splittedFile = filePath.split("/");
  if (splittedFile.length > 0) {
    splittedFile.pop();
    return splittedFile.join("/");
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

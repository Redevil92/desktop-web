import { extractFilesInFolder } from "./actionsList";

export const compressedFileActions = async (filePath: string) => await [extractFilesInFolder(filePath)];

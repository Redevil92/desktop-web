import { extractFilesInFolder } from "./ActionsList";

export const compressedFileActions = async (filePath: string) => await [extractFilesInFolder(filePath)];

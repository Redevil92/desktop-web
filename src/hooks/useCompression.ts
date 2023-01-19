import * as fflate from "fflate";
import useBase64Handler from "@/hooks/useBase64Handler";
import { getFileExtensionFromName, MIME_TYPES } from "@/context/fileSystemUtils";
import { TEMP_PATH } from "@/constants";
import PathAndContent from "@/models/PathAndContent";

export default function useCompression() {
  const { removeDataUri, uint8ArrayToBase64 } = useBase64Handler();

  const decompressFile = (compressedFile: string) => {
    const buf = Buffer.from(removeDataUri(compressedFile), "base64");
    const decompressedFiles = fflate.unzipSync(buf);
    return decompressedFiles;
  };

  const getContentsFromDecompressedFile = (decompressedFiles: fflate.Unzipped) => {
    const decompressedFilesName = Object.keys(decompressedFiles);
    const pathsAndContent: PathAndContent[] = [];
    decompressedFilesName.forEach(async (fileName) => {
      const mimeType = MIME_TYPES[getFileExtensionFromName(fileName)];
      const base64File = `data:${mimeType};base64,${uint8ArrayToBase64(decompressedFiles[fileName])}`;
      const filePath = `${TEMP_PATH}/${fileName}`;
      const pathAndContent: PathAndContent = { path: filePath, content: base64File };
      pathsAndContent.push(pathAndContent);
    });
    return pathsAndContent;
  };

  return { decompressFile, getContentsFromDecompressedFile };
}

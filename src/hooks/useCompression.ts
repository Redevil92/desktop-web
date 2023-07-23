import * as fflate from "fflate";
import useBase64Handler from "@/hooks/useBase64Handler";
import { getFileExtensionFromName, MIME_TYPES } from "@/context/utils/fileSystemUtils";
import { TEMP_PATH } from "@/constants";
import PathAndContent from "@/models/PathAndContent";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default function useCompression() {
  const { removeDataUri, uint8ArrayToBase64, base64ToUint8Array } = useBase64Handler();

  const decompressFile = (compressedFile: string) => {
    const buf = Buffer.from(removeDataUri(compressedFile), "base64");
    const decompressedFiles = fflate.unzipSync(buf);
    return decompressedFiles;
  };

  const getContentsFromDecompressedFile = (decompressedFile: fflate.Unzipped) => {
    const decompressedFilesName = Object.keys(decompressedFile);
    const pathsAndContent: PathAndContent[] = [];
    decompressedFilesName.forEach(async (fileName) => {
      const mimeType = MIME_TYPES[getFileExtensionFromName(fileName)];
      const base64File = `data:${mimeType};base64,${uint8ArrayToBase64(decompressedFile[fileName])}`;
      const filePath = `${TEMP_PATH}/${fileName}`;
      const pathAndContent: PathAndContent = { path: filePath, content: base64File };
      pathsAndContent.push(pathAndContent);
    });
    return pathsAndContent;
  };

  const saveDecompressedFilesToDestination = async (
    decompressedFile: fflate.Unzipped,
    destinationPath: string
  ): Promise<string[]> => {
    const fileSystemStore = useFileSystemStore();

    const decompressedFilesName = Object.keys(decompressedFile);
    const pathAndContentList: PathAndContent[] = [];
    for (const fileName of decompressedFilesName) {
      const mimeType = MIME_TYPES[getFileExtensionFromName(fileName)];
      const base64File = `data:${mimeType};base64,${uint8ArrayToBase64(decompressedFile[fileName])}`;
      const filePath = `${destinationPath}/${fileName}`;
      const pathAndContent: PathAndContent = { path: filePath, content: base64File };
      pathAndContentList.push(pathAndContent);
      await fileSystemStore.createFile(pathAndContent, false);
    }

    return pathAndContentList.map((item) => item.path);
  };

  const compressToZipFile = async (filesToZip: { fileName: string; contentBase64: string }[]) => {
    const zippabble: fflate.Zippable = {};
    filesToZip.forEach((file) => {
      const uint8 = base64ToUint8Array(removeDataUri(file.contentBase64));
      zippabble[file.fileName] = uint8;
    });
    const zippedFile = await fflate.zipSync(zippabble);
    return uint8ArrayToBase64(zippedFile);
  };

  // const extractFiles = (compressedFile: string, destinationPath: string) => {};

  return { decompressFile, getContentsFromDecompressedFile, saveDecompressedFilesToDestination, compressToZipFile };
}

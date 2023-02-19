import { TEMP_PATH } from "@/constants";
import useBase64Handler from "@/hooks/useBase64Handler";
import { saveDesktopFilePosition } from "@/hooks/useLocalStorage";
import { existsFile, createDirectory, createFile } from "./fileSystemController";

const readLocalFile = async (filePath: string) => {
  const { blobToBase64 } = useBase64Handler();

  const response = await fetch(filePath);
  const dataAsBlob = await response.blob();
  return await blobToBase64(dataAsBlob);
};

export const createFilesStructure = async () => {
  const exists = await existsFile("my PC");
  if (!exists) {
    await createDirectory("my PC");
    await createDirectory(TEMP_PATH); // needed for zip files
    await createDirectory("my PC/Desktop");
    await createDirectory("my PC/Documents");
    await createDirectory("my PC/Start Menu");
    await createDirectory("my PC/Pictures");
    await createDirectory("my PC/Music");
    await createDirectory("my PC/Videos");

    try {
      const pdfElement = (await readLocalFile("./files/CV-Stefano Badalucco.pdf")) as string;
      await createFile("my PC/Desktop/CV-Stefano_Badalucco.pdf", pdfElement, "utf8", false);
      saveDesktopFilePosition("my PC/Desktop/CV-Stefano_Badalucco.pdf", { x: 0, y: 0 });

      const videoElement = (await readLocalFile("./files/Climbing.mp4")) as string;
      await createFile("my PC/Desktop/Climbing.mp4", videoElement, "utf8", false);
      saveDesktopFilePosition("my PC/Desktop/Climbing.mp4", { x: 0, y: 220 });

      await createDirectory("my PC/Desktop/About me");
      saveDesktopFilePosition("my PC/Desktop/About me", { x: 0, y: 110 });

      let imageData = (await readLocalFile("./files/ClimbingArco.jpeg")) as string;
      await createFile("my PC/Desktop/About me/ClimbingArco.jpeg", imageData, "utf8", false);

      imageData = (await readLocalFile("./files/30....jpeg")) as string;
      await createFile("my PC/Desktop/About me/30....jpeg", imageData, "utf8", false);

      imageData = (await readLocalFile("./files/Olivia.jpeg")) as string;
      await createFile("my PC/Desktop/About me/Olivia.jpeg", imageData, "utf8", false);

      imageData = (await readLocalFile("./files/Me&Olivia.jpeg")) as string;
      await createFile("my PC/Desktop/About me/Me&Olivia.jpeg", imageData, "utf8", false);
    } catch (error) {
      console.error("Error loading assets.");
    }
  }
};

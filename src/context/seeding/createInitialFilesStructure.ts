import { TEMP_PATH } from "@/constants";
import useBase64Handler from "@/hooks/useBase64Handler";
import { saveDesktopFilePosition } from "@/hooks/useLocalStorage";
import LinkData from "@/models/LinkData";
import fileSystem from "@/context/fileSystemController";

export const createFilesStructure = async () => {
  const exists = await fileSystem.existsFile("my PC");

  if (!exists) {
    await fileSystem.createDirectory("my PC");
    await fileSystem.createDirectory(TEMP_PATH); // needed for zip files
    await fileSystem.createDirectory("my PC/Desktop");
    await fileSystem.createDirectory("my PC/Documents");
    await fileSystem.createDirectory("my PC/Start Menu");
    await fileSystem.createDirectory("my PC/Program Files");
    await fileSystem.createDirectory("my PC/Pictures");
    await fileSystem.createDirectory("my PC/Pictures/Wallpapers");
    await fileSystem.createDirectory("my PC/Music");
    await fileSystem.createDirectory("my PC/Videos");

    try {
      const browserElement: LinkData = { fileTypeToOpen: "browser" };
      await fileSystem.createFile(
        "my PC/Desktop/Browser.lnk",
        JSON.stringify(browserElement),
        "utf8",
        false
      );
      saveDesktopFilePosition("my PC/Desktop/Browser.lnk", { x: 120, y: 0 });

      const dukeNuken: LinkData = { fileTypeToOpen: "Duke Nukem 3D" };
      await fileSystem.createFile(
        "my PC/Desktop/Duke Nukem 3D.lnk",
        JSON.stringify(dukeNuken),
        "utf8",
        false
      );
      saveDesktopFilePosition("my PC/Desktop/Duke Nukem 3D.lnk", {
        x: 120,
        y: 110,
      });

      const taxCalculator: LinkData = { fileTypeToOpen: "dutiesTaxCalculator" };
      await fileSystem.createFile(
        "my PC/Desktop/Duties tax calculator.lnk",
        JSON.stringify(taxCalculator),
        "utf8",
        false
      );
      saveDesktopFilePosition("my PC/Desktop/Duties tax calculator.lnk", {
        x: 240,
        y: 0,
      });

      const videoElement = (await readLocalFile(
        "./files/Climbing.mp4"
      )) as string;
      await fileSystem.createFile(
        "my PC/Desktop/Climbing.mp4",
        videoElement,
        "utf8",
        false
      );
      saveDesktopFilePosition("my PC/Desktop/Climbing.mp4", { x: 0, y: 220 });

      const resume = (await readLocalFile(
        "./files/resume_stefano_badalucco.pdf"
      )) as string;
      await fileSystem.createFile(
        "my PC/Desktop/resume_stefano_badalucco.pdf",
        resume,
        "ASCII",
        false
      );
      saveDesktopFilePosition("my PC/Desktop/resume_stefano_badalucco.pdf", {
        x: 0,
        y: 320,
      });

      await fileSystem.createDirectory("my PC/Desktop/About me");
      saveDesktopFilePosition("my PC/Desktop/About me", { x: 0, y: 110 });

      let imageData = (await readLocalFile(
        "./files/ClimbingArco.jpeg"
      )) as string;
      await fileSystem.createFile(
        "my PC/Desktop/About me/ClimbingArco.jpeg",
        imageData,
        "utf8",
        false
      );

      imageData = (await readLocalFile("./files/30....jpeg")) as string;
      await fileSystem.createFile(
        "my PC/Desktop/About me/30....jpeg",
        imageData,
        "utf8",
        false
      );

      imageData = (await readLocalFile("./files/Olivia.jpeg")) as string;
      await fileSystem.createFile(
        "my PC/Desktop/About me/Olivia.jpeg",
        imageData,
        "utf8",
        false
      );

      imageData = (await readLocalFile("./files/Me&Olivia.jpeg")) as string;
      await fileSystem.createFile(
        "my PC/Desktop/About me/Me&Olivia.jpeg",
        imageData,
        "utf8",
        false
      );

      // populate wallpaper images
      imageData = (await readLocalFile("./wallpapers/mountain.png")) as string;
      await fileSystem.createFile(
        "my PC/Pictures/Wallpapers/mountain.png",
        imageData,
        "utf8",
        false
      );

      imageData = (await readLocalFile("./wallpapers/mountain2.jpg")) as string;
      await fileSystem.createFile(
        "my PC/Pictures/Wallpapers/mountain2.jpg",
        imageData,
        "utf8",
        false
      );

      imageData = (await readLocalFile("./wallpapers/mountain3.png")) as string;
      await fileSystem.createFile(
        "my PC/Pictures/Wallpapers/mountain3.png",
        imageData,
        "utf8",
        false
      );
    } catch (error) {
      console.error("Error loading assets.");
    }
  }
};

const readLocalFile = async (filePath: string) => {
  const { blobToBase64 } = useBase64Handler();

  const response = await fetch(filePath);
  const dataAsBlob = await response.blob();
  return await blobToBase64(dataAsBlob);
};

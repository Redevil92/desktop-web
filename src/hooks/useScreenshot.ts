import html2canvas from "html2canvas";
import Coordinates from "@/models/Coordinates";
import Dimension from "@/models/Dimension";

export default function useScreenshot(htmlElement: HTMLElement | undefined) {
  //   const filePathsToMove = computed((): string[] => {
  //     return fileSystemStore.filePathsToMove;
  //   });

  const takeScreenshot = (htmlElement: HTMLElement, startCoordinates: Coordinates, dimension: Dimension) => {
    console.log("STARTING SCRE", htmlElement);

    html2canvas(htmlElement).then((canvas) => {
      const base64image = canvas.toDataURL("image/png");
      const a = document.createElement("a"); //Create <a>
      a.href = base64image; //Image Base64 Goes here
      a.download = "Image.png"; //File name Here
      a.click(); //Downloaded file

      //   const croppedCanvas: HTMLCanvasElement = document.createElement("canvas"),
      //     croppedCanvasContext = croppedCanvas.getContext("2d");

      //   if (croppedCanvas && croppedCanvasContext) {
      //     console.log("SCREEEEMSHOT");
      //     croppedCanvasContext.drawImage(canvas, 0, 0, 1500, 1500, 0, 0, 1500, 1500);

      //     const imageUrl = croppedCanvas.toDataURL();
      //     console.log(imageUrl);

      //     const a = document.createElement("a"); //Create <a>
      //     a.href = imageUrl; //Image Base64 Goes here
      //     a.download = "Image.png"; //File name Here
      //     a.click(); //Downloaded file
      //   }
    });
  };

  return {
    takeScreenshot,
  };
}

import html2canvas from "html2canvas";
import { saveItemPreviewInSessionStorage } from "@/hooks/useSessionStorage";

export const takeAndSaveItemPreviewScreenshot = (htmlElement: HTMLElement, itemPath: string) => {
  html2canvas(htmlElement).then((canvas) => {
    const base64image = canvas.toDataURL("image/png");
    // const a = document.createElement("a"); //Create <a>
    // a.href = base64image; //Image Base64 Goes here
    // a.download = "Image.png"; //File name Here
    // a.click(); //Downloaded file

    saveItemPreviewInSessionStorage(base64image, itemPath);
  });
};

export const takeAndSaveItemPreviewScreenshotByItemGuid = (itemGuid: string, itemPath: string) => {
  const htmlElement = document.getElementById(itemGuid) || undefined;
  if (htmlElement) {
    takeAndSaveItemPreviewScreenshot(htmlElement, itemPath);
  }
};

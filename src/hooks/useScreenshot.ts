import html2canvas from "html2canvas";

export default function useScreenshot(htmlElement: HTMLElement | undefined) {
  const takeScreenshot = (htmlElement: HTMLElement) => {
    html2canvas(htmlElement).then((canvas) => {
      const base64image = canvas.toDataURL("image/png");
      const a = document.createElement("a"); //Create <a>
      a.href = base64image; //Image Base64 Goes here
      a.download = "Image.png"; //File name Here
      a.click(); //Downloaded file
    });
  };

  return {
    takeScreenshot,
  };
}

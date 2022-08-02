import { request } from "http";

export const dowloadWithProgress = (myUrl: string, fileName: string) => {
  const startTime = new Date().getTime();

  const request = new XMLHttpRequest();

  request.responseType = "blob";
  request.open("get", myUrl, true);
  request.send();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const imageURL = window.URL.createObjectURL(this.response);

      const anchor = document.createElement("a");
      anchor.href = imageURL;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
    }
  };

  request.onprogress = function (e) {
    const percentComplete = Math.floor((e.loaded / e.total) * 100);

    const duration = (new Date().getTime() - startTime) / 1000;
    const bps = e.loaded / duration;

    const kbps = Math.floor(bps / 1024);

    const time = (e.total - e.loaded) / bps;
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);

    console.log(`${percentComplete}% - ${kbps} Kbps - ${minutes} min ${seconds} sec remaining`);
  };
};

export default function useBase64Handler() {
  const b64ToText = (
    base64Data: string,
    shouldRemoveDataUri = false
  ): string => {
    const textToDecrypt = shouldRemoveDataUri
      ? removeDataUri(base64Data)
      : base64Data;
    return decodeURIComponent(escape(window.atob(textToDecrypt)));
  };

  const b64ToBlob = (b64Data: string, contentType = "", sliceSize = 512) => {
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const utf8ToB64 = (str: string) => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };

  const blobToBase64 = (blob: Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const removeDataUri = (str: string) => {
    return str.split(",").pop() || "";
  };

  const getDataUri = (str: string) => {
    return str.split(",").shift() || "";
  };

  const isBase64 = (str: string) => {
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(str);
  };

  const uint8ArrayToBase64 = (uint8Array: Uint8Array) => {
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  };

  const base64ToUint8Array = (base64: string) => {
    const binaryString = window.atob(removeDataUri(base64));
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const uint8: Uint8Array = new Uint8Array(bytes.buffer);
    return uint8;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as base64"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.readAsDataURL(file);
    });
  };

  const base64ToArrayBuffer = (base64: string) => {
    console.log("base64", isBase64(removeDataUri(base64)));
    const binaryString = window.atob(removeDataUri(base64));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  return {
    b64ToText,
    utf8ToB64,
    removeDataUri,
    getDataUri,
    isBase64,
    uint8ArrayToBase64,
    base64ToUint8Array,
    b64ToBlob,
    blobToBase64,
    fileToBase64,
    base64ToArrayBuffer,
  };
}

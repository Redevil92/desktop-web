export default function useBase64Handler() {
  const b64ToText = (base64Data: string, shouldRemoveDataUri = false): string => {
    const textToDecrypt = shouldRemoveDataUri ? removeDataUri(base64Data) : base64Data;
    return decodeURIComponent(escape(window.atob(textToDecrypt)));
  };

  const utf8ToB64 = (str: string) => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };

  const removeDataUri = (str: string) => {
    return str.split(",").pop() || "";
  };

  const getDataUri = (str: string) => {
    return str.split(",").shift() || "";
  };

  const isBase64 = (str: string) => {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
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

  return {
    b64ToText,
    utf8ToB64,
    removeDataUri,
    getDataUri,
    isBase64,
    uint8ArrayToBase64,
    base64ToUint8Array,
  };
}

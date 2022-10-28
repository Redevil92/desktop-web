export default function useBase64Handler() {
  const b64ToText = (base64Data: string, shouldRemoveDataUri = false): string => {
    const textToDecrypt = shouldRemoveDataUri ? removeDataUri(base64Data) : base64Data;
    return decodeURIComponent(escape(window.atob(textToDecrypt)));
  };

  const utf8_to_b64 = (str: string) => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };

  const removeDataUri = (str: string) => {
    return str.substr(str.indexOf(",") + 1);
  };

  return {
    b64ToText,
    utf8_to_b64,
    removeDataUri,
  };
}

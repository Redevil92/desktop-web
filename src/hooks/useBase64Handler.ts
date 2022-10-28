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

  const isBase64 = (str: string) => {
    console.log(str, "kajkjakajk");
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    console.log("OH GG", str, base64regex.test(str));
    return base64regex.test(str);
    // try {
    //   window.atob(str);
    //   return true;
    // } catch (e) {
    //   console.log("HERE IN THE EX");
    //   return false;
    // }
  };

  return {
    b64ToText,
    utf8_to_b64,
    removeDataUri,
    isBase64,
  };
}

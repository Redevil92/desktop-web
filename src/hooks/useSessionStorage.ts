export const saveItemPreviewInSessionStorage = (base64image: string, itemName: string) => {
  const retrievedObject = sessionStorage.getItem("previewItemImages");
  let previewItemImages = {} as any;
  if (retrievedObject) {
    previewItemImages = JSON.parse(retrievedObject);
  }

  previewItemImages[itemName] = base64image;

  localStorage.setItem("previewItemImages", JSON.stringify(previewItemImages));
};

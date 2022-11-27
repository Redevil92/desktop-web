export const saveItemPreviewInSessionStorage = (base64image: string, itemPath: string) => {
  const retrievedObject = sessionStorage.getItem("previewItemImages");
  let previewItemImages = {} as PreviewItem;
  if (retrievedObject) {
    previewItemImages = JSON.parse(retrievedObject);
  }

  previewItemImages[itemPath] = base64image;
  console.log(previewItemImages);
  sessionStorage.setItem("previewItemImages", JSON.stringify(previewItemImages));
};

export const removeItemPreviewInSessionStorage = (itemPath: string) => {
  const retrievedObject = sessionStorage.getItem("previewItemImages");
  let previewItemImages = {} as PreviewItem;
  if (retrievedObject) {
    previewItemImages = JSON.parse(retrievedObject);
  }

  delete previewItemImages[itemPath];
  sessionStorage.setItem("previewItemImages", JSON.stringify(previewItemImages));
};

export const getPreviewImageFromSessionStorage = (itemPath: string) => {
  console.log("IM HERE", itemPath);
  const retrievedObject = sessionStorage.getItem("previewItemImages");
  let previewItemImages = {} as PreviewItem;
  if (retrievedObject) {
    previewItemImages = JSON.parse(retrievedObject);
  }

  return previewItemImages[itemPath];
};

type PreviewItem = {
  [key: string]: string;
};

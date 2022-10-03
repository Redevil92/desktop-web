import Coordinates from "@/models/Coordinates";
import DesktopItem from "@/models/DesktopItem";

export const getDesktopFilesPositionFromLocalStorage = (): { [path: string]: Coordinates } => {
  const retrievedObject = localStorage.getItem("desktopItemsPositions");

  let desktopItemsPositions = {} as { [path: string]: Coordinates };
  if (retrievedObject) {
    desktopItemsPositions = JSON.parse(retrievedObject);
  }

  return desktopItemsPositions;
};

export const saveDesktopFilePosition = async (desktopItemPath: string, coordinates: Coordinates) => {
  const retrievedObject = localStorage.getItem("desktopItemsPositions");
  let desktopItemsPositions = {} as any;
  if (retrievedObject) {
    desktopItemsPositions = JSON.parse(retrievedObject);
  }

  desktopItemsPositions[desktopItemPath] = coordinates;
  localStorage.setItem("desktopItemsPositions", JSON.stringify(desktopItemsPositions));
};

export const renameDesktopFileInLocalStorage = async (oldName: string, newName: string) => {
  const retrievedObject = localStorage.getItem("desktopItemsPositions");
  let desktopItemsPositions = {} as { [path: string]: Coordinates };

  if (retrievedObject) {
    desktopItemsPositions = JSON.parse(retrievedObject);

    const itemCoordinates = desktopItemsPositions[oldName];
    delete desktopItemsPositions[oldName];
    desktopItemsPositions[newName] = itemCoordinates;
  }

  localStorage.setItem("desktopItemsPositions", JSON.stringify(desktopItemsPositions));
};

export const saveSelectedDesktopItemsPositionInLocalStorage = (desktopItems: DesktopItem[]) => {
  const retrievedObject = localStorage.getItem("desktopItemsPositions");
  let desktopItemsPositions = {} as any;
  if (retrievedObject) {
    desktopItemsPositions = JSON.parse(retrievedObject);
  }

  desktopItems.forEach((item) => {
    desktopItemsPositions[item.path] = item.coordinates;
  });

  localStorage.setItem("desktopItemsPositions", JSON.stringify(desktopItemsPositions));
};

import Coordinates from "@/models/Coordinates";

export default function useLocalStorage() {
  const saveDesktopFilePosition = async (desktopItemPath: string, coordinates: Coordinates) => {
    const retrievedObject = localStorage.getItem("desktopItemsPositions");
    let desktopItemsPositions = {} as any;
    if (retrievedObject) {
      desktopItemsPositions = JSON.parse(retrievedObject);
    }

    desktopItemsPositions[desktopItemPath] = coordinates;
    localStorage.setItem("desktopItemsPositions", JSON.stringify(desktopItemsPositions));
  };

  const getDesktopFilesPositionFromLocalStorage = () => {
    const retrievedObject = localStorage.getItem("desktopItemsPositions");

    let desktopItemsPositions = {} as { [path: string]: Coordinates };
    if (retrievedObject) {
      desktopItemsPositions = JSON.parse(retrievedObject);
    }

    return desktopItemsPositions;
  };

  return {
    saveDesktopFilePosition,
    getDesktopFilesPositionFromLocalStorage,
  };
}

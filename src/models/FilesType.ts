// Add application to open
// Have just one action in the store to open

import Dimension from "./Dimension";

const imageType: FileType = {
  background: "#222",
  singleton: false,
  allowResizing: true,
  defaultSize: {
    height: 432,
    width: 576,
  },
  minSize: {
    height: 100,
    width: 220,
  },
  icon: "png.svg",
  title: "Photos",
  application: "ImageFileItem",
  canOpenWithoutFile: false,
};

const textType: FileType = {
  singleton: false,
  allowResizing: true,
  background: "#222",
  defaultSize: {
    height: 480,
    width: 760,
  },
  minSize: {
    height: 100,
    width: 220,
  },
  application: "TextFileItem",
  title: "New text file",
  icon: "txt.svg",
  canOpenWithoutFile: true,
};

const audioType: FileType = {
  singleton: false,
  allowResizing: true,
  background: "#222",
  defaultSize: {
    height: 480,
    width: 760,
  },
  minSize: {
    height: 100,
    width: 220,
  },
  application: "audioItem/AudioPlayer",
  title: "New text file",
  icon: "music.svg",
  canOpenWithoutFile: false,
};

const codeType = (codeExt: string): FileType => {
  return {
    singleton: false,
    allowResizing: true,
    background: "#222",
    defaultSize: {
      height: 480,
      width: 550,
    },
    minSize: {
      height: 100,
      width: 220,
    },
    icon: `code.svg`,
    title: "",
    application: "codeItem/CodeFileItem",
    canOpenWithoutFile: false, // TODO implement this functionality
  };
};

const dosType = (gameName: string, icon?: string): FileType => {
  return {
    background: "rgb(82, 86, 89)",
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 480,
      width: 760,
    },
    minSize: {
      height: 400,
      width: 650,
    },
    title: `${gameName}`,
    icon: icon ? icon : `${gameName}.png`,
    application: "dosItem/DosPlayer",
    canOpenWithoutFile: true,
    canRepeatInAppList: true,
  };
};

type FileTypes = {
  [key: string]: FileType;
};

const fileTypesConfiguration: FileTypes = {
  // devTools: {
  //   background: "rgb(36, 36, 36)",
  //   allowResizing: true,
  //   defaultSize: {
  //     height: 380,
  //     width: 545,
  //   },
  //   minSize: {
  //     height: 100,
  //     width: 220,
  //   },
  //   icon: "/System/Icons/eruda.webp",
  //   singleton: true,
  //   title: "DevTools",
  // },
  dir: {
    background: "rgb(82, 86, 89)",
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 480,
      width: 640,
    },
    minSize: {
      height: 300,
      width: 520,
    },
    icon: "folder.svg",
    title: "Directory",
    application: "FolderItem",
    canOpenWithoutFile: false,
  },
  browser: {
    background: "rgb(82, 86, 89)",
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 500,
      width: 860,
    },
    minSize: {
      height: 400,
      width: 650,
    },
    title: "Browser",
    icon: "browser.svg",
    application: "BrowserItem",
    canOpenWithoutFile: true,
  },
  settings: {
    background: "rgb(82, 86, 89)",
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 480,
      width: 760,
    },
    minSize: {
      height: 400,
      width: 650,
    },
    title: "Settings",
    icon: "settings.svg",
    application: "SystemSettings",
    canOpenWithoutFile: true,
  },
  txt: textType,
  text: textType,
  // FileExplorer: {
  //   background: "#202020",
  //   icon: "FOLDER_ICON",
  //   title: "File Explorer",
  // },
  html: codeType("html"),
  js: codeType("js"),
  ts: codeType("ts"),
  css: codeType("css"),
  pdf: {
    allowResizing: true,
    singleton: false,
    background: "rgb(82, 86, 89)",
    defaultSize: {
      height: 480,
      width: 640,
    },
    minSize: {
      height: 300,
      width: 520,
    },
    icon: "pdf.svg",
    title: "PDF",
    application: "PdfItem",
    canOpenWithoutFile: false, // TODO implement this functionality
  },
  mp3: audioType,
  mp4: audioType,
  png: imageType,
  jpg: imageType,
  jpeg: imageType,
  svg: imageType,
  Doom: dosType("Doom"),
  "WarCraft- Orcs & Humans": dosType("WarCraft- Orcs & Humans"),
  "Duke Nukem 3D": dosType("Duke Nukem 3D"),
  "Sim City": dosType("Sim City"),
  "Prince of Persia": dosType("Prince of Persia"),
  "Grand Theft Auto": dosType("Grand Theft Auto"),
  "Mortal Kombat": dosType("Mortal Kombat"),
  // run: {
  //   allowResizing: false,
  //   defaultSize: {
  //     height: 174,
  //     width: 397,
  //   },
  //   minSize: {
  //     height: 100,
  //     width: 220,
  //   },
  //   hideMaximizeButton: true,
  //   hideMinimizeButton: true,
  //   icon: "/System/Icons/run.webp",
  //   initialRelativePosition: {
  //     bottom: "TASKBAR_HEIGHT" + 11,
  //     left: 15,
  //   },
  //   singleton: true,
  //   title: "Run",
  // },
  // terminal: {
  //   background: "rgba(12, 12, 12, 0.5)",
  //   defaultSize: {
  //     height: 340,
  //     width: 553,
  //   },
  //   minSize: {
  //     height: 100,
  //     width: 220,
  //   },
  //   icon: "/System/Icons/xterm.webp",
  //   lockAspectRatio: true,
  //   title: "Terminal",
  // },

  // transferDialog: {
  //   allowResizing: false,
  //   background: "#FFF",
  //   defaultSize: {
  //     height: 163,
  //     width: 400,
  //   },
  //   minSize: {
  //     height: 100,
  //     width: 220,
  //   },
  //   icon: "/System/Icons/copying.webp",
  //   title: "Dialog",
  // },
};

export default fileTypesConfiguration;

export interface FileType {
  allowResizing: boolean;
  background: string;
  defaultSize: Dimension;
  minSize: Dimension;
  icon: string;
  title: string;
  singleton: boolean;
  application: string;
  canOpenWithoutFile: boolean;
  canRepeatInAppList?: boolean;
}

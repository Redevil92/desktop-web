// Add application to open
// Have just one action in the store to open

const imageType = {
  background: "#222",
  defaultSize: {
    height: 432,
    width: 576,
  },
  minSize: {
    height: 100,
    width: 220,
  },
  hideTitlebarIcon: true,
  icon: "png.svg",
  prependTaskbarTitle: true,
  title: "Photos",
  application: "ImageFileItem",
};

const textType = {
  defaultSize: {
    height: 480,
    width: 760,
  },
  minSize: {
    height: 100,
    width: 220,
  },
  application: "TextFileItem",
  icon: "txt.svg",
};

const codeType = {
  defaultSize: {
    height: 480,
    width: 550,
  },
  minSize: {
    height: 100,
    width: 220,
  },
  icon: "/System/Icons/photos.webp",
  application: "CodeFileItem",
};

const fileTypesConfiguration: any = {
  devTools: {
    background: "rgb(36, 36, 36)",
    defaultSize: {
      height: 380,
      width: 545,
    },
    minSize: {
      height: 100,
      width: 220,
    },
    icon: "/System/Icons/eruda.webp",
    singleton: true,
    title: "DevTools",
  },
  dir: {
    background: "rgb(82, 86, 89)",
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
  },
  settings: {
    defaultSize: {
      height: 480,
      width: 760,
    },
    minSize: {
      height: 100,
      width: 220,
    },
    title: "Settings",
    icon: "settings.svg",
    application: "SystemSettings",
  },
  txt: textType,
  text: textType,
  FileExplorer: {
    background: "#202020",
    icon: "FOLDER_ICON",
    title: "File Explorer",
  },
  html: codeType,
  js: codeType,
  css: codeType,
  pdf: {
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
  },
  png: imageType,
  jpg: imageType,
  jpeg: imageType,
  run: {
    allowResizing: false,
    defaultSize: {
      height: 174,
      width: 397,
    },
    minSize: {
      height: 100,
      width: 220,
    },
    hideMaximizeButton: true,
    hideMinimizeButton: true,
    icon: "/System/Icons/run.webp",
    initialRelativePosition: {
      bottom: "TASKBAR_HEIGHT" + 11,
      left: 15,
    },
    singleton: true,
    title: "Run",
  },
  terminal: {
    background: "rgba(12, 12, 12, 0.5)",
    defaultSize: {
      height: 340,
      width: 553,
    },
    minSize: {
      height: 100,
      width: 220,
    },
    icon: "/System/Icons/xterm.webp",
    lockAspectRatio: true,
    title: "Terminal",
  },

  transferDialog: {
    allowResizing: false,
    background: "#FFF",
    defaultSize: {
      height: 163,
      width: 400,
    },
    minSize: {
      height: 100,
      width: 220,
    },
    icon: "/System/Icons/copying.webp",
    title: "Dialog",
  },
};

export default fileTypesConfiguration;

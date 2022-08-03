const fileTypesConfiguration: any = {
  DevTools: {
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
  txt: {
    defaultSize: {
      height: 480,
      width: 760,
    },
    minSize: {
      height: 100,
      width: 220,
    },
    icon: "txt.svg",
  },
  FileExplorer: {
    background: "#202020",
    icon: "FOLDER_ICON",
    title: "File Explorer",
  },
  html: {
    defaultSize: {
      height: 480,
      width: 550,
    },
    minSize: {
      height: 100,
      width: 220,
    },
  },
  js: {
    defaultSize: {
      height: 480,
      width: 544,
    },
    minSize: {
      height: 100,
      width: 220,
    },
  },
  css: {
    defaultSize: {
      height: 480,
      width: 544,
    },
    minSize: {
      height: 100,
      width: 220,
    },
  },
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
    icon: "/System/Icons/pdf.webp",
    title: "PDF",
  },
  Photos: {
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
    icon: "/System/Icons/photos.webp",
    prependTaskbarTitle: true,
    title: "Photos",
  },

  Run: {
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
  Terminal: {
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

  TransferDialog: {
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

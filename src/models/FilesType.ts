const processDirectory = {
  DevTools: {
    background: "rgb(36, 36, 36)",
    defaultSize: {
      height: 380,
      width: 545,
    },
    icon: "/System/Icons/eruda.webp",
    singleton: true,
    title: "DevTools",
  },
  FileExplorer: {
    background: "#202020",
    icon: "FOLDER_ICON",
    title: "File Explorer",
  },

  MonacoEditor: {
    background: "#1E1E1E",
    defaultSize: {
      height: 480,
      width: 544,
    },
    icon: "/System/Icons/monaco.webp",
    title: "Monaco Editor",
  },
  PDF: {
    background: "rgb(82, 86, 89)",
    defaultSize: {
      height: 480,
      width: 640,
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
    icon: "/System/Icons/xterm.webp",
    lockAspectRatio: true,
    title: "Terminal",
  },
  TinyMCE: {
    background: "#FFF",
    defaultSize: {
      height: 480,
      width: 640,
    },
    icon: "/System/Icons/tinymce.webp",
    singleton: true,
    title: "TinyMCE",
  },
  TransferDialog: {
    allowResizing: false,
    background: "#FFF",
    defaultSize: {
      height: 163,
      width: 400,
    },
    icon: "/System/Icons/copying.webp",
    title: "Dialog",
  },
};

export default processDirectory;

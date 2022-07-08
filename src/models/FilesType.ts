const processDirectory = {
  BoxedWine: {
    allowResizing: false,
    background: "#000",
    defaultSize: {
      height: 480,
      width: 640,
    },
    icon: "/System/Icons/boxedwine.webp",
    singleton: true,
    title: "BoxedWine",
  },
  Browser: {
    background: "#FFF",
    defaultSize: {
      height: 480,
      width: 640,
    },
    icon: "/System/Icons/chromium.webp",
    title: "Browser",
  },
  Byuu: {
    autoSizing: true,
    background: "#000",
    defaultSize: {
      height: 240,
      width: 256,
    },
    icon: "/System/Icons/byuu.webp",
    lockAspectRatio: true,
    title: "Byuu",
  },
  DXBall: {
    background: "#000",
    defaultSize: {
      height: 480,
      width: 640,
    },
    icon: "/System/Icons/dxball.webp",
    lockAspectRatio: true,
    title: "DX-Ball",
  },
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
    icon: FOLDER_ICON,
    title: "File Explorer",
  },
  JSDOS: {
    autoSizing: true,
    background: "#000",
    defaultSize: {
      height: 200,
      width: 320,
    },
    icon: "/System/Icons/jsdos.webp",
    lockAspectRatio: true,
    title: "js-dos v7",
  },
  Marked: {
    background: "#FFF",
    defaultSize: {
      height: 480,
      width: 560,
    },
    icon: "/System/Icons/marked.webp",
    title: "Marked",
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
  Ruffle: {
    background: "#000",
    defaultSize: {
      height: 400,
      width: 550,
    },
    icon: "/System/Icons/ruffle.webp",
    lockAspectRatio: true,
    title: "Ruffle",
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
      bottom: TASKBAR_HEIGHT + 11,
      left: 15,
    },
    singleton: true,
    title: "Run",
  },
  SpaceCadet: {
    background: "#000",
    defaultSize: {
      height: 440,
      width: 600,
    },
    icon: "/System/Icons/pinball.webp",
    lockAspectRatio: true,
    singleton: true,
    title: "Space Cadet",
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
  V86: {
    allowResizing: false,
    autoSizing: true,
    background: "#000",
    defaultSize: {
      height: 200,
      width: 320,
    },
    icon: "/System/Icons/v86.webp",
    singleton: true,
    title: "Virtual x86",
  },
  VideoPlayer: {
    autoSizing: true,
    background: "#000",
    icon: "/System/Icons/vlc.webp",
    title: "Video Player",
  },
  Vim: {
    allowResizing: false,
    background: "rgb(34, 35, 36)",
    defaultSize: {
      height: 448,
      width: 595,
    },
    icon: "/System/Icons/vim.webp",
    singleton: true,
    title: "Vim",
  },
  Webamp: {
    allowResizing: false,
    hasWindow: false,
    icon: "/System/Icons/webamp.webp",
    singleton: true,
    title: "Webamp",
  },
};

export default processDirectory;

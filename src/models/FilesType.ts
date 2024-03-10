// Add application to open
// Have just one action in the store to open

import { extractFilesInFolder, extractHere } from '@/components/system/actionMenu/actionsList';
import { FileType } from './FileType';

const imageType: FileType = {
  background: '#222',
  singleton: false,
  allowResizing: true,
  defaultSize: {
    height: 700,
    width: 800
  },
  minSize: {
    height: 100,
    width: 220
  },
  icon: 'png.svg',
  title: 'Photos',
  application: 'ImageFileItem',
  canOpenWithoutFile: false
};

const textType: FileType = {
  singleton: false,
  allowResizing: true,
  background: '#222',
  defaultSize: {
    height: 480,
    width: 760
  },
  minSize: {
    height: 100,
    width: 350
  },
  application: 'TextFileItem',
  title: 'New text file',
  icon: 'txt.svg',
  canOpenWithoutFile: true
};

const audioType: FileType = {
  singleton: false,
  allowResizing: true,
  background: '#222',
  defaultSize: {
    height: 480,
    width: 760
  },
  minSize: {
    height: 100,
    width: 220
  },
  application: 'audioItem/AudioPlayer',
  title: 'New text file',
  icon: 'music.svg',
  canOpenWithoutFile: false
};

const videoType: FileType = {
  singleton: false,
  allowResizing: true,
  background: 'black',
  defaultSize: {
    height: 480,
    width: 760
  },
  minSize: {
    height: 100,
    width: 220
  },
  application: 'videoItem/VideoPlayer',
  title: 'Video player',
  icon: 'mp4.svg',
  canOpenWithoutFile: false,
  openWith: [
    {
      actionName: 'Monaco editor',
      applicationToOpen: 'codeItem/CodeFileItem',
      iconMdi: 'mdi-microsoft-visual-studio-code'
    }
  ]
};

const codeType = (codeExt: string): FileType => {
  return {
    singleton: false,
    allowResizing: true,
    background: '#222',
    defaultSize: {
      height: 480,
      width: 550
    },
    minSize: {
      height: 100,
      width: 220
    },
    icon: `code.svg`,
    title: '',
    application: 'codeItem/CodeFileItem',
    canOpenWithoutFile: false // TODO implement this functionality
  };
};

const applicationType = (name: string, applicationToOpen: string, icon?: string) => {
  return {
    background: 'rgb(82, 86, 89)',
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 480,
      width: 760
    },
    minSize: {
      height: 400,
      width: 650
    },
    title: `${name}`,
    icon: icon ? icon : `${name}.png`,
    application: applicationToOpen,
    canOpenWithoutFile: true,
    canRepeatInAppList: true
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
  application: {
    background: 'rgb(82, 86, 89)',
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 580,
      width: 840
    },
    minSize: {
      height: 300,
      width: 820
    },
    icon: 'folder.svg',
    title: 'Directory',
    application: 'folderItem/FolderItem',
    canOpenWithoutFile: false
  },
  dir: {
    background: 'rgb(82, 86, 89)',
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 580,
      width: 840
    },
    minSize: {
      height: 300,
      width: 820
    },
    icon: 'folder.svg',
    title: 'Directory',
    application: 'folderItem/FolderItem',
    canOpenWithoutFile: false
  },
  browser: {
    background: 'rgb(82, 86, 89)',
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 500,
      width: 860
    },
    minSize: {
      height: 400,
      width: 650
    },
    title: 'Browser',
    icon: 'browser.svg',
    application: 'BrowserItem',
    canOpenWithoutFile: true
  },
  settings: {
    background: 'rgb(82, 86, 89)',
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 630,
      width: 840
    },
    minSize: {
      height: 630,
      width: 840
    },
    title: 'Settings',
    icon: 'settings.svg',
    application: 'systemSettings/SystemSettings',
    canOpenWithoutFile: true
  },
  dutiesTaxCalculator: {
    background: 'rgb(82, 86, 89)',
    allowResizing: true,
    singleton: false,
    defaultSize: {
      height: 720,
      width: 790
    },
    minSize: {
      height: 400,
      width: 650
    },
    title: 'Duties & Tax Calculator',
    icon: 'taxCalculator.svg',
    application: 'dutiesCalculator/DutiesCalculator',
    canOpenWithoutFile: true
  },
  lnk: {
    background: 'rgb(82, 86, 89)',
    allowResizing: false,
    singleton: false,
    defaultSize: {
      height: 0,
      width: 0
    },
    minSize: {
      height: 0,
      width: 0
    },
    title: '',
    icon: '',
    application: 'LinkItem',
    canOpenWithoutFile: false
  },
  txt: textType,
  text: textType,
  html: codeType('html'),
  js: codeType('js'),
  ts: codeType('ts'),
  css: codeType('css'),
  mp4: videoType,
  webm: videoType,
  ogg: videoType,
  md: {
    background: 'rgb(82, 86, 89)',
    allowResizing: false,
    singleton: true,
    defaultSize: {
      height: 500,
      width: 600
    },
    minSize: {
      height: 300,
      width: 400
    },
    title: 'MD Editor',
    icon: 'markdown.svg',
    application: 'mdItem/MdEditor',
    canOpenWithoutFile: true
  },
  swf: {
    allowResizing: true,
    singleton: false,
    background: 'rgb(82, 86, 89)',
    defaultSize: {
      height: 480,
      width: 640
    },
    minSize: {
      height: 300,
      width: 520
    },
    icon: 'flash.svg',
    title: 'Flash',
    application: 'flashItem/flashItem',
    canOpenWithoutFile: false
  },
  zip: {
    allowResizing: true,
    singleton: false,
    background: 'rgb(82, 86, 89)',
    defaultSize: {
      height: 480,
      width: 640
    },
    minSize: {
      height: 300,
      width: 520
    },
    icon: 'zip.svg',
    title: 'Zip',
    application: 'compressedFileItem/CompressedFileItem',
    canOpenWithoutFile: false,
    additionalActions: [extractFilesInFolder, extractHere]
  },
  pdf: {
    allowResizing: true,
    singleton: false,
    background: 'rgb(82, 86, 89)',
    defaultSize: {
      height: 480,
      width: 640
    },
    minSize: {
      height: 300,
      width: 520
    },
    icon: 'pdf.svg',
    title: 'PDF',
    application: 'pdfItem/PdfItem',
    canOpenWithoutFile: false // TODO: implement this functionality
  },
  mp3: audioType,
  png: imageType,
  jpg: imageType,
  jpeg: imageType,
  svg: imageType,
  Doom: applicationType('Doom', 'dosItem/DosPlayer'),
  'Duke Nukem 3D': applicationType('Duke Nukem 3D', 'dosItem/DosPlayer'),
  'Bio Menace': applicationType('Bio Menace', 'dosItem/DosPlayer'),
  'Blake Stone': applicationType('Blake Stone', 'dosItem/DosPlayer'),
  Digger: applicationType('Digger', 'dosItem/DosPlayer'),
  // Dn3d: applicationType('Dn3d', 'dosItem/DosPlayer'),
  'Duke Nukem': applicationType('Duke Nukem', 'dosItem/DosPlayer', 'Duke Nukem.svg'),
  'Duke Nukem 2': applicationType('Duke Nukem 2', 'dosItem/DosPlayer'),
  'Jazz Jackrabbit': applicationType('Jazz Jackrabbit', 'dosItem/DosPlayer'),
  'Commander Keen': applicationType('Commander Keen', 'dosItem/DosPlayer'),
  'Commander Keen 4': applicationType('Commander Keen 4', 'dosItem/DosPlayer'),
  Raptor: applicationType('Raptor', 'dosItem/DosPlayer'),
  Skyroads: applicationType('Skyroads', 'dosItem/DosPlayer'),
  'Wolfenstein 3D': applicationType('Wolfenstein 3D', 'dosItem/DosPlayer'),

  'WarCraft- Orcs & Humans': applicationType('WarCraft- Orcs & Humans', 'dosItem/DosPlayer'),
  'Sim City': applicationType('Sim City', 'dosItem/DosPlayer'),
  'Prince of Persia': applicationType('Prince of Persia', 'dosItem/DosPlayer'),
  'Grand Theft Auto': applicationType('Grand Theft Auto', 'dosItem/DosPlayer'),
  'Mortal Kombat': applicationType('Mortal Kombat', 'dosItem/DosPlayer')
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

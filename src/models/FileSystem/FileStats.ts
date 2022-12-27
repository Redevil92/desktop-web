export default interface FileStats {
  atime: Date;
  birthtime: Date;
  blksize: number;
  blocks: number;
  ctime: string;
  dev: 0;
  fileData: any;
  gid: number;
  ino: number;
  mode: number;
  mtime: Date;
  nlink: number;
  rdev: number;
  size: number;
  uid: number;
  isDirectory(): boolean;
}

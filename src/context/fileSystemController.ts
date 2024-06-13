import { IFileSystem } from "./fileSystemRepositories/IFileSystem";
import BrowserFSFileSystem from "./fileSystemRepositories/BrowserFSFileSystem";

const fileSystem: IFileSystem = new BrowserFSFileSystem();
export default fileSystem;

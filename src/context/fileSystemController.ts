import { IFileSystem } from "./fileSystemRepositories/IFileSystem";
import BrowserFSFileSystem from "./fileSystemRepositories/browserFSFileSystem";

const fileSystem: IFileSystem = new BrowserFSFileSystem();
export default fileSystem;

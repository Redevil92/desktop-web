import { INDEXED_DB_NAME } from '@/constants'
import { FileSystemConfiguration } from 'browserfs/dist/node/core/browserfs'

const browserFSConfiguration: FileSystemConfiguration = {
  fs: 'IndexedDB',
  // options: {
  //   "/": { fs: "IndexedDB" },
  //   "/tmp": { fs: "InMemory" },
  //   storeName: "mydata",
  // },
  options: { storeName: INDEXED_DB_NAME }
}

export default browserFSConfiguration

export const clearIndexedDB = async (databaseName: string) => {
  const DBOpenRequest = window.indexedDB.open(databaseName);
  return new Promise((resolve, reject) => {
    DBOpenRequest.onsuccess = () => {
      const db = DBOpenRequest.result;
      clearData(db, databaseName);

      resolve(true);
    };
    DBOpenRequest.onerror = () => {
      reject();
    };
  });
};

function clearData(db: IDBDatabase, databaseName: string) {
  const transaction = db.transaction([databaseName], "readwrite");
  const objectStore = transaction.objectStore(databaseName);
  objectStore.clear();
}

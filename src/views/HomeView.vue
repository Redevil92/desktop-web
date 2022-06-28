<template>
  <div class="home" ref="desktopRef">
    <actions-dialog-box
      v-if="desktopRef"
      @onAddNewFolder="createNewDirectory"
      path="desktop"
      :contextRef="desktopRef"
    ></actions-dialog-box>

    <DesktopWorkSpace :items="desktopContent" @onFileItemPositionChange="changeItemPositionHandler" />

    <div v-for="(item, index) in itemsDialog" :key="`folder-opened-${index}`">
      <OpenedItemView v-if="!item.isCollapsed" :items="getContentFromDirectoryPath(item.name)" :itemDialog="item" />
    </div>

    <TaskBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from "vue";
import { useStore } from "vuex";

import DesktopWorkSpace from "@/components/DesktopWorkSpace.vue";
import OpenedItemView from "@/components/OpenedItemView.vue";
import TaskBar from "@/components/TaskBar.vue";
import ActionsDialogBox from "@/components/ActionsDialogBox.vue";

import FilingSystem from "@/models/FilingSystem";
import Item from "@/models/Item";
import Coordinates from "@/models/Coordinates";
import Directory from "@/models/Directory";
import FileItem from "@/models/FileItem";
import { MIME_TYPE } from "@/constants";
import ItemDialog from "@/models/ItemDialog";
import DesktopItem from "@/models/DesktopItem";

export default defineComponent({
  props: {
    msg: String,
  },
  components: { DesktopWorkSpace, TaskBar, OpenedItemView, ActionsDialogBox },
  setup() {
    const store = useStore();

    const desktopRef = ref(null);

    const desktopFs = new FilingSystem();
    desktopFs.createDirectory("Root");
    desktopFs.createFile("Very long item name.txt", { x: 0, y: 1 });
    desktopFs.createFile("File 2", { x: 0, y: 30 });
    desktopFs.createDirectory("Program files", { x: 0, y: 5 });
    desktopFs.createDirectory("Users", { x: 0, y: 7 });
    desktopFs.openDirectory("Users");
    desktopFs.createFile("File user", { x: 0, y: 0 });
    desktopFs.createDirectory("Desktop", { x: 0, y: 2 });
    desktopFs.createDirectory("Documents", { x: 0, y: 4 });

    desktopFs.openDirectory("Desktop");
    desktopFs.createFile("item Desktop", { x: 0, y: 0 });
    desktopFs.createFile("evote_app_presentation.pdf", { x: 1, y: 8 }, MIME_TYPE.pdf);

    desktopFs.createDirectory("Sub Desktop", { x: 0, y: 2 });
    // desktopFs.openDirectory("Sub Desktop");

    // desktopFs.createFile("item1", { x: 0, y: 0 });
    // desktopFs.createDirectory("dir", { x: 5, y: 0 });

    // desktopFs.openDirectory("Desktop");
    // desktopFs.createFile("item2 giravo in strada da solo nuovo.txt", { x: 0, y: 2 });

    //store.dispatch("fileSystem/ADD_DIRECTORY_PATH", "Users");

    let dirPath = ref(desktopFs.currentDirectoryPath);
    let openedFolders = [] as Directory[];
    //openedFolders.push(desktopFs);

    const getMimeTypeFromItem = (item: Item) => {
      return item.constructor.name === "Directory" ? "inode/directory" : (item as FileItem).mimeType;
    };

    let dirChildren = ref(
      desktopFs.currentDirectory.content.map((item: any) => {
        //let mimeType = item.constructor.name === "Directory" ?
        return {
          name: item.name,
          coordinates: item.coordinates,
          mimeType: getMimeTypeFromItem(item),
          position: item.position,
        } as DesktopItem;
      })
    );

    let desktopContent = reactive(
      desktopFs.currentDirectory.content.map((item: any) => {
        return {
          name: item.name,
          coordinates: item.coordinates,
          mimeType: getMimeTypeFromItem(item),
          position: item.position,
        };
      }) as DesktopItem[]
    );

    // const openNewDirectoryDialog = () => {
    //   console.log("opening new dir dialog");
    //   const openedFolderFileSystem = Object.assign({}, desktopFs);
    //   openedFolders.push(openedFolderFileSystem);
    // };

    const generateUniqueName = (name: string, existingNameMap: Map<string, any>) => {
      let myName = name;
      let currentIndex = 0;
      let isUnique = false;
      while (!isUnique && currentIndex < 100) {
        isUnique = !existingNameMap.get(myName);
        console.log(currentIndex, isUnique);
        if (!isUnique) {
          currentIndex++;
          myName = `${name} (${currentIndex})`;
        }
      }
      return myName;
    };

    const createNewDirectory = (coordinates: Coordinates = { x: 7, y: 7 }) => {
      desktopFs.createDirectory("NEW DIR", { x: 7, y: 7 });

      const fileNamesMap = new Map(desktopContent.map((file) => [file.name, file.mimeType]));
      const newFolderName = generateUniqueName("New folder", fileNamesMap);

      const newFile = {
        name: newFolderName,
        coordinates: { x: 7, y: 7 },
        mimeType: MIME_TYPE.directory,
      } as DesktopItem;
      desktopContent.push(newFile);
    };

    const itemsDialog = computed(function () {
      return store.getters["fileSystem/GET_ITEMS_DIALOG"] as ItemDialog[];
    });

    const getContentFromDirectoryPath = (directoryPath: string) => {
      const directory = desktopFs.getDirectoryFromPath(directoryPath);

      if (directory) {
        return directory.content.map((item: any) => {
          return { name: item.name, coordinates: item.coordinates, mimeType: getMimeTypeFromItem(item) } as DesktopItem;
        });
      }
      return [];
    };

    const changeItemPositionHandler = (fileItemToUpdate: Item, newCoordinates: Coordinates) => {
      desktopFs.updateItemCoordonates(fileItemToUpdate.name, newCoordinates);
    };

    const goBackToDirectory = (fileSystem: FilingSystem, dirName: string) => {
      let fs = fileSystem;
      if (!fileSystem) {
        fs = desktopFs;
      }

      fs.goBackToDirectory(dirName);

      dirPath.value = fs.currentDirectoryPath;
      dirChildren.value = fs.currentDirectory.content.map((item: any) => {
        return {
          name: item.name,
          coordinates: item.coordinates,
          mimeType: getMimeTypeFromItem(item),
          position: item.position,
        } as DesktopItem;
      });

      desktopContent.splice(0);
      desktopContent.push(
        ...fs.currentDirectory.content.map((item: any) => {
          return {
            name: item.name,
            coordinates: item.coordinates,
            mimeType: getMimeTypeFromItem(item),
            position: item.position,
          } as DesktopItem;
        })
      );
    };

    const openDirectoryByName = (fileSystem: FilingSystem, dirName: string) => {
      let fs = fileSystem;
      if (!fileSystem) {
        fs = desktopFs;
      }

      fs.openDirectory(dirName);
      //dirPath = fs.currentDirectoryPath;
      dirPath.value = fs.currentDirectoryPath;
      dirChildren.value = fs.currentDirectory.content.map((item: any) => {
        return {
          name: item.name,
          coordinates: item.coordinates,
          mimeType: getMimeTypeFromItem(item),
          position: item.position,
        } as DesktopItem;
      });

      desktopContent.splice(0);
      desktopContent.push(
        ...fs.currentDirectory.content.map((item: any) => {
          return {
            name: item.name,
            coordinates: item.coordinates,
            mimeType: getMimeTypeFromItem(item),
            position: item.position,
          } as DesktopItem;
        })
      );
    };

    const isDirectory = (fileSystem: FilingSystem, fileName: string) => {
      let fs = fileSystem;
      if (!fileSystem) {
        fs = desktopFs;
      }

      const itemFound: Item = fs.currentDirectory.content.find((item: Item) => {
        if (item.name === fileName) {
          return item;
        }
      });

      if (itemFound && itemFound.constructor.name === "Directory") {
        return true;
      }
      return false;
    };

    return {
      dirPath,
      dirChildren,
      openDirectoryByName,
      isDirectory,
      goBackToDirectory,
      changeItemPositionHandler,
      openedFolders,
      // getFileSystemContent,
      //openNewDirectoryDialog,
      createNewDirectory,
      itemsDialog,
      getContentFromDirectoryPath,
      desktopContent,
      desktopRef,
    };
  },
});
</script>
<style scoped>
.folder-object {
  cursor: pointer;
}

.directory-object {
  cursor: pointer;
}

.home {
  overflow: hidden;
}
</style>

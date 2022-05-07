<template>
  <div class="home">
    <div style="display: flex">
      <div v-for="dir in dirPath" :key="dir" @click="goBackToDirectory(dir)" class="directory-object">> {{ dir }}</div>
    </div>
    <div>
      <strong>CHILDREN</strong>
      <div v-for="(file, index) in dirChildren" :key="index">
        <div v-if="isDirectory(file.name)">
          DIR::
          <strong class="folder-object" @click="openDirectoryByName(file.name)"
            >{{ file.name }} | {{ `[${file.coordinates.x}, ${file.coordinates.y}]` }}</strong
          >
        </div>
        <div v-else>{{ file.name }} | {{ `[${file.coordinates.x}, ${file.coordinates.y}]` }}</div>
      </div>
    </div>
    <WorkSpace :items="dirChildren" msg="Welcome to Your Vue.js + TypeScript App" />
    <TaskBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from "vue";
import { mapGetters, useStore } from "vuex";

import WorkSpace from "@/components/WorkSpace.vue";
import TaskBar from "@/components/TaskBar.vue";

import FilingSystem from "@/models/old/FilingSystem";
import Item from "@/models/old/Item";

export default defineComponent({
  props: {
    msg: String,
  },
  components: { WorkSpace, TaskBar },
  setup() {
    const fs = new FilingSystem();
    fs.createDirectory("Root");
    fs.createFile("Very long item name.txt", { x: 0, y: 1 });
    fs.createFile("File 2", { x: 0, y: 30 });
    fs.createDirectory("Program files", { x: 0, y: 5 });
    fs.createDirectory("Users", { x: 0, y: 7 });
    fs.openDirectory("Users");
    fs.createFile("File user", { x: 0, y: 0 });
    fs.createDirectory("Desktop", { x: 0, y: 2 });
    fs.createDirectory("Documents", { x: 0, y: 4 });

    fs.openDirectory("Desktop");
    fs.createFile("item Desktop", { x: 0, y: 0 });

    fs.createDirectory("Sub Desktop", { x: 0, y: 2 });
    fs.openDirectory("Sub Desktop");

    fs.createFile("item1", { x: 0, y: 0 });
    fs.createFile("item2 giravo in strada da solo nuovo.txt", { x: 0, y: 2 });

    let dirPath = ref(fs.currentDirectoryPath);

    let dirChildren = ref(
      fs.currentDirectory.content.map((item: any) => {
        return { name: item.name, coordinates: item.coordinates };
      })
    );
    console.log("FFFFFS", dirChildren.value);

    const store = useStore();

    // store.dispatch("fileSystem/INITIALIZE_FILE_SYSTEM", "");
    // store.dispatch("fileSystem/CREATE_DIRECTORY", "System");
    // store.dispatch("fileSystem/CREATE_DIRECTORY", "Program files");
    // store.dispatch("fileSystem/CREATE_DIRECTORY", "Users");
    // store.dispatch("fileSystem/OPEN_DIRECTORY_BY_NAME", "Users");
    // store.dispatch("fileSystem/CREATE_DIRECTORY", "Public");
    // store.dispatch("fileSystem/CREATE_DIRECTORY", "Desktop");
    // store.dispatch("fileSystem/CREATE_DIRECTORY", "Documents");
    // store.dispatch("fileSystem/OPEN_DIRECTORY_BY_NAME", "Desktop");
    // store.dispatch("fileSystem/CREATE_FILE", "file1");

    // const currentDirectoryPath = computed(function () {
    //   return store.getters["fileSystem/GET_CURRENT_DIRECTORY_PATH_NAMES"];
    // });
    // const getCurrentDirectoryFile = ref(store.getters["fileSystem/GET_CURRENT_DIRECTORY_FILE"]);
    const goBackToDirectory = (dirName: string) => {
      fs.goBackToDirectory(dirName);

      dirPath.value = fs.currentDirectoryPath;
      dirChildren.value = fs.currentDirectory.content.map((item: any) => {
        return { name: item.name, coordinates: item.coordinates };
      });
    };
    const openDirectoryByName = (dirName: string) => {
      console.log("Open directory by name", dirName);
      fs.openDirectory(dirName);
      //dirPath = fs.currentDirectoryPath;
      dirPath.value = fs.currentDirectoryPath;
      dirChildren.value = fs.currentDirectory.content.map((item: any) => {
        return { name: item.name, coordinates: item.coordinates };
      });
    };

    const isDirectory = (fileName: string) => {
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

    return { dirPath, dirChildren, openDirectoryByName, isDirectory, goBackToDirectory };
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
</style>

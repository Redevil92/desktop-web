import { createApp } from "vue";
import App from "./App.vue";
import { initializeFileSystem } from "./context/fileSystem";
import { createDirectory, createFile } from "./context/fileSystemController";
import router from "./router";
import store from "./store";

// eslint-disable-next-line
initializeFileSystem();

setTimeout(() => {
  // createFile("newFile.txt");
  // createFile("secondFile.txt", "my beautiful text");

  createDirectory("my PC");
  createDirectory("my PC1");
  createDirectory("my PC2");
  createDirectory("my PC3");
  createDirectory("my PC4");
  createDirectory("my PC5");
  createDirectory("my PC6");
  createDirectory("my PC7");
  createDirectory("my PC8");
  createDirectory("my PC9");
  createDirectory("my PC11");

  createFile("my PC/mysecondFile.txt", "my beautiful text");

  createDirectory("my PC/Desktop");

  createFile("my PC/Desktop/file_desktop3.txt", "MY start text to test.");
  createDirectory("my PC/Desktop/FOLDER");

  createFile("my PC/Desktop/FOLDER/new_file1.txt", "This is my text file.");
  createFile("my PC/Desktop/FOLDER/mountain.jpg", "");
  createFile("my PC/Desktop/FOLDER/new_file2.txt", "This is my text file 2.");
  createDirectory("my PC/Desktop/FOLDER/sub directory");
  createDirectory("my PC/Desktop/FOLDER/another sub directory");
  createFile("my PC/Desktop/FOLDER/another sub directory/another file.txt", "This is my text file 2.");
}, 1000);

// createFile("my PC/Desktop/file_desktop1.txt", "my beautiful text");
// createFile("my PC/Desktop/file_desktop2.txt", "my beautiful text");

createApp(App).use(store).use(router).mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import { initializeFileSystem } from "./context/fileSystem";
import { createDirectory, createFile } from "./context/fileSystemController";
import router from "./router";
import store from "./store";

// eslint-disable-next-line
initializeFileSystem();
createFile("newFile.txt");
createFile("secondFile.txt", "my beautiful text");

createDirectory("my PC");

createFile("my PC/mysecondFile.txt", "my beautiful text");

createDirectory("my PC/Desktop");

createFile("my PC/Desktop/Resume.txt", "MY start text to test.");
createDirectory("my PC/Desktop/FOLDER");
createFile("my PC/Desktop/FOLDER/new_file1.txt", "This is my text file.");
createFile("my PC/Desktop/FOLDER/new_file2.txt", "This is my text file 2.");
createDirectory("my PC/Desktop/FOLDER/sub directory");
createDirectory("my PC/Desktop/FOLDER/another sub directory");
createFile("my PC/Desktop/FOLDER/another sub directory/another file.txt", "This is my text file 2.");
createFile("my PC/Desktop/Resume2.txt", "my beautiful text");
createFile("my PC/Desktop/Resume3.txt", "my beautiful text");

createApp(App).use(store).use(router).mount("#app");

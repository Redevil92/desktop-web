import { createApp } from "vue";
import App from "./App.vue";
import { initializeFileSystem } from "./context/fileSystem";
import { createDirectory, createFile } from "./context/fileSystemController";
import router from "./router";
import store from "./store";

// import vue-panzoom
import panZoom from "vue-panzoom";

// eslint-disable-next-line
initializeFileSystem();
createFile("newFile.txt");
createFile("secondFile.txt", "my beautiful text");

createDirectory("my PC");

createFile("my PC/mysecondFile.txt", "my beautiful text");

createDirectory("my PC/Desktop");

createFile("my PC/Desktop/file_desktop3.txt", "MY start text to test.");
createDirectory("my PC/Desktop/FOLDER");

// base64 string
const img =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0" +
  "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO" +
  "3gAAAABJRU5ErkJggg==";

//var data = img.replace(/^data:image\/\w+;base64,/, "");

createFile("my PC/Desktop/image.png", img);

//createFile("my PC/Desktop/FOLDER/new_file1.txt", "This is my text file.");
createFile("my PC/Desktop/FOLDER/mountain.jpg", "");
//createFile("my PC/Desktop/FOLDER/new_file2.txt", "This is my text file 2.");
createDirectory("my PC/Desktop/FOLDER/sub directory");
createDirectory("my PC/Desktop/FOLDER/another sub directory");
createFile("my PC/Desktop/FOLDER/another sub directory/another file.txt", "This is my text file 2.");
//createFile("my PC/Desktop/file_desktop1.txt", "my beautiful text");
//createFile("my PC/Desktop/file_desktop2.txt", "my beautiful text");

createApp(App).use(store).use(router).mount("#app");

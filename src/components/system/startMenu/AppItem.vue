<template>
  <div v-if="lineLayout" @click="createItemDialog(app)" class="app-item">
    <img width="30" v-if="getImageURL()" :src="getImageURL()" alt="" />
    <span v-else class="mdi mdi-image-remove"></span>
    <div class="app-item-title">
      {{ name }}
    </div>
  </div>
  <div v-else class="application-button" @click="createItemDialog(app)">
    <div class="icon-image">
      <img v-if="getImageURL()" width="40" :src="getImageURL()" alt="" />
      <span v-else class="mdi mdi-image-remove image-not-found"></span>
    </div>
    <div class="application-name one-line-ellipsis">{{ name }}</div>
  </div>
</template>

<script lang="ts" setup>
import DesktopItem from '@/models/DesktopItem';
import { useFileSystemStore } from '@/stores/fileSystemStore';


const props = defineProps({
  lineLayout: { type: Boolean, default: false },
  app: { type: String, required: true },
  icon: { type: String, required: true },
  name: { type: String, required: true }
});

const emit = defineEmits(['closeStartMenu']);

const fileSystemStore = useFileSystemStore();

const getImageURL = () => {
  try {
    return new URL('/src/assets/fileIcons/' + props.icon, import.meta.url).href;
  } catch (error) {
    return '';
  }
};



const createItemDialog = (applicationToOpen: string) => {
  emit('closeStartMenu');

  const settingsApp: DesktopItem = {
    path: '',
    coordinates: { x: 0, y: 0 },
    applicationExtension: applicationToOpen,
    isSelected: true
  };
  fileSystemStore.createItemDialog(settingsApp);
};
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.application-name {
  font-size: var(--small-font-size);
  color: white;
  width: 70px;
  margin-top: 5px;
}

.application-button {
  padding: 10px 5px;
  width: fit-content;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.icon-image {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.application-button:hover {
  background-color: var(--background-color_contrast);
}

.one-line-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-item {
  display: flex;
  color: white;
  padding: 10px;
  align-items: center;
  font-size: var(--medium-font-size);
  justify-content: flex-start;
  margin-right: 10px;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.app-item:hover {
  background-color: var(--background-color_contrast);
}

.all-apps-container {
  height: 430px;
  overflow: auto;
  margin-top: var(--margin);
}

.app-item-title {
  margin-left: var(--margin);
}

.image-not-found {
  color: rgb(205, 205, 205);
  font-size: 20px;
}
</style>

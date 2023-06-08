<template>
  <div
    :style="height ? `height:${height}px` : ''"
    class="container"
    :class="{ 'grid-container': viewType === 'preview' }"
    @mousedown="deselectItem"
  >
    <span class="input-placeholder" ref="fileNameToChangeSpanRef">{{ getFileNameFromPath(fileNameToChange) }}</span>

    <div v-if="viewType === 'list' && showProperties" class="flex-align-center table-header">
      <div style="width: 400px">Name</div>
      <div style="width: 170px">Date modified</div>
      <div style="width: 100px">Size</div>
    </div>
    <div
      :class="{
        'cut-item': isCutFile(item.path),
      }"
      draggable="true"
      v-for="item in itemsListWithProperties"
      :key="`item-${item.path}`"
      @dblclick="doubleClickHandler(item.path)"
      @dragstart="dragStart"
      @mousedown.stop="itemClickHandler(item.path)"
      @click.right="rightClickHandler($event, item.path)"
    >
      <div v-if="viewType === 'preview'" draggable="true" @dragstart="dragStart">
        <FileIcon :selected="selectedItems.includes(item.path)" :height="60" :filePath="item.path" />
        <div :class="selectedItems.includes(item.path) ? 'file-text-preview-selected' : ''" class="file-text-preview">
          <textarea
            v-if="selectedItems.includes(item.path) && isEditingSelectedValue && canRename"
            ref="fileNameInputRef"
            @keyup.enter="renameFileHandler(item.path)"
            @blur="renameFileHandler(item.path)"
            rows="2"
            class="no-outline file-text-preview"
            v-model="fileNameToChange"
          />
          <div v-else class="file-text-preview">
            {{ getFileNameFromPath(item.path) }}
          </div>
        </div>
      </div>
      <div
        v-if="viewType === 'list'"
        class="flex-align-center list-folder-item"
        :class="{ 'selected-item': selectedItems.includes(item.path) }"
        draggable="true"
      >
        <div class="flex" style="width: 400px">
          <FileIcon class="file-icon" :noStyle="true" :height="18" :filePath="item.path" />
          <span v-if="selectedItems.includes(item.path) && isEditingSelectedValue && canRename">
            <input
              ref="fileNameInputRef"
              class="file-text no-outline"
              v-model="fileNameToChange"
              @keyup.enter="renameFileHandler(item.path)"
              @blur="renameFileHandler(item.path)"
              @keyup.esc="isEditingSelectedValue = false"
              type="text"
              :style="`width:${fileFocusedWidth}px`"
            />
          </span>
          <div v-else style="width: 290px" class="file-text one-line-ellipsis noselect">
            {{ getFileNameFromPath(item.path) }}
          </div>
        </div>
        <div v-if="showProperties && item.properties" class="prop-field" style="width: 170px">
          {{ formatStringDate(item.properties.ctime, dateFormat) }}
          {{ formatTimeFromStringDate(item.properties.ctime, timeFormat) }}
        </div>
        <div v-if="showProperties && item.properties" class="prop-field" style="width: 100px">
          {{ formatBytes(item.properties.size) }}
        </div>
      </div>
    </div>
  </div>
  <div v-if="canChangeViewType" class="footer flex">
    <div class="items-count">{{ itemsList.length }} item{{ itemsList.length > 1 ? "s" : "" }}</div>
    <div style="margin-right: 15px">
      <span
        class="mdi mdi-format-list-bulleted preview-icon"
        :class="{ 'preview-icon-selected': viewType === 'list' }"
        @click="viewType = 'list'"
      ></span>
      <span
        class="mdi mdi-card-outline preview-icon"
        :class="{ 'preview-icon-selected': viewType === 'preview' }"
        @click="viewType = 'preview'"
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, PropType, ref, watch, watchEffect } from "vue";

import { getFileNameFromPath, getSourcePathFromFilePath } from "@/context/utils/fileSystemUtils";
import FileIcon from "@/components/shared/FileIcon.vue";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import fileSystem from "@/context/fileSystemController";
import FileStats from "@/models/FileSystem/FileStats";
import { formatBytes } from "@/utils/byteConversionUtils";
import { formatStringDate, formatTimeFromStringDate } from "@/utils/dateAndTimeConversionUtils";
import { useSettingsStore } from "@/stores/settingsStore";

const props = defineProps({
  itemsList: { type: Array as PropType<string[]>, required: true },
  isFocused: Boolean,
  canRename: Boolean,
  keyEventsActive: { type: Boolean, default: true },
  canChangeViewType: { type: Boolean, default: true },
  showProperties: { type: Boolean, default: false },
  height: { type: Number },
});

const emit = defineEmits([
  "onDoubleClick",
  "onRightClick",
  "renameFileHandler",
  "onItemMouseDown",
  "onSelectedItemsChange",
]);

const fileSystemStore = useFileSystemStore();
const settingsStore = useSettingsStore();

const viewType = ref("list");
const selectedItems = ref<string[]>([]);
const isEditingSelectedValue = ref(false);
const fileNameToChange = ref("");
const fileNameInputRef = ref(null);
const fileNameToChangeSpanRef = ref(null);
const fileFocusedWidth = ref(200);
const itemsListWithProperties = ref<{ path: string; properties: FileStats | undefined }[]>([]);

const timeFormat = computed(() => {
  return settingsStore.timeFormat;
});

const dateFormat = computed(() => {
  return settingsStore.dateFormat;
});

watch(
  () => selectedItems.value,
  async function () {
    emit("onSelectedItemsChange", selectedItems.value);
  }
);

const dragStart = () => {
  console.log("Drag start");
};

const updateItemListWithProperties = async () => {
  const itemWithProp = [];
  for (const item of props.itemsList) {
    const properties = props.showProperties ? ((await fileSystem.getStat(item)) as FileStats) : undefined;

    itemWithProp.push({
      path: item,
      properties,
    });
  }
  itemsListWithProperties.value = itemWithProp;
};

watchEffect(async () => {
  if (props.itemsList) {
    await updateItemListWithProperties();
  }
});

const isCutFile = (itemName: string) => {
  const filesToCut = fileSystemStore.filePathsToCut;
  if (filesToCut.includes(itemName)) {
    return true;
  }
  return false;
};

const itemClickHandler = async (filePath: string) => {
  emit("onItemMouseDown", filePath);
  if (selectedItems.value.includes(filePath) && selectedItems.value.length === 1) {
    if (!isEditingSelectedValue.value && props.canRename) {
      fileNameToChange.value = getFileNameFromPath(filePath);
      setTimeout(async () => {
        isEditingSelectedValue.value = !isEditingSelectedValue.value;
      }, 600);
    }
    return;
  }
  selectedItems.value = [filePath];
  isEditingSelectedValue.value = false;
};

const doubleClickHandler = async (filePath: string) => {
  if (!isEditingSelectedValue.value) {
    emit("onDoubleClick", filePath);
  }
};

const rightClickHandler = (event: Event, filePath: string) => {
  emit("onRightClick", { event, filePath });
};

const renameFileHandler = (filePathToRename: string) => {
  emit("renameFileHandler", {
    newName: getSourcePathFromFilePath(filePathToRename) + "/" + fileNameToChange.value,
    oldName: filePathToRename,
  });
};

const deselectItem = () => {
  selectedItems.value = [];
  isEditingSelectedValue.value = false;
};

const keyDownHandler = (event: { code: string }) => {
  if (props.isFocused && selectedItems.value.length > 0 && props.itemsList && props.keyEventsActive) {
    if (event.code === "ArrowDown") {
      const index = props.itemsList.findIndex(
        (filePath) => filePath === selectedItems.value[selectedItems.value.length - 1]
      );
      if (index !== -1 && props.itemsList.length > index + 1) {
        selectedItems.value = [props.itemsList[index + 1]];
      }
    } else if (event.code === "ArrowUp") {
      const index = props.itemsList.findIndex(
        (filePath) => filePath === selectedItems.value[selectedItems.value.length - 1]
      );
      if (index > 0) {
        selectedItems.value = [props.itemsList[index - 1]];
      }
    }
  }
};

onMounted(async () => {
  if (props.keyEventsActive) {
    window.addEventListener("keydown", keyDownHandler);
  }

  await updateItemListWithProperties();
});

onUnmounted(() => {
  window.removeEventListener("keydown", keyDownHandler);
});
</script>

<style scoped>
@import "@/css/fileItemPreview.css";

.flex {
  display: flex;
  align-items: center;
}

.container {
  position: relative;
  padding-top: 5px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 100px));
  grid-auto-rows: 110px;
  padding-top: 10px;
  gap: 5px;
}

.prop-field {
  color: var(--neutral-color);
}

.table-header {
  padding: var(--margin);
  color: var(--font-color_dark);
  text-align: left;
  font-size: var(--medium-font-size);
}

.list-folder-item {
  height: 24px;
  margin: 2px 0px;
  border-radius: 7px;
  color: var(--font-color);
  font-size: var(--medium-font-size);
  text-align: left;
  padding-left: 10px;
}

.file-icon {
  margin-top: -2px;
}

.flex-align-center {
  align-content: center;
  cursor: pointer;
  display: flex;
}

.input-placeholder {
  font-size: var(--medium-font-size);
  visibility: hidden;
  position: absolute;
}

.action-icon:hover {
  background-color: rgb(33, 33, 33);
  color: white;
}

.extension-icon {
  font-size: 16px;
}

.cut-item {
  opacity: 0.5;
}

.file-text {
  margin-left: 10px;
}

.one-line-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-item {
  background-color: var(--selected-color) !important;
}

.items-count {
  color: var(--font-color);
  font-size: var(--small-font-size);
  padding: 2px 5px;
  border-radius: var(--border-radius);
  background-color: var(--background-color_opacity);
}

input {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: none;
  background-color: #5e5e5e;
  color: white;
  outline: 3px solid #5353e8;
  border-radius: 3px;
  text-decoration: none;
}

.no-outline:focus {
  outline: none;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.footer {
  position: absolute;
  bottom: 4px;
  width: 99%;
  justify-content: space-between;
  padding: 0px 5px;
}

.preview-icon {
  color: var(--font-color);
  padding: 2px;
  border-radius: 3px;
}

.preview-icon:hover,
.preview-icon-selected {
  background-color: var(--neutral-color_dark);
}
</style>

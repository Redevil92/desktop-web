<template>
  <span class="input-placeholder" ref="fileNameToChangeSpanRef">{{ getFileNameFromPath(fileNameToChange) }}</span>
  <div v-if="showProperties" class="flex-align-center table-header">
    <div style="flex-grow: 1">Name</div>
    <div style="width: 170px">Date modified</div>
    <div style="width: 50px">Size</div>
  </div>
  <div
    class="folder-item"
    :class="{
      'selected-item': item.path === selectedItem,
      'cut-item': isCutFile(item.path),
    }"
    v-for="(item, index) in itemsListWithProperties"
    :key="`item-${index}-${item.path}`"
    @dblclick="doubleClickHandler(item.path)"
    @mousedown.stop="itemClickHandler(item.path)"
    @click.right="rightClickHandler($event, item.path)"
  >
    <div class="flex-align-center" draggable="true" @dragstart="dragStartHandler">
      <FileIcon class="file-icon" :noStyle="true" :height="18" :filePath="item.path" />
      <div style="flex-grow: 1">
        <span v-if="item.path === selectedItem && isEditingSelectedValue && canRename">
          <input
            ref="fileNameInputRef"
            class="file-text no-outline"
            v-model="fileNameToChange"
            @keyup.enter="renameFileHandler"
            @blur="renameFileHandler"
            @keyup.esc="isEditingSelectedValue = false"
            type="text"
            :style="`width:${fileFocusedWidth}px`"
          />
        </span>
        <span v-else class="file-text noselect">{{ getFileNameFromPath(item.path) }}</span>
      </div>
      <div v-if="showProperties" class="prop-field" style="width: 170px">
        {{ formatStringDate(item.properties.ctime, dateFormat) }}
        {{ formatTimeFromStringDate(item.properties.ctime, timeFormat) }}
      </div>
      <div v-if="showProperties" class="prop-field" style="width: 50px">
        {{ formatBytes(item.properties.size) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onDeactivated, onMounted, PropType, ref, watch } from "vue";

import { getFileExtensionFromName, getFileNameFromPath, getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import FileIcon from "@/components/shared/FileIcon.vue";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { getStat } from "@/context/fileSystemController";
import FileStats from "@/models/FileSystem/FileStats";
import { formatBytes } from "@/utils/byteConversionUtils";
import { formatStringDate, formatTimeFromStringDate } from "@/utils/dateAndTimeConversionUtils";
import { useSettingsStore } from "@/stores/settingsStore";

export default defineComponent({
  props: {
    itemsList: { type: Array as PropType<string[]>, required: true },
    isFocused: Boolean,
    canRename: Boolean,
    showProperties: { type: Boolean, default: false },
    viewType: String,
  },
  components: { FileIcon },
  emits: ["onDoubleClick", "onRightClick", "renameFileHandler", "onTryDeleteItem"],
  setup(props, ctx) {
    const fileSystemStore = useFileSystemStore();
    const settingsStore = useSettingsStore();

    // *** ITEM SELECTION AND CHANGE NAME
    const selectedItem = ref("");
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

    watch(props.itemsList, async function () {
      console.log("WATCHING", props.itemsList);
      await updateItemListWithProperties();
    });

    const updateItemListWithProperties = async () => {
      const itemWithProp = [];
      for (const item of props.itemsList) {
        const properties = props.showProperties ? ((await getStat(item)) as FileStats) : undefined;

        itemWithProp.push({
          path: item,
          properties,
        });
      }
      itemsListWithProperties.value = itemWithProp;
    };

    const isCutFile = (itemName: string) => {
      const filesToCut = fileSystemStore.filePathsToCut;
      if (filesToCut.includes(itemName)) {
        return true;
      }
      return false;
    };

    const itemClickHandler = async (fileName: string) => {
      if (fileName === selectedItem.value) {
        if (!isEditingSelectedValue.value && props.canRename) {
          fileNameToChange.value = getFileNameFromPath(fileName);
          setTimeout(async () => {
            isEditingSelectedValue.value = !isEditingSelectedValue.value;
          }, 600);
        }
        return;
      }
      selectedItem.value = fileName;
      isEditingSelectedValue.value = false;
    };

    const doubleClickHandler = async (fileName: string) => {
      if (!isEditingSelectedValue.value) {
        ctx.emit("onDoubleClick", fileName);
      }
    };

    const rightClickHandler = (event: Event, filePath: string) => {
      ctx.emit("onRightClick", { event, filePath });
    };

    const renameFileHandler = () => {
      ctx.emit("renameFileHandler", {
        newName: getSourcePathFromFilePath(selectedItem.value) + "/" + fileNameToChange.value,
        oldName: selectedItem.value,
      });
    };

    const deselectItem = () => {
      selectedItem.value = "";
      isEditingSelectedValue.value = false;
    };

    const keyDownHandler = (event: { code: string }) => {
      if (props.isFocused && selectedItem.value && props.itemsList) {
        if (event.code === "Delete" && selectedItem.value) {
          ctx.emit("onTryDeleteItem", selectedItem.value);
        } else if (event.code === "ArrowDown") {
          const index = props.itemsList.findIndex((filePath) => filePath === selectedItem.value);
          if (index !== -1 && props.itemsList.length > index + 1) {
            selectedItem.value = props.itemsList[index + 1];
          }
        } else if (event.code === "ArrowUp") {
          const index = props.itemsList.findIndex((filePath) => filePath === selectedItem.value);
          if (index > 0) {
            selectedItem.value = props.itemsList[index - 1];
          }
        }
      }
    };

    onMounted(async () => {
      window.addEventListener("keydown", keyDownHandler);
      await updateItemListWithProperties();
    });

    onDeactivated(() => {
      window.removeEventListener("keydown", keyDownHandler);
    });

    return {
      getFileNameFromPath,
      getFileExtensionFromName,
      itemClickHandler,
      doubleClickHandler,
      rightClickHandler,
      deselectItem,
      isCutFile,
      renameFileHandler,
      formatBytes,
      formatStringDate,
      formatTimeFromStringDate,
      dateFormat,
      timeFormat,
      itemsListWithProperties,
      selectedItem,
      isEditingSelectedValue,
      fileNameToChange,
      fileNameInputRef,
      fileNameToChangeSpanRef,
      fileFocusedWidth,
    };
  },
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.prop-field {
  color: var(--neutral-color);
}

.table-header {
  margin: var(--margin);
  color: var(--font-color_dark);
  text-align: left;
  font-size: var(--medium-font-size);
}

.folder-item {
  height: 24px;
  margin: 2px 10px;
  border-radius: 7px;
  color: var(--font-color);
  font-size: var(--medium-font-size);
  text-align: left;
  padding-left: 10px;
  padding-top: 5px;
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

.footer {
  position: absolute;
  height: 20px;
  background-color: rgb(25, 25, 25);
  bottom: 0px;
  width: inherit;
  text-align: start;
  width: -webkit-fill-available;
}

.footer-text {
  color: white;
  font-size: var(--small-font-size);
  text-align: start;
  margin-left: 5px;
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

.selected-item {
  background-color: var(--selected-color) !important;
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
</style>

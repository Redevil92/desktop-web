<template>
  <div class="home" ref="desktopRef">
    <ActionMenu />

    <div >
      <DesktopWorkSpace />
    </div>
    <DynamicIsland />
    <div v-for="item in itemsDialog" :key="`folder-opened-${item.guid}`">
      <OpenedFileView v-show="!item.isCollapsed" :itemDialog="item" />
    </div>
    <SnackBar />
    <TaskBar />
    <LoadingComponent />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import DesktopWorkSpace from '@/components/system/desktop/DesktopWorkSpace.vue'
import OpenedFileView from '@/components/system/openedItemDialog/OpenedFileView.vue'
import TaskBar from '@/components/system/taskbar/TaskBar.vue'
import ActionMenu from '@/components/system/actionMenu/ActionMenu.vue'
import SnackBar from '@/components/shared/SnackBar.vue'
import DynamicIsland from '@/components/system/dynamicIsland/DynamicIsland.vue'
import LoadingComponent from '@/components/shared/LoadingComponent.vue'

import ActionMenuModel from '@/models/ActionMenu/ActionMenu'
import ItemDialog from '@/models/ItemDialog'
import { DESKTOP_PATH } from '@/constants'
import { useFileSystemStore } from '@/stores/fileSystemStore'
// import {
//   createNewFile,
//   createNewFolder,
//   openDesktopSettingPage,
//   pasteAction
// } from '@/components/system/actionMenu/actionsList'

const fileSystemStore = useFileSystemStore()

// const rightClickHandler = async (event: Event) => {
//   event.preventDefault()

//   const pointerEvent = event as PointerEvent

//   fileSystemStore.setActionMenu({
//     show: true,
//     paths: [DESKTOP_PATH],
//     position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
//     customLayout: [
//       await pasteAction(DESKTOP_PATH, false, false),
//       createNewFile(pointerEvent, DESKTOP_PATH, false, false),
//       createNewFolder(pointerEvent, DESKTOP_PATH, false, false),
//       openDesktopSettingPage(false, false)
//     ]
//   } as ActionMenuModel)
// }

const itemsDialog = computed(function () {
  return fileSystemStore.itemsDialog as ItemDialog[]
})
</script>
<style scoped>
.home {
  overflow: hidden;
}
</style>

<template>
    <div @click="openFileItem" class="suggestion-item">
        <FileIcon 
            :height="27"
            :filePath="path"
      />
        {{ nameFromPath }}
    </div>
   
</template>
  
<script lang="ts" setup>
import { computed } from 'vue';
import FileIcon from '@/components/shared/FileIcon.vue';
import { useFileSystemStore } from '@/stores/fileSystemStore';

const fileSystemStore = useFileSystemStore();

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
});

const openFileItem = async () => {
  await fileSystemStore.createItemDialogByPath(props.path);
}; 

const nameFromPath = computed(() => {
    return props.path.split('/').pop();
});
</script>

<style scoped>
.suggestion-item {
    border: 1px solid var(--font-color);
    background-color: var(--background-color_contrast);
    padding: 0px 5px;
    border-radius: var(--border-radius);
    width: 200px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.suggestion-item:hover {
    background-color: var(--background-color_contrast_light);
}
</style>
  
<template>
   
</template>
  
<script lang="ts" setup>
import DesktopItem from '@/models/DesktopItem';
import { useFileSystemStore } from '@/stores/fileSystemStore';
import { computed } from 'vue';

const props = defineProps({
lineLayout: { type: Boolean, default: false },
app: { type: String, required: true },
icon: { type: String, required: true },
name: { type: String, required: true }
});





</script>

<style scoped>

</style>
  
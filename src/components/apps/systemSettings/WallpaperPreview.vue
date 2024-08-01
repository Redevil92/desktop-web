<template>
  <div class="desktop-container">
    <img class="desktop-image-item" :src="`${image}`" alt="" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import fileSystem from "@/context/fileSystemController";

const image = ref("");

const props = defineProps({
  path: { type: String, required: true },
});

watch(
  () => props.path,
  () => {
    setImage();
  }
);

const setImage = async () => {
  const file = await fileSystem.readFile(props.path);
  image.value = file.toString();
};

onMounted(async () => {
  await setImage();
});
</script>

<style scoped>
.desktop-container {
  pointer-events: none;
  user-select: none;
}

.desktop-image-item {
  height: 70px;
  width: 110px;
  margin-left: var(--margin);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  border-radius: var(--border-radius);
  border: 3px solid grey;
  cursor: pointer;
}
</style>

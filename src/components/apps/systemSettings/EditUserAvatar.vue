<template>
  <div :style="`height: ${height}px`">
    <AvatarEditor :avatar="currentAvatar" @onSave="saveConfiguration" />
  </div>
</template>

<script lang="ts" setup>
import Avatar from "@/components/system/avatarEditor/Avatar";
import AvatarEditor from "@/components/system/avatarEditor/AvatarEditor.vue";
import { useSettingsStore } from "@/stores/settingsStore";
import { computed } from "vue";

defineProps({
  height: Number,
});

const settingsStore = useSettingsStore();

const currentAvatar = computed(() => settingsStore.avatar);

const saveConfiguration = (avatar: Avatar) => {
  settingsStore.setAvatar(avatar);
};
</script>

<style scoped></style>

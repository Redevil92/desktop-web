<template>
  <div :style="`height: ${height}px`">
    <AvatarEditor :avatar="currentAvatar" />
  </div>
</template>

<script lang="ts" setup>
import Avatar from "@/components/system/avatarEditor/Avatar";
import AvatarEditor from "@/components/system/avatarEditor/AvatarEditor.vue";
import { ref } from "vue";

const props = defineProps({
  height: Number,
});

const currentAvatar = ref<Avatar>({
  isCircle: true,
  circleColor: "#E6E6E6",
  topType: "random",
  accessoriesType: "random",
  hairColor: "random",
  facialHairType: "random",
  clotheType: "random",
  clotheColor: "random",
  graphicType: "random",
  eyeType: "random",
  eyebrowType: "random",
  mouthType: "random",
  skinColor: "random",
  facialHairColor: "random",
  topColor: "random",
});
</script>

<style scoped></style>

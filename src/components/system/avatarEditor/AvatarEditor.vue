<template>
  <div v-if="editedAvatar" style="display: flex">
    <div style="margin-top: 20px; margin-right: 15px; position: relative">
      <div v-for="(item, key) of categories" :key="key" style="display: flex; align-items: center">
        <div style="width: 130px" @click="openedCategory = { item, key }" :class="getCategoryClasses(key)">
          {{ camelCaseToText(key) }}
        </div>
        <span
          v-if="openedCategory?.key === key"
          class="mdi mdi-menu-right"
          style="
            font-size: 32px;
            color: var(--selected-color_light);
            position: absolute;
            right: -24px;
            margin-top: -5px;
          "
        ></span>
      </div>
    </div>

    <div style="width: 240px; height: 400px; padding-right: 20px; overflow-y: auto; flex-shrink: 0">
      <div v-if="openedCategory" style="margin-top: 20px; margin-left: 10px">
        <div
          v-for="(item, key) of openedCategory.item"
          :key="key"
          @click="(editedAvatar as any)[openedCategory.key] = key"
          style="display: flex; align-items: center; position: relative"
        >
          <div
            :class=" (editedAvatar as any)[openedCategory.key] === key ? 'category-item category-item-selected' : 'category-item'"
            :style="`background-color: ${item} !important; cursor: pointer; width: 180px; `"
          >
            {{ key }}
          </div>
          <span
            v-if="(editedAvatar as any)[openedCategory.key] === key"
            class="mdi mdi-checkbox-marked-circle"
            style="font-size: 18px; color: var(--selected-color_light); position: absolute; right: -10px; top: -1px"
          ></span>
        </div>
      </div>
    </div>
    <div style="margin-left: 70px">
      <Avatar :avatar="editedAvatar" :height="300" />
      <div style="margin-top: 20px">
        <BaseButton>Save Configuration</BaseButton>
        <BaseButton neutralColor style="margin-left: 15px">Reset</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref, watch, onMounted } from "vue";

import Avatar from "./Avatar.vue";
import AvatarModel from "./Avatar";
import BaseButton from "@/components/shared/BaseButton.vue";

import { camelCaseToText } from "@/utils/textManipulation";

import { mouthTypes } from "./assetsTypes/mouth";
import { eyeTypes } from "./assetsTypes/eyes";
import { eyebrowTypes } from "./assetsTypes/eyebrows";
import { clothesType } from "./assetsTypes/clothes";
import { topTypes } from "./assetsTypes/top";
import { accessoriesTypes } from "./assetsTypes/accessories";
import { facialHairTypes } from "./assetsTypes/facial-hair";
import { GraphicShirtTypes } from "./assetsTypes/graphic-shirt";
import { hairColors, skinColors, hatAndShirtColors } from "./assetsTypes/colors";

const props = defineProps({
  avatar: { type: Object as PropType<AvatarModel>, required: true },
});

watch(
  () => props.avatar,
  (newAvatar) => {
    editedAvatar.value = newAvatar;
  }
);

const categories = {
  topType: topTypes,
  topColor: hatAndShirtColors,
  hairColor: hairColors,
  accessoriesType: accessoriesTypes,
  facialHairType: facialHairTypes,
  facialHairColor: hairColors,
  clotheType: clothesType,
  clotheColor: hatAndShirtColors,
  graphicType: GraphicShirtTypes,
  eyeType: eyeTypes,
  eyebrowType: eyebrowTypes,
  mouthType: mouthTypes,
  skinColor: skinColors,
};

const editedAvatar = ref<AvatarModel>();

const openedCategory = ref({ item: topTypes, key: "topType" });

const getCategoryClasses = (categoryKey: string) => {
  return {
    "category-item": true,
    "category-item-selected": openedCategory.value?.key === categoryKey,
  };
};

onMounted(() => {
  editedAvatar.value = props.avatar;
});

// const selectedAvatar = computed(() => {
//   return {
//     circleColor: props.avatar.circleColor,
//     isCircle: props.avatar.isCircle,
//     topType: topTypes[props.avatar.topType],
//     accessoriesType: accessoriesTypes[props.avatar.accessoriesType],
//     facialHairType: facialHairTypes[props.avatar.facialHairType],
//     clotheType: clothesType[props.avatar.clotheType],
//     eyeType: eyeTypes[props.avatar.eyeType],
//     eyebrowType: eyebrowTypes[props.avatar.eyebrowType],
//     mouthType: mouthTypes[props.avatar.mouthType],
//     skinColor: skinColors[props.avatar.skinColor],
//     graphicType: GraphicShirtTypes[props.avatar.graphicType],
//     hairColor: hairColors[props.avatar.hairColor],
//     facialHairColor: hairColors[props.avatar.facialHairColor],
//     topColor: hatAndShirtColors[props.avatar.topColor],
//     clotheColor: hatAndShirtColors[props.avatar.clotheColor],
//   };
// });
</script>
<style scoped>
.category-item {
  font-size: var(--medium-font-size);
  padding: 2px 5px;
  border-radius: 5px;
  background-color: var(--neutral-color_background);
  color: var(--font-color);
  margin-bottom: 5px;
  cursor: pointer;
}

.category-item:hover {
  background-color: var(--neutral-color_light);
}

.category-item-selected {
  background-color: var(--selected-color_light) !important;
}
</style>

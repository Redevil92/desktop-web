<template>
  <div v-if="editedAvatar" style="display: flex">
    <div style="margin-top: 20px; margin-right: 15px; margin-bottom: 15px; position: relative">
      <div v-for="(category, index) in categories" :key="index">
        <AvatarCategory
          :category="category"
          :isSelected="openedCategory?.key === category.key"
          @selectCategory="openedCategory = $event"
        />
        <div v-for="(subCategory, index) in category.subCategories" :key="index" style="margin-left: 20px">
          <AvatarCategory
            :category="subCategory"
            :isSelected="openedCategory?.key === subCategory.key"
            @selectCategory="openedCategory = $event"
          />
        </div>
      </div>
    </div>

    <div style="width: 240px; height: 400px; padding-right: 20px; overflow-y: auto; flex-shrink: 0">
      <div v-if="openedCategory" style="margin-top: 20px; margin-left: 10px">
        <div v-if="openedCategory.key === 'background'">BaseToogle Select background color</div>
        <div v-else>
          <div
            v-for="(item, key) of openedCategory.items"
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
    </div>
    <div style="margin-left: 30px">
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
import AvatarModel, { AvatarCategory as AvatarCategoryModel } from "./Avatar";
import BaseButton from "@/components/shared/BaseButton.vue";
import AvatarCategory from "./AvatarCategory.vue";

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

const categories: AvatarCategoryModel[] = [
  {
    items: {},
    key: "background",
    mdiIcon: "mdi-image",
  },
  {
    items: topTypes,
    key: "topType",
    mdiIcon: "mdi-tshirt-crew",
    subCategories: [
      { items: hatAndShirtColors, key: "topColor", mdiIcon: "mdi-arrow-right-bottom" },
      { items: hairColors, key: "hairColor", mdiIcon: "mdi-arrow-right-bottom" },
    ],
  },
  { items: accessoriesTypes, key: "accessoriesType", mdiIcon: "mdi-glasses" },
  {
    items: facialHairTypes,
    key: "facialHairType",
    mdiIcon: "mdi-mustache",
    subCategories: [{ items: hairColors, key: "facialHairColor", mdiIcon: "mdi-arrow-right-bottom" }],
  },
  {
    items: clothesType,
    key: "clotheType",
    mdiIcon: "mdi-tshirt-crew",
    subCategories: [
      { items: hatAndShirtColors, key: "clotheColor", mdiIcon: "mdi-arrow-right-bottom" },
      { items: GraphicShirtTypes, key: "graphicType", mdiIcon: "mdi-arrow-right-bottom" },
    ],
  },
  { items: eyeTypes, key: "eyeType", mdiIcon: "mdi-eye" },
  { items: eyebrowTypes, key: "eyebrowType", mdiIcon: "mdi-eye-circle" },
  { items: mouthTypes, key: "mouthType", mdiIcon: "mdi-emoticon" },
  { items: skinColors, key: "skinColor", mdiIcon: "mdi-palette" },
];

const editedAvatar = ref<AvatarModel>();

const openedCategory = ref<AvatarCategoryModel>({ items: topTypes, key: "topType" });

onMounted(() => {
  editedAvatar.value = props.avatar;
});
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

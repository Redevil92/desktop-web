<template>
  <div style="margin-right: 15px; position: relative">
    <div style="display: flex; align-items: center; justify-content: left; text-align: left">
      <div
        style="width: 100%; display: flex; align-items: center"
        @click="onSelectCategory(category)"
        :class="getCategoryClasses"
      >
        <div style="width: 30px">
          <span :class="`mdi ${category.mdiIcon}`" style="font-size: 16px"></span>
        </div>

        {{ camelCaseToText(category.key) }}
      </div>
      <span
        v-if="isSelected"
        class="mdi mdi-menu-right"
        style="font-size: 32px; color: var(--selected-color_light); position: absolute; right: -24px; margin-top: -5px"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, PropType } from "vue";

import { AvatarCategory } from "./Avatar";
import { camelCaseToText } from "@/utils/textManipulation";

const props = defineProps({
  category: { type: Object as PropType<AvatarCategory>, required: true },
  isSelected: { type: Boolean, required: true },
});

const emit = defineEmits(["selectCategory"]);

const getCategoryClasses = computed(() => {
  return {
    "category-item": true,
    "category-item-selected": props.isSelected,
  };
});

const onSelectCategory = (category: AvatarCategory) => {
  emit("selectCategory", category);
};
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

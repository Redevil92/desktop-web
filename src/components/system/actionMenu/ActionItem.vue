<template>
  <div
    @mouseenter="setShowSubActions(true)"
    @mouseleave="setShowSubActions(false)"
    @click="actionItem.callback"
  >
    <div ref="actionRef" class="action" :class="{ 'disabled-action': actionItem.disabled }">
      <div></div>
      <div v-if="actionItem.icon">
        <img height="18" :src="iconUrl" alt="" />
      </div>
      <div v-else-if="actionItem.materialIcon">
        <span class="material-icon" :class="`mdi ${actionItem.materialIcon}`"></span>
      </div>
      <div v-if="!actionItem.iconOnly" class="action-name">
        {{ actionItem.actionName }}
      </div>
      <div v-if="actionItem.subActions" style="position: absolute; right: 5px">
        <span class="mdi mdi-chevron-right"></span>
      </div>
    </div>

    <div v-if="actionItem.subActions && actionRef && showSubActions">
      <ActionsContainer
        :action-list="actionItem.subActions"
        :position="subActionsContainerPosition"
      ></ActionsContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue';

import ActionItem from '@/models/ActionMenu/ActionItem';
import ActionsContainer from './ActionsContainer.vue';
import Coordinates from '@/models/Coordinates';

const props = defineProps({
  actionItem: {
    type: Object as PropType<ActionItem>,
    required: true
  }
});

const actionRef = ref<HTMLElement | null>(null);
const showSubActions = ref(false);
const isMouseCurrentlyHover = ref(false);

const iconUrl = computed(() => {
  return new URL(`/src/assets/icons/${props.actionItem.icon}`, import.meta.url).href;
});

const subActionsContainerPosition = computed((): Coordinates => {
  if (actionRef.value) {
    return {
      x: actionRef.value.getBoundingClientRect().right,
      y: actionRef.value.getBoundingClientRect().top
    };
  }
  return { x: 0, y: 0 };
});

const setShowSubActions = (show: boolean) => {
  isMouseCurrentlyHover.value = show;
  setTimeout(() => {
    if (!show && !isMouseCurrentlyHover.value) {
      showSubActions.value = show;
    } else {
      showSubActions.value = true;
    }
  }, 200);
};
</script>

<style scoped>
.material-icon {
  font-size: 18px;
}

.action {
  padding: 3px 8px;
  margin-right: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.action:hover {
  background-color: var(--selected-color_opacity);
  border-radius: var(--border-radius);
}

.disabled-action {
  cursor: default;
  opacity: 0.3;
}

.action-name {
  margin-left: var(--margin);
}

hr {
  margin: 5px 0px;
}

.separator-line {
  margin: 5px;
  border-bottom: 1px solid var(--font-color_light);
}
</style>

<template>
  <div v-if="editedAvatar" style="display: flex">
    <div>
      <div
        v-for="(item, key) of categories"
        @click="openedCategory = { item, key }"
        :key="key"
        style="padding: 5px; background-color: antiquewhite; cursor: pointer"
        :style="openedCategory?.key === key ? 'background-color: #e6e6e6 !important' : ''"
      >
        {{ key }}
      </div>
    </div>
    <div>
      <Avatar :avatar="editedAvatar" :height="260" />
    </div>
    <div>
      <div v-if="openedCategory">
        <div v-for="(item, key) of openedCategory.item" :key="key" @click="editedAvatar[openedCategory.key] = key">
          <div :style="`background-color: ${item} !important; cursor: pointer; padding: 5px;`">
            {{ key }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <svg
      :style="`height: ${height}px; `"
      viewBox="0 0 264 280"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <circle id="path-1" cx="120" cy="120" r="120"></circle>
        <path
          d="M12,160 C12,226.27417 65.72583,280 132,280 C198.27417,280 252,226.27417 252,160 L264,160 L264,-1.42108547e-14 L-3.19744231e-14,-1.42108547e-14 L-3.19744231e-14,160 L12,160 Z"
          id="path-2"
        ></path>
        <path
          d="M124,144.610951 L124,163 L128,163 L128,163 C167.764502,163 200,195.235498 200,235 L200,244 L0,244 L0,235 C-4.86974701e-15,195.235498 32.235498,163 72,163 L72,163 L76,163 L76,144.610951 C58.7626345,136.422372 46.3722246,119.687011 44.3051388,99.8812385 C38.4803105,99.0577866 34,94.0521096 34,88 L34,74 C34,68.0540074 38.3245733,63.1180731 44,62.1659169 L44,56 L44,56 C44,25.072054 69.072054,5.68137151e-15 100,0 L100,0 L100,0 C130.927946,-5.68137151e-15 156,25.072054 156,56 L156,62.1659169 C161.675427,63.1180731 166,68.0540074 166,74 L166,88 C166,94.0521096 161.51969,99.0577866 155.694861,99.8812385 C153.627775,119.687011 141.237365,136.422372 124,144.610951 Z"
          id="path-silhouette"
        ></path>
      </defs>
      <g id="Avataaar" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-825.000000, -1100.000000)" id="Avataaar/Circle">
          <g transform="translate(825.000000, 1100.000000)">
            <template v-if="isCircle">
              <g id="Circle" stroke-width="1" fill-rule="evenodd" transform="translate(12.000000, 39.000000)">
                <mask id="mask-1" fill="white">
                  <use xlink:href="#path-1"></use>
                </mask>
                <use id="Circle-Background" fill="#E6E6E6" xlink:href="#path-1"></use>
                <g id="Color/Palette/Blue-01" mask="url(#mask-1)" :fill="circleColor">
                  <rect id="🖍Color" x="0" y="0" width="240" height="240"></rect>
                </g>
              </g>
              <mask id="mask-2" fill="white">
                <use xlink:href="#path-2" />
              </mask>
            </template>
            <g id="Mask" />
            <g id="Avataaar" stroke-width="1" fill-rule="evenodd" fill="black" mask="url(#mask-2)">
              <g id="Body" transform="translate(32.000000, 36.000000)">
                <mask id="mask-silhouette" fill="white">
                  <use xlink:href="#path-silhouette"></use>
                </mask>
                <use :fill="skinColors[skinColorValue]" xlink:href="#path-silhouette"></use>
                <path
                  d="M156,79 L156,102 C156,132.927946 130.927946,158 100,158 C69.072054,158 44,132.927946 44,102 L44,79 L44,94 C44,124.927946 69.072054,150 100,150 C130.927946,150 156,124.927946 156,94 L156,79 Z"
                  id="Neck-Shadow"
                  fill-opacity="0.100000001"
                  fill="#000000"
                  mask="url(#mask-silhouette)"
                ></path>
              </g>
              <svg :style="cssVars" v-html="clothesType[clotheTypeValue]"></svg>
              <svg
                v-if="clotheTypeValue === 'GraphicShirt'"
                :style="cssVars"
                v-html="GraphicShirtTypes[graphicTypeValue]"
              ></svg>
              <svg v-html="eyeTypes[eyeTypeValue]"></svg>
              <svg v-html="mouthTypes[mouthTypeValue]"></svg>
              <svg v-html="eyebrowTypes[eyebrowTypeValue]"></svg>
              <svg>
                <g fill="black" transform="translate(76.000000, 82.000000)">
                  <g id="Nose/Default" transform="translate(28.000000, 40.000000)" opacity="0.16">
                    <path
                      d="M16,8 C16,12.418278 21.372583,16 28,16 L28,16 C34.627417,16 40,12.418278 40,8"
                      id="Nose"
                    ></path>
                  </g>
                </g>
              </svg>
              <svg :style="cssVars" v-html="topTypes[topTypeValue]"></svg>
              <svg :style="cssVars" v-html="facialHairTypes[facialHairTypeValue]"></svg>
              <svg v-html="accessoriesTypes[accessoriesTypeValue]"></svg>
            </g>
          </g>
        </g>
      </g>
    </svg> -->
</template>

<script setup lang="ts">
import { defineProps, computed, PropType, ref, watch, onMounted } from "vue";

import Avatar from "./Avatar.vue";
import AvatarModel from "./Avatar";

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
  accessoriesType: accessoriesTypes,
  facialHairType: facialHairTypes,
  clotheType: clothesType,
  eyeType: eyeTypes,
  eyebrowType: eyebrowTypes,
  mouthType: mouthTypes,
  skinColor: skinColors,
  graphicType: GraphicShirtTypes,
  hairColor: hairColors,
  facialHairColor: hairColors,
  topColor: hatAndShirtColors,
  clotheColor: hatAndShirtColors,
};

const editedAvatar = ref<AvatarModel>();

const openedCategory = ref();

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

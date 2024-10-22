<template>
  <div style="position: relative">
    <div
      style="position: absolute"
      :style="`height: ${height - 14}px; width: calc(100% -4px); width:100%;`"
    >
      <TresCanvas>
        <TresPerspectiveCamera />
        <primitive :object="primitive" />

        <!-- <TresMesh>
          <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
          <TresMeshBasicMaterial color="red" />
        </TresMesh> -->
        <OrbitControls />
      </TresCanvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

import { useLoader } from "@tresjs/core";
import { OrbitControls, useFBX } from "@tresjs/cientos";
import fileSystem from "@/context/fileSystemController";
import ItemDialog from "@/models/ItemDialog";
import { TresCanvas } from "@tresjs/core";
import { onBeforeMount, onMounted, PropType, ref } from "vue";
import useBase64Handler from "@/hooks/useBase64Handler";
import { Group, Loader, Object3DEventMap } from "three";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: {
    type: Number,
    required: true,
  },
});

const { base64ToArrayBuffer, removeDataUri } = useBase64Handler();

// const file3d = ref<Group<Object3DEventMap>>();
const primitive = ref();

onMounted(async () => {
  if (props.itemDialog?.path) {
    const path =
      "https://raw.githubusercontent.com/" +
      "Tresjs/assets/main/models/fbx/low-poly-truck/Jeep_done.fbx";
    const testFbx = await useFBX(path);

    primitive.value = testFbx;
  }
});
</script>

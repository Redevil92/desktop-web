<template>
  <div class="search-bar-container">
    <span class="mdi mdi-magnify mdi-40 search-icon"></span>
    <input id="search-bar" placeholder="Type here to search" :type="type" v-model="search" />
    <textarea name="" id="" cols="30" rows="10"></textarea>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default {
  props: {
    modelValue: String, // previously was `value: String`
    type: { type: String, default: "text" }, // previously was `value: String`
  },

  setup() {
    const search = ref("");

    return { search };
  },
};
</script>

<style lang="css" scoped>
.search-bar-container {
  position: relative;
}

input {
  font-size: var(--small-font-size);
  border: none;
  padding: 10px;
  padding-left: 35px;
  /* border-bottom: 1px solid white; */
  background-color: rgba(255, 255, 255, 0.21);
  color: white;
  width: 100%;
}

input:focus {
  outline: 4px solid var(--primary-color);
  border: 1px solid var(--primary-color);
}

.search-icon {
  color: white;
  position: absolute;
  font-size: var(--icon-font-size);
  left: 5px;
  top: 3px;
}
</style>

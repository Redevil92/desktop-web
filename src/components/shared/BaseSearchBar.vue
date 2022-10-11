<template>
  <div class="search-bar-container">
    <span class="mdi mdi-magnify mdi-28 search-icon"></span>
    <input id="search-bar" placeholder="Type here to search" :type="type" v-model="search" />
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

input::placeholder {
  color: white;
}

/* input:focus {
  border-bottom: 2px solid var(--primary-color);
  outline: none;
} */

input:focus,
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  border: none;
  border-bottom: 2px solid var(--primary-color);
  outline: none;
  background-color: rgba(255, 255, 255, 0.21);
}

.search-icon {
  color: white;
  position: absolute;
  font-size: var(--small-icon-size);
  left: 7px;
  top: 7px;
}
</style>

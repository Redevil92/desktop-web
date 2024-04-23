<template>
  <div class="debud-mode-flag" v-if="isDebugMode">DEBUG MODE ACTIVE</div>
  <router-view />
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

const isDebugMode = computed(() => import.meta.env.VITE_DEBUG_MODE === 'true');
</script>

<style>
@import '../public/index.css';

#app {
  font-family: Segoe, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 20px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.debud-mode-flag {
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 200;
  background-color: #ffecec;
  padding: 5px 10px;
  border: 2px solid #db5353;
  border-radius: 5px;
  font-size: var(--medium-font-size);
  font-weight: 600;
}
</style>

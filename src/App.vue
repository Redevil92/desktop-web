<template>
  <router-view />
</template>

<style>
@import "../public/index.css";

@font-face {
  font-family: "Segoe";
  src: local("Segoe"), url(./assets/fonts/SegoeUIVF.ttf) format("truetype");
}

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
</style>

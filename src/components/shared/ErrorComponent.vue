<template>
  <div class="error-container">
    <div>
      <span class="mdi mdi-github icon"></span>
    </div>
    <div class="text">
      This feauture is not developed at the moment. <br />Please add a discussion
      <a href="https://github.com/Redevil92/desktop-web/discussions" target="_blank">in the github page</a> if you have
      any doubts or you have any ideas for new features.
    </div>
  </div>
</template>

<script lang="ts" setup></script>
<style scoped>
.error-container {
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
}

.icon {
  color: white;
  font-size: 100px;
}

.text {
  font-size: var(--large-font-size);
  text-align: left;
  margin-left: 20px;
}

a:link:active,
a:visited:active {
  color: var(--primary-color_darker);
}

a {
  color: var(--primary-color);
}
</style>

<template>
  <div>
    WORK SPACE->{{ msg }}
    :()
    <br />
    <button @click="addGoal">ADD GOAL</button>
    <div v-for="goal in usersGoals" :key="goal">Ahhhhh {{ goal }}</div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  provide,
  inject,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUpdated,
  onBeforeUpdate,
  onUnmounted,
} from "vue";
import { useStore } from "vuex";

// import { GridLayout, GridItem } from "vue3-grid-layout";

export default defineComponent({
  props: {
    msg: String,
  },
  components: {},
  setup(props, context) {
    const store = useStore();
    //store.dispatch("myAction")

    console.log(props.msg);
    const goals = reactive([] as string[]);

    //provide, inject
    provide("userGoals", goals);
    const uGoals = inject("userGoals"); //-> this should be used in another component

    onBeforeMount(function () {
      console.log("On before unmounted");
    });

    watch(goals, function (val, oldValue) {
      console.log(`Added new goal new COUNT: ${val.length} ///// OLD COUNT: ${oldValue.length}`);
    });

    const filteredGoals = computed(function () {
      return goals.filter((goal: string) => !goal.includes("React"));
    });

    function addGoal(): void {
      goals.push("New goal");
      context.emit("addNewGoal");
    }

    return {
      usersGoals: goals,
      addGoal,
    };
  },
});
</script>

<style scoped></style>

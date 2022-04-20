<template>
  <div>
    <LandingPage />
    <TaskDraior />
  </div>
</template>

<script>
import LandingPage from "../components/LandingPgae.vue";
import TaskDraior from "../components/TaskDraios.vue"
export default {
  name: "home",
  components: {
    LandingPage,
    TaskDraior
  },
};
</script>

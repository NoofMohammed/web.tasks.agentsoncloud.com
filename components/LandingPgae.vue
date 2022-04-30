<template>
  <div>
    <div>
      <div class="tasksM animate__animated animate__rotateIn">
        <v-btn color="warning" dark @click="goToTasksTables">
          Tasks managments
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  methods: {
    async goToTasksTables() {
      this.$router.push({ path: `/tasksTables` });
    },
  },
};
</script>

<style scoped>
.tasksM {
  width: max-content;
  margin: auto;
  margin-top: 20%;
}
</style>

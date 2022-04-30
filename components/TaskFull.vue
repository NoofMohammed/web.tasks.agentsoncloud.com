<template>
  <v-dialog v-model="taskFullView" width="80%" persistent>
    <v-card class="card">
      <v-icon color="red" x-large class="close" @click="closeFullView"
        >mdi-close-circle</v-icon
      >
      <!-- <VueTimepicker v-model="yourTimeValue" @input="showTime" /> -->
      <Task
        :id="taskId"
        :type="type"
        @getCreated="getCreated"
        @closeFullView="$emit('closeFullView')"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import Task from "./Task.vue";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";

export default {
  name: "TaskFull",
  props: {
    taskId: String,
    type: String,
    taskFullView: Boolean,
  },
  components: {
    Task,
    VueTimepicker,
  },
  data() {
    return {
      yourTimeValue: "",
    };
  },
  methods: {
    closeFullView() {
      this.$emit("closeFullView");
    },
    showTime() {
      console.log(this.yourTimeValue);
    },
    getCreated() {
      this.$emit("getCreated");
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
}

.close {
  float: right;
  position: sticky;
  top: 0;
  right: 0;
  z-index: 100;
}
</style>

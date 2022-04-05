<template>
  <div id="date" class="date-container">
    <div>
      <v-row justify="center">
        <v-date-picker
          v-model="date"
          width="300px"
          class="mt-4"
          color="primary"
          :min="nowDate"
        ></v-date-picker>
      </v-row>
    </div>
    <div class="date-button">
      <v-btn color="primary" @click="saveDate"> Choose </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    startDay: String,
  },
  data() {
    return {
      nowDate: this.startDay
        ? this.startDay
        : new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
      date: this.startDay
        ? this.startDay
        : new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
    };
  },
  methods: {
    saveDate(e) {
      // console.log(this.date);
      this.$emit("closeDate", this.date);
    },
  },
};
</script>

<style scoped>
.date-container {
  position: absolute;
  top: 20%;
  left: 63%;
  z-index: 100;
  background: white;
  /* box-shadow: 15px 15px 15px 1px #000000; */
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
.date-button {
  width: 300px;
  margin: 10px auto;
}

.date-button button {
  display: block;
  margin: 0 auto;
  /* text-transform: capitalize; */
}
</style>

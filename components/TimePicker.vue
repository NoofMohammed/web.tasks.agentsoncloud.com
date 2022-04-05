<template>
  <div class="date-container">
    <div>
      <v-row justify="space-around" align="center">
        <v-time-picker
          width="280"
          v-model="picker"
          ampm-in-title
        ></v-time-picker>
      </v-row>
    </div>
    <div class="date-button">
      <v-btn color="primary" @click="saveDate"> Choose </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      picker: null,
    };
  },
  methods: {
    saveDate() {
      if (this.picker !== null) {
        // console.log(this.picker);
        // let time = this.picker.split(":")[0];
        // console.log(time);
        // if (time < 12) {
        //   this.$emit("closeTime", this.picker + " AM");
        // } else if (time == 12) {
        //   this.$emit("closeTime", 12 + ":" + this.picker.split(":")[1] + " PM");
        // } else {
        //   let hh = this.picker.split(":")[0] - 12;
        //   if (hh < 10) {
        //     hh = "0" + hh;
        //   }
        //   this.$emit("closeTime", hh + ":" + this.picker.split(":")[1] + " PM");
        // }
        this.$emit("closeTime", this.picker);
      }
    },
  },
};
</script>

<style scoped>
.date-container {
  position: absolute;
  top: 25%;
  left: 63%;
  z-index: 100;
  background: white;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
.date-button {
  width: 280px;
  margin: 10px auto;
}

.date-button button {
  display: block;
  margin: 0 auto;
  /* text-transform: capitalize; */
}
</style>

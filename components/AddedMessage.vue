<template>
  <body>
    <div class="overlay__content">
      <div class="header-msg">
        <h3>New Task Added successfully</h3>
        <v-icon class="icon">mdi-checkbox-marked-circle</v-icon>
      </div>
      <div class="header-msg">
        <p>
          {{taskName}} task has been added successfully
        </p>
        <span class="btn-ok" @click="endCreate">Ok</span>
      </div>
    </div>
    <div class="overlay"></div>
  </body>
</template>

<script>
export default {
  name: "AddedMessage",
  data() {
    return {};
  },
  methods: {
    endCreate() {
      this.$emit("endCreate");
    },
  },
  props:{
      taskName:String
  }
};
</script>

<style scoped>
.header-msg {
  display: flex;
  justify-content: space-between;
  align-items: center !important;
}
p {
  color: rgb(0 0 0 / 55%);
}
.btn-ok {
  color: #22619e;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 10px;
}
.icon {
  color: #009688;
  font-size: 50px;
}
body {
  height: 100vh;
  position: relative;
}
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(23, 25, 28, 0.7);
}
.overlay__content {
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1100;
  width: 40%;
  padding: 2em 1em 1.5em;
  font-size: 1.2em;
  border-radius: 0.3em;
  box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.3);
}
</style>

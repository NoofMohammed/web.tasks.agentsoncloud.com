<template>
  <p v-if="!toggle">
    {{ comment.slice(0, 400) }}
    <span v-if="comment.length > 400" @click="seeFullComment"
      >... read more</span
    >
  </p>
  <p v-else>{{ comment }} <span @click="seeFullComment"> see less </span></p>
</template>

<script>
export default {
  name: "TextComment",
  props: {
    comment: String,
  },
  data() {
    return {
      toggle: false,
    };
  },
  methods: {
    seeFullComment() {
      this.toggle = !this.toggle;
    },
  },
};
</script>

<style scoped>
span {
  color: #00bcd4;
  cursor: pointer;
}
</style>

<template>
  <div v-if="!flag">
    <p v-if="!toggle">
      {{ comment.slice(0, 400) }}
      <span v-if="comment.length > 400" @click="seeFullComment"
        >... read more</span
      >
    </p>
    <p v-else>{{ comment }} <span @click="seeFullComment"> see less </span></p>
  </div>
  <div v-else>
    <v-text-field v-model="text" />
    <v-btn color="primary" dark @click="updateComment">Edit</v-btn>
  </div>
</template>

<script>
export default {
  name: "TextComment",
  props: {
    comment: String,
    comment_id:String,
    flag: Boolean,
    type:String
  },
  data() {
    return {
      toggle: false,
      text: "",
    };
  },
  methods: {
    seeFullComment() {
      this.toggle = !this.toggle;
    },
    async updateComment (){
      if(this.type ==="comment"){
        const res = await this.$axios.put(`/comments/comments/updateComment/${this.comment_id}` ,{newComment : this.text})
      if(res.status === 200) {
        this.$emit("updateComment", this.comment_id,  this.text)
      }
      }else {
        const res = await this.$axios.put(`/comments/comments/updateReplay/${this.comment_id}` ,{newComment : this.text})
        console.log(res.data);
      if(res.status === 200) {
        this.$emit("updateReplay", this.comment_id,  this.text)
      }
      }
    },
  },
  created() {
    this.text = this.comment;
  },
  updated(){
    if (!this.flag){
       this.text = this.comment;
    }
  }
};
</script>

<style scoped>
span {
  color: #00bcd4;
  cursor: pointer;
}
</style>

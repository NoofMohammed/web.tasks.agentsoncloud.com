<template>
  <div class="container-co">
    <v-card max-width="75%" class="mx-auto">
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Comments</v-toolbar-title>
      </v-toolbar>
      <div class="v-list">
        
          <div class="all" v-for="(item, index) in comments" :key="index">
            <div class="comment">
              <div class="img">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/myfirst-77744.appspot.com/o/4e237423-c1fd-4c43-aba0-646b836bd14a.jpg?alt=media&token=8a79fc3c-107f-4d77-9238-8fa20f67225a"
                  alt="commenter"
                />
              </div>
              <div class="conntect">
                <div class="commenter-name">
                  <p>{{ item.comment.user_name }}</p>
                </div>
                <div class="comment-text">
                  <TextComment
                    :comment="item.comment.comment"
                    :flag="editArray[index]"
                    :comment_id="item.comment.comment_id"
                    type="comment"
                    @updateComment="updateComment"
                  />
                </div>
              </div>
              <v-icon
                v-if="
                  item.comment.user_id === $store.state.userID ||
                  taskCreator === $store.state.userID
                "
                color="error"
                @click="deleteComment(index, item.comment)"
                >mdi-delete</v-icon
              >
              <v-icon
                v-if="
                  item.comment.user_id === $store.state.userID ||
                  taskCreator === $store.state.userID
                "
                color="error"
                @click="editComment(index, item)"
                >mdi-pencil</v-icon
              >
            </div>
            <!-- <p> show replay {{item.replays.length}}  </p> -->
            <CommentReplays
              :replays="item.replays"
              :comment_id="item.comment.comment_id"
              @newReplay="newReplay"
              @deleteReplay="deleteReplay"
              @updateReplay="updateReplay"
            />
          </div>
      </div>
    </v-card>
    <div class="addComment-btn" v-if="!showAddCommentToggle">
      <v-btn @click="showAddCommentToggle = true" color="primary" dark>
        Add Comment
      </v-btn>
    </div>
    <div v-if="showAddCommentToggle">
      <v-textarea
        class="add-comment"
        v-model="userComment"
        color="teal"
        :rules="rules"
        counter="100"
        label="Write You Comment"
        height="70px"
      >
        <template>
          <div>Bio <small>(optional)</small></div>
        </template>
      </v-textarea>
      <div class="addComment-btn">
        <v-btn color="error" dark @click="showAddCommentToggle = false"
          >Cancel</v-btn
        >
        <v-btn color="primary" dark @click="createComment">Submit</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CommentReplays from "./CommentReplays.vue";
import "animate.css";
export default {
  name: "Comments2",
  components: {
    CommentReplays,
  },
  props: {
    comments: Array,
    task_id: String,
    taskCreator: Number,
  },
  data: () => ({
    userComment: "",
    rules: [(v) => v.length <= 100 || "Max 100 characters"],
    showAddCommentToggle: false,
    editArray: [],
  }),
  methods: {
    async createComment() {
      const res = await this.$axios.post(
        `/tasks-management/comments/addComment`,
        {
          task_id: this.task_id,
          user_id: this.$store.state.userID,
          user_name: this.$store.state.username,
          comment: this.userComment,
        }
      );
      if (res.status === 201) {
        this.userComment = "";
        this.$emit("createComment", res.data);
        this.editArray = [...this.editArray, false];
        setTimeout(() => {
          var container = this.$el.querySelector(".v-list");
          container.scroll({ top: container.scrollHeight, behavior: "smooth" });
        }, 40);
      }
    },
    deleteComment(index, item) {
      this.$axios.delete(
        `/tasks-management/comments/deleteComment/${item.comment_id}`
      );
      this.editArray = this.comments
        .map((ele) => {
          return false;
        })
        .slice(0, this.comments.length - 1);
      console.log(this.editArray);
      this.$emit("deleteComment", index);
    },
    editComment(index, item) {
      this.editArray = this.editArray.map((ele, i) => {
        if (index === i) return !ele;
        else return false;
      });
      console.log(this.editArray);
    },
    newReplay(newReplay) {
      this.$emit("addReplay", newReplay);
    },
    deleteReplay(comment_id, replay_id, index) {
      this.$emit("deleteReplay", comment_id, replay_id, index);
    },
    updateComment(comment_id, text) {
      this.editArray = this.comments.map((ele) => {
        return false;
      });
      this.$emit("updateComment", comment_id, text);
    },
    updateReplay(replay_id, text) {
      this.$emit("updateReplay", replay_id, text);
    },
  },
  created() {
    this.editArray = this.comments.map((ele) => {
      return false;
    });
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

p {
  margin: 0;
}

.container-co {
  margin-top: 40px;
  height: auto;
}

.all {
  width: 90%;
  margin: 3% auto;
  padding-bottom: 25px;
  border-bottom: 1px solid gray;
}

.v-list {
  height: 600px;
  overflow-y: auto;
  padding: 20px 0;
}

.comment {
  /* height: 180px; */
  padding: 10px;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  
  /* box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%); */
}

.comment .img {
  width: 10%;
  display: flex;
  justify-content: center;
}

.comment .img img {
  display: block;
  height: 50px;
  width: 50px;
  border-radius: 70%;
}

.comment .conntect {
  width: 88%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.commenter-name p {
  font-size: 17px;
  font-weight: bold;
}

.comment-text p {
  font-size: 15px;
}

.v-list::-webkit-scrollbar {
  width: 10px;
}

.v-list::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}

.v-list::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-image: linear-gradient(180deg, #00bcd4 0%, #1976d2 99%);
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
}

/* ----------------------------------------------------------------------------- */
.add-comment {
  width: 60%;
  margin: 0 auto;
  margin-top: 70px;
}

.addComment-btn {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
}
</style>

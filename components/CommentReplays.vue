<template>
  <div>
    <div class="comment-replays-btn">
      <div v-if="replays.length">
        <button v-if="!showReplays" @click="showReplays = !showReplays">
          show {{ replays.length }} replays
        </button>
        <button v-else @click="showReplays = !showReplays">hide replays</button>
      </div>
      <div>
        <v-btn color="primary" small dark @click="replay">
          <v-icon title="replay">mdi-reply </v-icon>
        </v-btn>
      </div>
    </div>

    <div v-if="showReplays" class="container">
      <div v-for="(item, index) in replays" :key="index">
        <div class="comment">
          <div class="img">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/myfirst-77744.appspot.com/o/4e237423-c1fd-4c43-aba0-646b836bd14a.jpg?alt=media&token=8a79fc3c-107f-4d77-9238-8fa20f67225a"
              alt="commenter"
            />
          </div>
          <div class="conntect">
            <div class="commenter-name">
              <p>{{ item.user_name }}</p>
            </div>
            <div class="comment-text">
              <TextComment
                :comment="item.comment"
                :flag="editArray[index]"
                :comment_id="item.replay_id"
                type="replay"
                @updateReplay="updateReplay"
              />
            </div>
          </div>
          <v-icon
            v-if="item.user_id === $store.state.userID"
            color="error"
            @click="deleteComment(index, item)"
            >mdi-delete</v-icon
          >
          <v-icon
            v-if="item.user_id === $store.state.userID"
            color="error"
            @click="editComment(index, item)"
            >mdi-pencil</v-icon
          >
        </div>
      </div>
    </div>
    <div v-if="addReplay" class="addReplay" :id="comment_id">
      <div class="replayInput">
        <v-text-field
          v-model="comment"
          :rules="[() => !!comment || 'This field is required']"
          :error-messages="commentError"
          @input="commentError = ''"
        ></v-text-field>
      </div>
      <div class="replayButn">
        <v-btn color="primary" dark @click="sendReplay">Replay</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentReplays",
  props: {
    replays: Array,
    comment_id: String,
  },
  data() {
    return {
      editArray: [],
      showReplays: false,
      addReplay: false,
      comment: "",
      commentError: "",
    };
  },
  methods: {
    replay() {
      this.addReplay = true;
      setTimeout(() => {
        document
          .getElementById(`${this.comment_id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    },
    async sendReplay() {
      this.commentError = "";
      if (!this.comment.trim()) {
        return (this.commentError = "This field is required");
      }
      const newReplay = await this.$axios.post(
        `/tasks-management/comments/addReplay`,
        {
          comment_id: this.comment_id,
          user_id: this.$store.state.userID,
          user_name: this.$store.state.username,
          comment: this.comment,
        }
      );
      if (newReplay.status === 201) {
        this.$emit("newReplay", newReplay.data);
        this.comment = "";
        this.addReplay = false;
        this.showReplays = true;
        this.editArray = [...this.editArray , false]
        setTimeout(() => {
          var container = this.$el.querySelector(".container");
          container.scroll({ top: container.scrollHeight, behavior: "smooth" });
        }, 100);
      }
    },
    async deleteComment(index, item) {
      console.log(index, item);
      const res = await this.$axios.delete(
        `/tasks-management/comments/deleteReplay/${item.replay_id}`
      );
      this.editArray = this.replays
        .map((ele) => {
          return false;
        })
        .slice(0, this.replays.length - 1);
      console.log(this.editArray);
      this.$emit("deleteReplay", this.comment_id, item.replay_id, index);
    },
    editComment(index, item) {
      this.editArray = this.editArray.map((ele, i) => {
        if (index === i) return !ele;
        else return false;
      });
      console.log(this.editArray);
    },
    updateReplay(replay_id, text) {
      this.$emit("updateReplay", this.comment_id, replay_id, text);
      this.editArray = this.replays.map((ele) => {
        return false;
      });
    },
  },
  created() {
    this.editArray = this.replays.map((ele) => {
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

.comment-replays-btn {
  width: 90%;
  margin: 0 auto;
  margin-top: -20px;
  display: flex;
  gap: 200px;
}

.addReplay {
  width: 50%;
  margin: 40px auto;
  display: flex;
  justify-content: space-between;
}

.replayInput {
  width: 85%;
}

.replayButn {
  width: 10%;
}

/* ----------------------------------------------------- */

.container {
  width: 80%;
  margin: 0;
  margin-left: 50px;
  margin-top: 0px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  /* background: gainsboro; */
  /* box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), */
  /* 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%); */
}

.comment {
  /* height: 180px; */
  padding: 10px;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  /* width: 90%; */
  margin: 2% auto;
  /* box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%); */
}

.comment .img {
  width: 12%;
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

.container::-webkit-scrollbar {
  width: 10px;
}

.container::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}

.container::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-image: linear-gradient(180deg, #00bcd4 0%, #1976d2 99%);
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
}

/* ----------------------------------------------------------------------------- */
</style>

<template>
  <div v-if="loading" class="not-loading">
    <!-- <nuxt-link class="link" to="/tasksTables">Task Managment</nuxt-link> -->
    <div class="container" v-if="task">
      <div class="headers">
        <div class="title">
          <p>{{ type }} / Full Task Details</p>
        </div>
        <div class="user-btn">
          <div>
            <v-btn
              v-if="type === 'genelar'"
              depressed
              color="primary"
              @click="claimToggle = true"
            >
              Claim
            </v-btn>
          </div>
          <div v-if="task">
            <UpdateTask
              :task="task"
              :assignedUsers="assignedUsers"
              v-if="task.creator === $store.state.userID"
              @newTask="newTask"
              @closeDialog="closeDialog"
            />
          </div>
          <div>
            <v-btn
              v-if="task.creator === $store.state.userID"
              depressed
              color="error"
              @click="deleteDialog = !deleteDialog"
            >
              Delete Task
            </v-btn>
          </div>
        </div>
      </div>
      <div class="peranet">
        <div class="left">
          <div class="task-data">
            <div>
              <p>Task Subject</p>
              <p>{{ task.subject }}</p>
            </div>
            <div>
              <p>By</p>
              <p>{{ task.creator_name }}</p>
            </div>
            <div>
              <p>Assigned To</p>
              <p>
                <span v-for="(user, i) in assignedUsers" :key="i">
                  {{ user.user_name }}
                </span>
                <span v-if="assignedUsers.length === 0"
                  >No user is assigned to this task</span
                >
              </p>
            </div>
            <div>
              <p>Task Date</p>
              <p>{{ task.created_date }}</p>
            </div>
            <div>
              <p>Task Time</p>
              <p>{{ task.created_time }}</p>
            </div>
            <div>
              <p>Work Status</p>
              <div class="text-center" @click="chickClaim">
                <v-menu offset-y :disabled="type === 'genelar'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                      {{ task.status }} <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="changeStatus(item.title)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
            <div>
              <p>Priority</p>
              <p class="aaaaaa">
                {{
                  task.priority === 1
                    ? "high"
                    : task.priority === 2
                    ? "meduim"
                    : "low"
                }}
              </p>
            </div>
            <div>
              <p>Due Date</p>
              <p>{{ task.due_date }}</p>
            </div>
            <div>
              <p>Due Time</p>
              <p>{{ task.due_time }}</p>
            </div>
            <div>
              <p>Estimated Time For Task :</p>
              <p>{{ task.estimated_time }}</p>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="desc">
            <p>Task Description :</p>
          </div>
          <div class="decs-text">
            <p>{{ task.description }}</p>
          </div>
        </div>
      </div>
      <div class="tabs">
        <button
          class="tab-button"
          v-bind:class="{ active: tab === 'comment' }"
          @click="tab = 'comment'"
        >
          Comments
        </button>
        <button
          class="tab-button"
          v-bind:class="{ active: tab === 'logs' }"
          @click="tab = 'logs'"
        >
          Logs
        </button>
      </div>
      <transition
        enter-active-class="animate__animated animate__fadeInDown"
        leave-active-class="animate__animated animate__fadeOutUp"
      >
        <div v-if="tab === 'comment'">
          <!-- <Comments
            :comments="comments"
            :task_id="id"
            :taskCreator="task.creator"
            @createComment="createComment"
            @deleteComment="deleteComment"
            @addReplay="addReplay"
            @deleteReplay="deleteReplay"
            @updateComment="updateComment"
            @updateReplay="updateReplay"
          /> -->
          <Comments
            :id="id"
            type="task"
            :taskCreator="task.creator + ''"
            :userId="$store.state.userID + ''"
            :userName="$store.state.username"
          />
          <!-- <div class="addComment-btn" v-if="!showAddCommentToggle">
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
          </div> -->
        </div>
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn">
        <div v-if="tab !== 'comment'">
          <Logs :taskLogs="taskLogs" />
        </div>
      </transition>
    </div>
    <!-- <v-dialog v-model="deleteDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 popupText">
          Are You Sure
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text class="delete-message">
          Do you want to delete this task
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteTask"> delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <v-dialog v-model="claimToggle" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 popupText">
          Are You Sure
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text class="delete-message">
          Do you want to take this task
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="claimToggle = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="claimTask"> claim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="claimMSG" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 popupText">
          Claim The Task First
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text class="delete-message">
          Do you want to take this task
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="claimMSG = false"> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="claimTask"> Claim Now</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="deleteDialog">
      <div class="overlay__content">
        <div class="header-msg">
          <h3>Delete Task</h3>
          <v-icon class="icon">mdi-delete-forever</v-icon>
        </div>
        <div class="header-msg">
          <p>
            You are sure you want to delete<br />
            This Task, {{ task.subject }}?
          </p>
          <div>
            <button class="btn-cancel" @click="deleteDialog = false">
              Cancel
            </button>
            <button class="btn-delete" @click="deleteTask">Delete</button>
          </div>
        </div>
      </div>
      <div class="overlay"></div>
    </div>
  </div>
  <div v-else class="loading">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
import UpdateTask from "./UpdateTask.vue";
import Comments2 from "./Comments2.vue";
import Comments from "./Comments.vue";
import Logs from "./Logs.vue";
import Swal from "sweetalert2";
import "animate.css";
export default {
  name: "Task",
  components: {
    Comments2,
    UpdateTask,
    Logs,
  },
  props: {
    id: String,
    type: String,
  },
  data() {
    return {
      loading: false,
      task: null,
      comments: [],
      assignedUsers: [],
      taskLogs: [],
      // userComment: "",
      // rules: [(v) => v.length <= 100 || "Max 100 characters"],
      // showAddCommentToggle: false,
      deleteDialog: false,
      claimToggle: false,
      claimMSG: false,
      tab: "comment",
      items: [
        { title: "on hold" },
        { title: "progress" },
        { title: "completed" },
      ],
    };
  },

  methods: {
    async getData() {
      [this.task, this.assignedUsers, this.taskLogs] = await Promise.all([
        this.getTaskInfo(),
        this.getAssignUsers(),
        this.getTaskLogs(),
      ]);
    },
    async getTaskInfo() {
      const res = await this.$axios.get(
        `/tasks-management/tasks/oneTask/${this.id}`
      );
      this.loading = true;
      return res.data;
    },
    async getTaskComments() {
      const res = await this.$axios.get(
        `/tasks-management/comments/task/${this.id}`
      );
      return res.data;
    },
    async getAssignUsers() {
      const res = await this.$axios.get(
        `/tasks-management/tasks/task/assign/${this.id}`
      );
      console.log(res.data, " this.assignedUsers  dgdgdg");
      return res.data;
    },
    async getTaskLogs() {
      const res = await this.$axios.get(
        `/tasks-management/tasks/id/${this.id}`
      );
      console.log(res.data, "looooooooogs");
      return res.data;
    },
    createComment(newComment) {
      this.comments.push(newComment);
    },
    deleteComment(id) {
      this.comments.splice(id, 1);
    },
    updateComment(comment_id, text) {
      this.comments = this.comments.map((ele) => {
        if (ele.comment.comment_id === comment_id) {
          return { ...ele, comment: { ...ele.comment, comment: text } };
        } else return ele;
      });
    },
    async updateReplay(comment_id, replay_id, text) {
      console.log(comment_id, replay_id, text);
      this.comments = await this.getTaskComments();
      // this.comments = this.comments.map((ele)=>{
      //   if (ele.comment.comment_id === comment_id) {
      //     console.log("yes must edit");
      //     return {...ele , replays:ele.replays.map((el)=>{
      //       if (el.replay_id === replay_id) return {...el , comment:text}
      //       else return el
      //     })}
      //   }else {
      //     return ele
      //   }
      // })
    },
    addReplay(newReplay) {
      this.comments = this.comments.map((ele) => {
        if (ele.comment.comment_id === newReplay.comment_id) {
          return { ...ele, replays: [...ele.replays, newReplay] };
        } else {
          return ele;
        }
      });
    },
    deleteReplay(comment_id, replay_id, index) {
      this.comments = this.comments.map((ele) => {
        if (ele.comment.comment_id === comment_id) {
          console.log("i am here");
          return {
            ...ele,
            replays: ele.replays.filter((item) => {
              return item.replay_id !== replay_id;
            }),
          };
        } else {
          return ele;
        }
      });
      // this.comments[index].replays = this.comments[index].replays.filter((item) => {
      //   return item.replay_id !== replay_id;
      // });
    },
    async claimTask() {
      const res = await this.$axios.put(
        `/tasks-management/tasks/task/claimme/${this.task.task_id}`,
        {
          userId: this.$store.state.userID,
          user_name: this.$store.state.username,
        }
      );
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          this.$router.push({ path: `/task/assigned/${this.task.task_id}` });
        }, 1600);
      }
    },
    async deleteTask() {
      this.$store.dispatch("deleteTask", this.task.task_id);
      if (true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          this.$emit("closeFullView");
        }, 1600);
      }
    },
    async changeStatus(newStatus) {
      const res = await this.$axios.put(
        `/tasks-management/tasks/task/changeStatus/${this.task.task_id}`,
        {
          newStatus: newStatus,
        }
      );
      if (res.status === 200) {
        this.task.status = newStatus;
        this.taskLogs = await this.getTaskLogs();
      }
    },
    chickClaim() {
      if (this.type === "genelar") {
        this.claimMSG = true;
      }
    },
    async newTask(data) {
      console.log("newTask");
      this.task = data;
      const res = await this.$axios.get(
        `/tasks-management/tasks/task/assign/${this.id}`
      );
      this.assignedUsers = res.data;
      this.taskLogs = await this.getTaskLogs();
    },
    closeDialog() {
      console.log("closeDialog");
      this.getData();
      this.$emit("getCreated");
    },
  },
  mounted() {
    this.getData();
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

.link {
  display: block;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
  width: max-content;
  margin: 30px auto;
  color: white;
  background-color: #1976d2;
  padding: 10px 25px;
  border-radius: 5px;
}

.container {
  /* width: 85%;
  margin: 50px auto;
  min-height: 80vh;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 5px 5px 5px 5px #000000; */
  padding: 30px 10px;
}

.headers {
  margin-top: 30px;
  display: flex;
  position: relative;
}

.title {
  width: 100%;
  text-align: center;
}

.user-btn {
  /* position: absolute;
  right: 0; */
  display: flex;
  gap: 30px;
}

/* -------------------------------------------------------------------------------------*/

.task-data div {
  display: flex;
  align-items: center;
  margin-top: 10px;
  height: 50px;
}

.task-data div p {
  width: 50%;
}

.task-data p {
  text-transform: capitalize;
}

/* --------------------------------------------------------------------------------- */

.peranet {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  min-height: 50vh;
}

.left,
.right {
  width: 49%;
  min-height: 100%;
  padding: 0 20px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}

/*----------------------------------------------------------------------------------------*/

.desc p {
  margin-top: 30px;
  font-size: 30px;
  font-weight: bold;
}

.decs-text {
  width: 90%;
  margin: 30px auto;
  background: #e0e0e0;
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 5px;
}

.decs-text::-webkit-scrollbar {
  width: 10px;
}

.decs-text::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}

.decs-text::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-image: linear-gradient(180deg, #00bcd4 0%, #1976d2 99%);
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
}

/* --------------------------------------------------------------------- */

.tabs {
  width: 85%;
  margin: 0 auto;
  margin-top: 3%;
  display: flex;
  justify-content: center;
  gap: 5%;
}

.tabs button {
  display: block;
}

.tab-button {
  background: #e0e0e0;
  color: black;
  padding: 15px 10px;
  width: 180px;
  text-align: center;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
}

.active {
  background-color: #1976d2;
  color: white;
  padding: 10px 25px;
  border-radius: 5px;
}

/*---------------------------------------------------------------------------------------------------- */

.delete-message {
  margin-top: 20px;
}

.header-msg {
  display: flex;
  justify-content: space-between;
  align-items: center !important;
}
p {
  color: rgb(0 0 0 / 55%);
}
.btn-delete {
  color: #22619e;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 10px;
  font-weight: bold;
}
.btn-cancel {
  color: rgb(0 0 0 / 55%);
  cursor: pointer;
  margin-top: 10px;
  margin-right: 10px;
  font-weight: bold;
}
.icon {
  color: red;
  font-size: 50px;
  margin-right: 50px;
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
  z-index: 1;
  width: 40%;
  padding: 2em 1em 1.5em;
  font-size: 1.2em;
  border-radius: 0.3em;
  box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.3);
}

/* -------------------------------------------------------------------------------------*/

.loading {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  column-gap: 0.5rem;
  row-gap: 1.5rem;
  width: 100vw;
  height: 40vh;
  background: #000000;
}

.loading:after {
  content: "Logging you in";
  color: #fff;
  flex: 0 100%;
  font: 700 1.3rem "Caveat", cursive;
  text-align: center;
}

.loading div {
  background-color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  position: relative;
  top: 30%;
  animation: loading-effect 1s cubic-bezier(0.77, 0.8, 0.58, 1) infinite
    var(--delay, 0.2s) alternate-reverse;
}

.loading div:nth-child(2) {
  --delay: 0.4s;
}
.loading div:nth-child(3) {
  --delay: 0.6s;
}
.loading div:nth-child(4) {
  --delay: 0.8s;
}
.loading div:nth-child(5) {
  --delay: 1s;
}

@keyframes loading-effect {
  0% {
    box-shadow: 0 0 4px 1px #fff3;
    opacity: 0.2;
    transform: translateY(3px) scale(1.1);
  }

  100% {
    opacity: 0.8;
    transform: translateY(-3px);
  }
}
</style>

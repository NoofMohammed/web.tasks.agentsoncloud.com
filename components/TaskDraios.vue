<template>
  <div>
    <v-icon large color="#248585" @click="openDialog"
      >mdi-checkbox-marked-circle-plus-outline</v-icon
    >
    <div v-if="dialog" class="dialog">
      <div>
        <div class="header">
          <div><p>filter by:</p></div>
          <div class="filter" @click="showCreator"><p>by who</p></div>
          <div class="filter" @click="toggleWorkStatus"><p>work status</p></div>
          <div class="filter" @click="togglePriority"><p>priority</p></div>
          <div class="filter" @click="showSearch"><p>serach</p></div>
        </div>
        <div class="search-inputs">
          <div class="search-input" v-if="search">
            <v-text-field
              label="Task Name"
              v-model="searchText"
              @input="searchAll"
            ></v-text-field>
          </div>
          <div class="search-input" v-if="creator">
            <v-text-field
              label="Creator name"
              v-model="creatorText"
              @input="searchAll"
            ></v-text-field>
          </div>
          <div class="search-input" v-if="showWorkStatus">
            <v-select
              :items="workStatus"
              v-model="selctedWorkStatus"
              @input="searchAll"
              label="Select Work status"
            ></v-select>
          </div>
          <div class="search-input" v-if="showPriority">
            <v-select
              :items="priority"
              v-model="selctedPriority"
              @input="searchAll"
              label="Select priority"
            ></v-select>
          </div>
        </div>
      </div>
      <div class="tabs">
        <div v-bind:class="{ active: active === 1 }" @click="changeTab(1)">
          <p>Assigned to me</p>
        </div>
        <div v-bind:class="{ active: active === 2 }" @click="changeTab(2)">
          <p>General</p>
        </div>
        <div v-bind:class="{ active: active === 3 }" @click="changeTab(3)">
          <p>Created by me</p>
        </div>
      </div>
      <div class="tasks">
        <div
          class="task"
          v-for="(task, index) in $store.getters.getTasks"
          :key="index"
        >
          <div class="photo">
            <div></div>
          </div>
          <div class="mid">
            <div>
              <p>by: {{ task.creator_name }}</p>
            </div>
            <div class="subject">
              <p>{{ task.subject }}</p>
            </div>
            <div>
              <p>{{ task.created }}</p>
            </div>
          </div>
          <div class="end">
            <div>
              <p>work status : {{ task.status }}</p>
            </div>
            <div class="priority">
              <p>
                Priority:
                <span
                  v-bind:class="{
                    high: task.priority === 1,
                    meduim: task.priority === 2,
                    low: task.priority === 3,
                  }"
                  >{{
                    task.priority === 1
                      ? "High"
                      : task.priority === 2
                      ? "Meduim"
                      : "Low"
                  }}</span
                >
              </p>
            </div>
            <div>
              <p>Due: {{ task.deadline }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskDraior",
  data() {
    return {
      dialog: false,
      active: 1,
      search: false,
      creator: false,
      searchText: "",
      creatorText: "",
      showPriority: false,
      priority: ["All", "High", "Meduim", "Low"],
      selctedPriority: "All",
      workStatus: ["All", "New", "on hold", "progress", "completed"],
      showWorkStatus: false,
      selctedWorkStatus: "All",
    };
  },
  methods: {
    openDialog() {
      this.dialog = !this.dialog;
    },
    changeTab(n) {
      this.active = n;
      if (n === 1) {
        this.getAssignedTasks();
      } else if (n === 2) {
        this.getGeneralTasks();
      } else if (n === 3) {
        this.getCreatedTasks();
      }
      this.searchText = "";
      this.creatorText = "";
    },
    getAssignedTasks() {
      this.$store.dispatch("getAssignedTaskas");
    },
    getGeneralTasks() {
      this.$store.dispatch("getGeneralTaskas");
    },
    getCreatedTasks() {
      this.$store.dispatch("getCreatedTasks");
    },
    showSearch() {
      this.search = !this.search;
      // this.creator = false;
      this.searchText = "";
      // this.creatorText = "";
      // this.$store.commit("setAllTasks");
    },
    showCreator() {
      this.creator = !this.creator;
      // this.search = false;
      // this.searchText = "";
      this.creatorText = "";
      // this.$store.commit("setAllTasks");
    },
    togglePriority() {
      this.showPriority = !this.showPriority;
      this.selctedPriority = "All";
    },
    toggleWorkStatus() {
      this.showWorkStatus = !this.showWorkStatus;
      this.SelctedWorkStatus = "All";
    },
    searchAll() {
      // let subject = this.searchText ? this.searchText : "no";
      // let creator = this.creatorText ? this.creatorText : "no";
      let priority =
        this.selctedPriority === "High"
          ? 1
          : this.selctedPriority === "Meduim"
          ? 2
          : this.selctedPriority === "Low"
          ? 3
          : 0;
      let work = this.selctedWorkStatus;
      if (work === "All") {
        work = 0;
      }

      this.$store.commit("searchAll", {
        subject: this.searchText,
        creator: this.creatorText,
        priority,
        workStatus: work,
      });
    },
  },
  created() {
    this.getAssignedTasks();
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

p {
  margin: 0;
  padding: 0;
}

.dialog {
  position: fixed;
  top: 80px;
  // left: 300px;
  right: 50px;
  width: 450px;
  background: white;
  transform-origin: center center;
  z-index: 10;
  //   display: none;
  border: 1px solid rgb(247, 247, 247);
  padding: 0;
  font-size: 15px;
}

.header {
  width: 100%;
  height: 80px;
  background: rgb(247, 247, 247);
  display: flex;
  justify-content: space-around;
}

.header div {
  margin-top: 10px;
  width: max-content;
  padding: 10px;
  height: max-content;
  border-radius: 10 px;
}

.dialog .tabs {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px rgb(247, 247, 247) solid;
}

.dialog .tabs div {
  padding: 10px;
  width: 31%;
  text-align: center;
  color: rgb(204, 202, 202);
  cursor: pointer;
}

.dialog .tabs .active {
  color: #89d5d2;
}

.header .filter {
  background: white;
  cursor: pointer;
}

.search-inputs {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 15px;
}

.search-input {
  width: 45%;
}

/* ---------------------------------------------------------- */

.dialog .tasks {
  height: 380px;
  overflow-y: auto;
  background: white;
}

.dialog .tasks .task {
  display: flex;
  width: 100%;
  height: 100px;
  margin-top: 20px;
  font-size: 13px;
  padding: 5px 0;
  border: 1px solid rgb(247, 247, 247);
}

.dialog .tasks .task .photo {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog .tasks .task .photo div {
  height: 50px;
  width: 50px;
  border-radius: 70%;
  background: rgb(247, 247, 247);
}

.dialog .tasks .task .mid,
.dialog .tasks .task .end {
  width: 42.5%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dialog .tasks .task .mid .subject {
  color: #1867c0;
  text-decoration: underline;
}

.priority .high {
  color: #ff5252;
}

.priority .meduim {
  color: #fb8c00;
}

.priority .low {
  color: #4caf50;
}
</style>

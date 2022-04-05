<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="inimation" class="container">
        <div class="Main-Filter">
          <v-row>
            <v-col cols="12" sm="2">
              <button
                class="tab-button"
                v-bind:class="{ assigned: assigned }"
                @click="changeTabs('assigned')"
              >
                Assigned To Me
              </button>
            </v-col>
            <v-col cols="12" sm="2">
              <button
                class="tab-button"
                v-bind:class="{ general: general }"
                @click="changeTabs('general')"
              >
                General Tasks
              </button>
            </v-col>
            <v-col cols="12" sm="2">
              <button
                class="tab-button"
                v-bind:class="{ created: created }"
                @click="changeTabs('created')"
              >
                Created By Me
              </button>
            </v-col>
            <v-col cols="12" sm="2">
              <button
                class="tab-button"
                v-bind:class="{ deleted: deleted }"
                @click="changeTabs('deleted')"
              >
                Deleted Tasks
              </button>
            </v-col>
            <v-col class="" cols="12" sm="4">
              <v-select
                class="select-categorys"
                :items="categorys"
                v-model="selectCategoryname"
                @change="filterTasks"
                dense
                filled
                label="Time Filters"
              ></v-select>
            </v-col>
          </v-row>
        </div>
        <div class="table" v-if="assigned || general || created || deleted">
          <div class="search">
            <div class="search-l">
              <div class="search-input">
                <v-text-field
                  label="Task Name"
                  v-model="searchText"
                  solo
                ></v-text-field>
              </div>
              <div class="search-icon">
                <v-icon large @click="search" color="indigo">mdi-magnify</v-icon>
              </div>
            </div>
            <div class="creteTask">
              <CreateTask @getCreated="changeTabs('created')" />
            </div>
          </div>
          <v-data-table
            :headers="headers"
            :items="this.$store.state.tasks"
            class="elevation-1"
            height="600px"
            single-select
            @click:row="rowClick"
          >
            <template v-slot:item.subject="{ item }">
              <p @click="goTask(item)" class="fffffffff">
                {{ item.subject }}
              </p>
            </template>

            <template v-slot:item.priority="{ item }">
              <v-chip class="ccc" :color="getColor(item.priority)" dark>
                {{
                  item.priority === 1
                    ? "H"
                    : item.priority === 2
                    ? "M"
                    : item.priority === 3
                    ? "L"
                    : ""
                }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-dots-vertical
              </v-icon>
            </template>

            <template v-if="created || general" v-slot:item.actions2="{ item }">
              <v-icon small class="mr-2" @click="seeAssignee(item)">
                mdi-eye
              </v-icon>
            </template>
          </v-data-table>
        </div>

        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2 popupText">
              Update Task Status
            </v-card-title>
            <v-card-text v-if="assigned || created">
              <v-btn
                text
                @click="changeCo"
                :color="co ? 'primary' : ''"
                width="450"
              >
                Completed
              </v-btn>
            </v-card-text>
            <v-card-text v-if="assigned || created">
              <v-btn
                text
                @click="changePr"
                :color="pr ? 'primary' : ''"
                width="450"
              >
                Progress
              </v-btn>
            </v-card-text>
            <v-card-text v-if="assigned || created">
              <v-btn
                text
                @click="changeHo"
                :color="ho ? 'primary' : ''"
                width="450"
              >
                On Hold
              </v-btn>
            </v-card-text>
            <v-card-text v-if="general">
              <v-btn
                text
                width="450"
                @click="cliam = !cliam"
                :color="cliam ? 'primary' : ''"
              >
                Cliam
              </v-btn>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="error" text @click="dialog = false"> Cancel </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="chngeItemStatus">
                update task status</v-btn
              >
            </v-card-actions>
            <v-card-title
              v-if="created"
              class="text-h5 grey lighten-2 popupText"
            >
              Actions
            </v-card-title>
            <v-card-text v-if="created">
              <v-btn
                text
                width="450"
                @click="(dialog2 = true), (dialog = false)"
                color="error"
              >
                delete task
              </v-btn>
            </v-card-text>

            <!-- <v-card-title  class="text-h5 grey lighten-2 popupText">
          Add Comment
        </v-card-title> -->
            <v-card-text>
              <v-btn
                text
                width="450"
                @click="goTask(currentTask)"
                color="warning"
              >
                Add Comment
              </v-btn>
            </v-card-text>

            <!-- <v-card-title v-if="created" class="text-h5 grey lighten-2 popupText">
          Reassign
        </v-card-title> -->
            <v-card-text v-if="created">
              <v-btn text width="450" color="warning" @click="showAssignDiv">
                Reassign task
              </v-btn>
            </v-card-text>

            <v-card-text v-if="created && assignToggle">
              <div class="assingee-div">
                <v-combobox
                  v-model="chips"
                  :items="users"
                  item-value="user_id"
                  item-text="user_name"
                  chips
                  clearable
                  label="Enter Nmae"
                  multiple
                  prepend-icon="mdi-filter-variant"
                  class="assingee"
                >
                  <template
                    v-slot:selection="{ attrs, item, select, selected }"
                  >
                    <v-chip
                      v-bind="attrs"
                      :input-value="selected"
                      close
                      @click="select"
                      @click:close="remove(item)"
                      class="overFFF"
                    >
                      <strong>{{ item.user_name }}</strong>
                    </v-chip>
                  </template>
                </v-combobox>
                <v-card-text v-if="created">
                  <v-btn text width="450" color="primary" @click="reassign">
                    Reassign
                  </v-btn>
                </v-card-text>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog2" width="500">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2 popupText">
              Do you want to delete this task
            </v-card-title>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="error" text @click="dialog2 = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="deleteTask"> delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="seeAssigneeToggle" width="500">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2 popupText">
              Assigned User For This Task
            </v-card-title>
            <v-card-text class="assigned-text">
              <p v-if="assignedUser.length === 0">
                There is no user assigned for this task
              </p>
              <p v-for="(user, i) in assignedUser" :key="i">
                {{ user.user_name }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" v-if="created" text @click="openDialog">
                Reassign
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="seeAssigneeToggle = false">
                ok</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import CreateTask from "./CreateTask.vue";
import FilterForm from "./Search.vue";
import Swal from "sweetalert2";
import "animate.css";
export default {
  name: "TasksTables",
  data() {
    return {
      headers: [
        {
          text: "Subject",
          sortable: false,
          value: "subject",
          width: "220px",
          class: "indigo white--text title pt-3 pb-3",
          // align: "center",
        },
        {
          text: "By Who",
          value: "creator_name",
          sortable: false,
          class: "indigo white--text title",
          align: "center",
        },

        {
          text: "Work Status",
          value: "status",
          sortable: false,
          class: "indigo white--text title",
          align: "center",
        },
        {
          text: "Created Date And Time",
          value: "created",
          sortable: true,
          class: "indigo white--text title",
          align: "center",
        },
        {
          text: "Deadline",
          value: "deadline",
          sortable: false,
          class: "indigo white--text title",
          align: "center",
        },
        {
          text: "Priority",
          value: "priority",
          sortable: false,
          class: "indigo white--text title",
          align: "center",
        },
        {
          text: "Refreced",
          value: "refreced",
          sortable: false,
          class: "indigo white--text title",
          align: "center",
        },
        {
          text: "Activity Status",
          value: "work_status",
          sortable: false,
          class: "indigo white--text title",
          align: "center",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "indigo white--text title",
          align: "center",
        },
      ],
      desserts: [],
      assigned: true,
      general: false,
      created: false,
      deleted: false,
      dialog: false,
      dialog2: false,
      currentTask: "",
      co: false,
      pr: false,
      ho: false,
      cliam: false,
      assignToggle: false,
      seeAssigneeToggle: false,
      assignedUser: [],
      chips: [],
      users: [],
      inimation: false,
      categorys: ["None", "today", "tomorrow", "this week", "last week"],
      selectCategoryname: null,
      searchText: "",
    };
  },
  components: {
    CreateTask,
    FilterForm,
  },
  methods: {
    rowClick: function (item, row) {
      row.select(true);
      //item.name - selected id
    },
    getColor(priority) {
      if (priority === 1) return "#FF5252";
      else if (priority === 2) return "#FB8C00";
      else if (priority === 3) return "#4CAF50  ";
    },
    goTask(task) {
      const type = this.assigned
        ? "assigned"
        : this.general
        ? "genelar"
        : "created";
      this.$router.push({ path: `/task/${type}/${task.task_id}` });
    },
    editItem(item) {
      this.co = false;
      this.pr = false;
      this.ho = false;
      this.cliam = false;
      this.dialog = true;
      this.currentTask = item;
      this.assignToggle = false;
    },
    async seeAssignee(task) {
      this.currentTask = task;
      const res = await this.$axios.get(
        `/tasks-management/tasks/task/assign/${task.task_id}`
      );
      this.seeAssigneeToggle = true;
      this.assignedUser = res.data;
    },
    async chngeItemStatus() {
      this.dialog = false;
      let newStatus = "";
      if (this.co || this.pr || this.ho) {
        if (this.co) newStatus = "completed";
        else if (this.pr) newStatus = "progress";
        else if (this.ho) newStatus = "on hold";
        const res = await this.$axios.put(
          `/tasks-management/tasks/task/changeStatus/${this.currentTask.task_id}`,
          {
            newStatus: newStatus,
          }
        );
        if ((this.pr || this.ho) && res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          });
          const newTasks = this.$store.state.tasks.map((element) => {
            if (element.task_id === this.currentTask.task_id) {
              return {
                ...element,
                status: res.data.status,
                work_status: "updated",
              };
            } else {
              return element;
            }
          });
          this.$store.commit("setTasks", newTasks);
        } else if (this.co && res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          });
          if (this.assigned) this.getAssignedTaskas();
          else if (this.general) this.getGeneralTaskas();
          else if (this.created) this.getCreatedTasks();
        }
      } else if (this.cliam) {
        const res = await this.$axios.put(
          `/tasks-management/tasks/task/claimme/${this.currentTask.task_id}`,
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
          this.assigned = true;
          this.general = false;
          this.getAssignedTaskas();
        }
      }
    },
    async deleteTask() {
      this.$store.dispatch("deleteTask", this.currentTask.task_id);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        this.dialog2 = false;
      }, 1500);
    },
    async getAssignedTaskas() {
      this.$store.dispatch("getAssignedTaskas");
      setTimeout(() => {
        this.inimation = true;
      }, 500);
    },
    async getGeneralTaskas() {
      this.$store.dispatch("getGeneralTaskas");
    },
    async getCreatedTasks() {
      this.$store.dispatch("getCreatedTasks");
    },

    async getDeletedTasks() {
      console.log("get deleted task");
      this.$store.dispatch("getDeletedTasks");
    },
    changeTabs(tab) {
      const assinnedAction = this.headers.find((ele) => {
        return ele.text === "Assignned To";
      });
      switch (tab) {
        case "assigned":
          //if (!this.assigned) this.getAssignedTaskas();
          this.getAssignedTaskas();
          this.assigned = true;
          this.general = false;
          this.created = false;
          this.deleted = false;
          this.selectCategoryname=""
          this.searchText = ""
          if (assinnedAction) this.headers.splice(2, 1);
          break;
        case "general":
          //if (!this.general) this.getGeneralTaskas();
          this.getGeneralTaskas();
          this.assigned = false;
          this.general = true;
          this.created = false;
          this.deleted = false;
          this.selectCategoryname=""
          this.searchText = ""
          if (!assinnedAction)
            this.headers.splice(2, 0, {
              text: "Assignned To",
              value: "actions2",
              sortable: false,
              class: "indigo white--text title",
              align: "center",
            });
          break;
        case "created":
          // if (!this.created) this.getCreatedTasks();
          this.getCreatedTasks();
          this.assigned = false;
          this.general = false;
          this.created = true;
          this.deleted = false;
          this.selectCategoryname=""
          this.searchText = ""
          if (!assinnedAction)
            this.headers.splice(2, 0, {
              text: "Assignned To",
              value: "actions2",
              sortable: false,
              class: "indigo white--text title",
              align: "center",
            });
          break;
        case "deleted":
          this.getDeletedTasks();
          this.assigned = false;
          this.general = false;
          this.created = false;
          this.deleted = true;
          this.selectCategoryname=""
          this.searchText = ""
          if (assinnedAction) this.headers.splice(2, 1);
          break;
        default:
      }
    },
    filterTasks() {
      this.searchText = ""
      if (this.selectCategoryname === "today") {
        this.$store.commit("setTodayTasks");
      } else if (this.selectCategoryname === "None") {
        this.$store.commit("setAllTasks");
      } else if (this.selectCategoryname === "last week") {
        this.$store.commit("setLastWeekTasks");
      } else if (this.selectCategoryname === "this week") {
        this.$store.commit("setThisWeekTasks");
      } else if (this.selectCategoryname === "tomorrow") {
        this.$store.commit("setTomorrowTasks");
      }
    },
    changeCo() {
      this.co = !this.co;
      this.pr = false;
      this.ho = false;
    },
    changePr() {
      this.co = false;
      this.pr = !this.pr;
      this.ho = false;
    },

    changeHo() {
      this.co = false;
      this.pr = false;
      this.ho = !this.ho;
    },
    async getAllUsers() {
      const users = await this.$axios.get("/ecm/users/users");
      this.users = users.data;
      console.log("users", users.data);
    },
    async showAssignDiv() {
      this.assignToggle = !this.assignToggle;
      const res = await this.$axios.get(
        `/tasks-management/tasks/task/assign/${this.currentTask.task_id}`
      );
      this.chips = res.data;
    },
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    async reassign() {
      const users_id = [];
      this.chips.forEach((element) => {
        users_id.push({ id: element.user_id, name: element.user_name });
      });
      if (!this.currentTask.claimed && users_id.length > 1) {
        console.log("do something");
        const newTask = {
          creator: this.$store.state.userID,
          creator_name: this.$store.state.username,
          subject: this.currentTask.subject,
          description: this.currentTask.description,
          status: "New",
          claimed: this.currentTask.claimed,
          priority: this.currentTask.priority,
          created_date: this.currentTask.created_date,
          created_time: this.currentTask.created_time,
          due_date: this.currentTask.due_date,
          due_time: this.currentTask.due_time,
          estimated_time: this.currentTask.estimated_time,
          work_status: "created",
          attachment: "",
          refrenced: "",
        };
        const resData = await this.$axios.get(
          `/tasks-management/tasks/task/assign/${this.currentTask.task_id}`
        );
        const oldAssignedUsers = [];
        resData.data.forEach((ele) => {
          oldAssignedUsers.push(ele.user_id);
        });

        let chick = false;
        users_id.forEach(async (ele) => {
          if (!oldAssignedUsers.includes(ele.id)) {
            const res = await this.$axios.post(
              "/tasks-management/tasks",
              newTask
            );
            const as = await this.$axios.post(
              "/tasks-management/tasks/task/assigneUser",
              { task_id: res.data.task_id, user_id: [ele] }
            );
          } else {
            chick = true;
            await this.$axios.post("/tasks-management/tasks/task/assigneUser", {
              task_id: this.currentTask.task_id,
              user_id: [ele],
            });
          }
          if (!chick) {
            await this.$axios.post(`/tasks-management/tasks/task/resetAssign`, {
              task_id: this.currentTask.task_id,
            });
          }
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          this.assignToggle = false;
          this.dialog = false;
          this.changeTabs("created");
          //this.seeAssigneeToggle = true;
          //this.seeAssignee(this.currentTask);
        }, 1500);
      } else {
        const res = await this.$axios.post(
          "/tasks-management/tasks/task/assigneUser",
          {
            task_id: this.currentTask.task_id,
            user_id: users_id,
          }
        );
        if (res.status === 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            this.assignToggle = false;
            this.dialog = false;
            this.seeAssigneeToggle = true;
            this.seeAssignee(this.currentTask);
          }, 1500);
        }
      }
    },
    openDialog() {
      this.seeAssigneeToggle = false;
      this.dialog = true;
    },
    async assignedAgain() {
      console.log("hello gays");
    },
    search() {
      console.log(this.searchText);
      this.$store.commit("search" , this.searchText)
      //this.searchText = ""
    },
    // showCreateTask (){
    //   this.$store.commit("setCreateTaskDialog", true);
    //   console.log("clicked");
    // },
  },
  created() {
    this.getAssignedTaskas();
    this.getAllUsers();
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* .white {
  color: white;
  background-color: #e0e0e0;
} */
.fffffffff {
  font-size: 18px !important;
  color: black;
  width: 300px;
  height: auto;
  cursor: pointer;
}

.container {
  width: 90%;
  margin: 0 auto;
}

.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-l {
  width: 100%;
  display: flex;
}

.search-input {
  width: 23%;
  height: 50px;
}

.search-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
}

.creteTask {
  width: 10%;
  height: 50px;
  /* margin-top: 3%; */
}
.table {
  width: 100%;
  margin: 1% auto;
  text-align: start;
}

.v-chip.v-size--default {
  padding: 10px;
  padding: 10px 40px;
}

.ccc {
  width: max-content;
}

.tabs {
  width: 45%;
  /* margin: 0 auto; */
  margin-top: 3%;
  display: flex;
  gap: 2%;
}

.tabs button {
  display: block;
}

.tab-button {
  background: #e0e0e0;
  color: black;
  padding: 15px 10px;
  width: 200px;
  text-align: center;
  border-radius: 25px;
}

.assigned,
.general,
.created,
.deleted {
  background-color: #1867c0;
  color: white;
  border-radius: 10px;
}

.select-categorys {
  background-color: #fff;
  height: 53px;
  padding: 0px;
  margin-top: 3px;
}
.selectOption {
  background-color: #fff;
  height: 53px;
  padding: 0px;
  margin-top: 15px;
}
h3 {
  color: #3065b5;
  margin: 10px 0px;
  font-size: 25px;
  font-weight: bold;
}
.Main-Filter {
  padding: 25px;
  /* background-color: #2666CF; */
  border-radius: 10px;
  background-color: #0392ce;
}
.btn-search {
  background-color: #fff;
  font-size: 25px;
  color: #000;
  padding: 0px 20px;
  width: 100%;
  border-radius: 3px;
}

.popupText {
  display: block;
  text-align: center;
  margin-bottom: 15px;
}

.assigned-text {
  margin-top: 20px;
  text-align: center;
}
</style>

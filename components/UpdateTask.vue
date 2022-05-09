<template>
  <div>
    <v-btn color="warning" dark @click="showCreateTask"> Update Task </v-btn>
    <v-dialog v-model="CreateTaskDialog" width="1200">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 popupText">
          Update Your Task
        </v-card-title>
        <div class="container">
          <div class="l-div">
            <v-text-field
              class="task-subject"
              v-model="subject"
              :rules="rules"
              counter
              maxlength="40"
              hint="This field uses maxlength attribute"
              label="Task Subject"
              @input="chickChanges"
            ></v-text-field>
            <p class="description-p">Task Description :</p>
            <v-textarea
              class="task-description"
              v-model="description"
              color="teal"
              :rules="rules2"
              counter="400"
              label="Task Description"
              @input="chickChanges"
            >
              <template>
                <div>Bio <small>(optional)</small></div>
              </template>
            </v-textarea>
            <div class="attachment">
              <div class="attachemt-text">
                <p>Attachment</p>
                <v-icon class="attachemt-icon">mdi-paperclip</v-icon>
              </div>
              <div>
                <input type="file" />
              </div>
            </div>
            <div class="priority">
              <div class="priority-text">
                <p>Priority :</p>
              </div>
              <div class="priority-selcted">
                <div
                  class="selcted"
                  @click="changePriority(3)"
                  v-bind:class="{ active: priority === 3 }"
                >
                  <p>Low</p>
                </div>
                <div
                  class="selcted"
                  @click="changePriority(2)"
                  v-bind:class="{ active: priority === 2 }"
                >
                  <p>Meduim</p>
                </div>
                <div
                  class="selcted"
                  @click="changePriority(1)"
                  v-bind:class="{ active: priority === 1 }"
                >
                  <p>High</p>
                </div>
              </div>
            </div>
          </div>
          <div class="r-div">
            <div class="assingee-div">
              <v-checkbox
                :disabled="true"
                v-model="claimed"
                label="Claimed"
                color="info"
                class="chickbox"
                @change="chickChanges"
              ></v-checkbox>
              <!-- <button class="selectAll" @click="selectAll">select all</button> -->
              <!-- <v-combobox
                v-model="chips"
                :items="users"
                item-value="user_id"
                item-text="user_name"
                chips
                clearable
                label="Enter Nmae"
                multiple
                background-color="white"
                prepend-icon="mdi-filter-variant"
                class="assingee"
                @change="chickChanges"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    @click="select"
                    @click:close="remove(item)"
                  >
                    <strong>{{ item.user_name }}</strong>
                  </v-chip>
                </template>
              </v-combobox> -->
              <v-autocomplete
                v-model="chip"
                :items="users"
                item-value="user_id"
                item-text="user_name"
                multiple
                clearable
                class="assingee"
                flat
                hide-no-data
                hide-details
                background-color="#FAFAFA"
                label="Enter Nmae"
                solo
                prepend-icon="mdi-filter-variant"
                @change="chageChips"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip
                    v-if="index === 0 || index === 1"
                    @click:close="remove(item)"
                    close
                    class="ma-2 testP"
                    color="primary"
                    label
                  >
                    <v-icon left> mdi-account-circle-outline </v-icon>
                    <span>{{ item.user_name }} </span>
                  </v-chip>
                  <span v-if="index === 2" class="black--text text-caption">
                    (+{{ chips.length - 2 }} others)
                  </span>
                </template>
              </v-autocomplete>
            </div>
            <div class="schedule" v-if="type === 2">
              <p>Start Show Date</p>
              <div class="deadLine-date">
                <div>
                  <p>{{ created_date.split("-").reverse().join("-") }}</p>
                </div>
                <v-icon
                  class="calendar-icon"
                  @click="dateToggle2 = !dateToggle2"
                  large
                  color="primary"
                  >mdi-calendar</v-icon
                >
              </div>
              <div v-if="dateToggle2">
                <DatePicker @closeDate="closeDate2" />
              </div>
            </div>
            <div class="deadLine-container">
              <div class="deadLine">
                <p>Due Date :</p>
                <div class="deadLine-date">
                  <div>
                    <p>{{ due_date.split("-").reverse().join("-") }}</p>
                  </div>
                  <v-icon
                    class="calendar-icon"
                    @click="showDate"
                    large
                    color="primary"
                    >mdi-calendar</v-icon
                  >
                </div>
                <div v-if="dateToggle">
                  <DatePicker @closeDate="closeDate" />
                </div>
              </div>
              <div class="deadLine">
                <p>Due Time :</p>
                <div class="deadLine-date">
                  <div>
                    <p>{{ due_time }}</p>
                  </div>
                  <v-icon
                    class="calendar-icon"
                    @click="timeToggle = !timeToggle"
                    large
                    color="primary"
                    >mdi-clock-outline</v-icon
                  >
                </div>
                <div v-if="timeToggle">
                  <TimePicker @closeTime="closeTime" />
                </div>
              </div>
            </div>
            <div>
              <p>Estimated Time For Task :</p>
              <div class="deadLineEstimatedTime">
                <div>
                  <!-- <v-text-field
                    v-model="estimated_time"
                    label="HH : MM"
                  ></v-text-field> -->
                  <VueTimepicker
                    v-model="yourData"
                    @change="handleEstimatedTime"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="v-card-action">
          <v-btn color="error" text @click="CreateTaskDialog = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :disabled="!ableButton"
            @click="createNewTask"
          >
            Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import DatePicker from "./DatePicker.vue";
import TimePicker from "./TimePicker.vue";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";

export default {
  name: "UpdateTask",
  props: {
    task: Object,
    assignedUsers: Array,
  },
  data() {
    return {
      CreateTaskDialog: false,
      type: 1,
      dateToggle: false,
      dateToggle2: false,
      timeToggle: false,
      rules: [(v) => v.length <= 40 || "Max 40 characters"],
      rules2: [(v) => v.length <= 400 || "Max 400 characters"],
      chips: [],
      chip: [],
      users: [],
      subject: "",
      description: "",
      status: "created",
      priority: 3,
      created_date: "",
      created_time: "",
      due_date: "",
      due_time: "",
      estimated_time: "",
      creator: "",
      creator_name: "",
      claimed: false,
      oldSubject: "",
      oldDescription: "",
      oldPriority: 3,
      oldchips: [],
      oldDue_date: "",
      oldDue_time: "",
      oldEstimated_time: "",
      ableButton: false,
      oldClaimed: false,
      yourData: {
        HH: "00",
        mm: "00",
      },
    };
  },
  components: {
    DatePicker,
    TimePicker,
    VueTimepicker,
  },
  methods: {
    async getTaskData() {
      const res = await this.$axios.get(
        `/tasks-management/tasks/oneTask/${this.id}`
      );
      console.log("update data", res.data);
    },
    async getAllUsers() {
      const users = await this.$axios.get("/ecm/users/users");
      this.users = users.data;
      console.log("users", users.data);
    },
    showCreateTask() {
      this.CreateTaskDialog = true;
      // this.initData();
      this.chickChanges();
      this.ableButton = false;
    },
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
      this.chip.splice(this.chip.indexOf(item.user_id), 1);
      this.chip = [...this.chip];
      this.chickChanges();
    },
    showDate() {
      this.dateToggle = !this.dateToggle;
    },
    closeDate(date) {
      this.dateToggle = !this.dateToggle;
      this.due_date = date;
      this.chickChanges();
    },
    closeDate2(date) {
      this.dateToggle2 = !this.dateToggle2;
      this.created_date = date;
      this.chickChanges();
    },
    closeTime(time) {
      this.timeToggle = false;
      this.due_time = time;
      this.chickChanges();
    },
    changePriority(n) {
      this.priority = n;
      this.chickChanges();
    },
    chageChips() {
      console.log(this.chip);
      const arr = [];
      this.chip.forEach((ele) => {
        const user = this.users.find((el) => {
          return el.user_id === ele;
        });
        arr.push(user);
        this.chips = arr;
      });

      this.chickChanges();
    },
    handleEstimatedTime() {
      this.estimated_time = `${this.yourData.HH}:${this.yourData.mm}`;
      console.log(this.estimated_time);
      this, this.chickChanges();
    },
    async createNewTask() {
      const users_id = [];
      this.chips.forEach((element) => {
        // const user = this.users.find((ele)=>{return ele.user_id ===element })
        users_id.push({ id: element.user_id, name: element.user_name });
      });
      if (!this.claimed && users_id.length === 0) {
        return alert("you must assingee one user at least");
      }

      if (!this.claimed && users_id.length > 1) {
        console.log("do something");
        console.log(this.task, "task");

        const newTask = {
          creator: this.task.creator,
          creator_name: this.task.creator_name,
          subject: this.subject,
          description: this.description,
          status: this.status,
          claimed: this.claimed,
          priority: this.priority,
          created_date: this.task.created_date,
          created_time: this.task.created_time,
          due_date: this.due_date,
          due_time: this.due_time,
          estimated_time: this.estimated_time,
          work_status: "Updated",
          attachment: "",
          refrenced: "",
        };

        const resData = await this.$axios.get(
          `/tasks-management/tasks/task/assign/${this.task.task_id}`
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
            const res = await this.$axios.post(
              `/tasks-management/tasks/task/update/${this.task.task_id}`,
              {
                subject: this.subject,
                description: this.description,
                claimed: this.claimed,
                priority: this.priority,
                due_date: this.due_date,
                due_time: this.due_time,
                estimated_time: this.estimated_time,
              }
            );
            const as = await this.$axios.post(
              "/tasks-management/tasks/task/assigneUser",
              { task_id: res.data.task_id, user_id: [ele] }
            );
          }
          if (!chick) {
            await this.$axios.post(`/tasks-management/tasks/task/resetAssign`, {
              task_id: this.task.task_id,
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
          // window.location.reload();
          this.CreateTaskDialog = false;
          this.$emit("closeDialog", newTask);
        }, 1500);
      } else {
        const res = await this.$axios.post(
          `/tasks-management/tasks/task/update/${this.task.task_id}`,
          {
            subject: this.subject,
            description: this.description,
            claimed: this.claimed,
            priority: this.priority,
            due_date: this.due_date,
            due_time: this.due_time,
            estimated_time: this.estimated_time,
          }
        );
        // asd
        const as = await this.$axios.post(
          "/tasks-management/tasks/task/assigneUser",
          { task_id: res.data.task_id, user_id: users_id }
        );
        if (res.status === 200) {
          this.CreateTaskDialog = false;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            this.$emit("newTask", res.data);
          }, 1600);
        }
      }
    },
    selectAll() {
      // Copy all v-select's items in your selectedItem array
      this.chips = [...this.users];
    },
    chickChanges() {
      console.log(this.yourData);
      let index = false;
      const ch = {};
      if (this.oldSubject !== this.subject) {
        index = true;
        ch.oldSubject = this.oldSubject;
        ch.subject = this.subject;
      }
      if (this.oldDescription !== this.description) {
        index = true;
        ch.oldSubject = this.oldSubject;
        ch.description = this.subject;
      }
      if (this.oldPriority !== this.priority) {
        index = true;
        ch.oldPriority = this.oldPriority;
        ch.priority = this.priority;
      }
      // if (this.oldchips !== this.chips){
      //   index = true
      //  ch.oldchips = this.oldchips
      //  ch.chips = this.chips
      // }
      if (this.oldDue_date !== this.due_date) {
        index = true;
        ch.oldDue_date = this.oldDue_date;
        ch.due_date = this.due_date;
      }
      if (this.oldDue_time !== this.due_time) {
        index = true;
        ch.oldDue_time = this.oldDue_time;
        ch.due_time = this.due_time;
      }
      if (this.oldEstimated_time !== this.estimated_time) {
        index = true;
        ch.oldEstimated_time = this.oldEstimated_time;
        ch.estimated_time = this.estimated_time;
      }
      if (this.oldClaimed !== this.claimed) {
        index = true;
        ch.oldClaimed = this.oldClaimed;
        ch.claimed = this.claimed;
      }
      console.log(this.oldchips, this.chips);
      if (this.oldchips.length !== this.chips.length) {
        index = true;
        ch.oldchips = this.oldchips;
        ch.chips = this.chips;
      } else {
        for (let i = 0; i < this.oldchips.length; i++) {
          let foundUser = false;
          for (let j = 0; j < this.chips.length; j++) {
            if (this.oldchips[i].user_id === this.chips[j].user_id) {
              foundUser = true;
            }
          }
          if (!foundUser) {
            index = true;
            ch.oldchips = this.oldchips;
            ch.chips = this.chips;
            break;
          }
        }
      }

      this.ableButton = index;

      console.log(index);
      console.log(ch);
    },
    initData() {
      this.subject = this.task.subject;
      this.description = this.task.description;
      this.priority = this.task.priority;
      this.created_date = this.task.created_date;
      this.due_date = this.task.due_date;
      this.due_time = this.task.due_time;
      this.estimated_time = this.task.estimated_time;
      this.claimed = this.task.claimed;
      this.chips = [...this.assignedUsers];
      this.oldSubject = this.subject;
      this.oldDescription = this.description;
      this.oldPriority = this.priority;
      this.oldchips = [...this.assignedUsers];
      this.oldDue_date = this.due_date;
      this.oldDue_time = this.due_time;
      this.oldEstimated_time = this.estimated_time;
      this.oldClaimed = this.claimed;
      this.chip = this.assignedUsers.map((ele) => {
        return ele.user_id;
      });
      console.log("chipppppppppppppppppppp , ", this.chip);
      console.log("chippppppppppppppppppppssssss , ", this.oldchips);

      this.yourData = {
        HH: this.estimated_time.split(":")[0],
        mm: this.estimated_time.split(":")[1],
      };
    },
  },
  mounted() {
    this.getAllUsers();
    this.initData();
  },
  updated() {},
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

.container {
  min-height: 60vh;
  width: 95%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.l-div,
.r-div {
  width: 49%;
  min-height: 60vh;
  /* border: 1px solid black; */
}

.r-div {
  border-left: 1px solid #e0e0e0;
  padding-left: 15px;
}

.task-subject {
  width: 80%;
  margin-top: 30px;
}

.task-description {
  width: 90%;
  margin: 30px 0;
}

.description-p {
  margin-top: 20px;
}

.attachment,
.task-type {
  display: flex;
  margin-top: 20px;
}

.attachemt-text,
.type-text {
  width: 35%;
  display: flex;
}
.attachemt-icon {
  margin-left: 10px;
  display: block;
}

.priority {
  display: flex;
  margin-top: 70px;
  margin-bottom: 50px;
}

.priority-text {
  width: 35%;
}

.priority-selcted,
.type-selcted {
  display: flex;
  text-align: center;
}

.priority-selcted .selcted {
  background: #e0e0e0;
  color: black;
  padding: 5px 10px;
  width: 90px;
  height: auto;
  text-align: center;
  border-radius: 5px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.assingee-div {
  display: flex;
  margin-top: 30px;
  position: relative;
}

.chickbox {
  width: 120px;
  height: 100%;
  margin-top: 10px;
}

.type-selcted .selcted {
  background: #e0e0e0;
  color: black;
  padding: 5px 10px;
  width: 130px;
  height: auto;
  text-align: center;
  border-radius: 5px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.priority-selcted .active,
.type-selcted .active {
  background-color: #1867c0;
  color: white;
}

.schedule,
.deadLine {
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
}

.deadLine-container {
  display: flex;
}

.deadLine {
  width: 50%;
}

.deadLine-date {
  display: flex;
  margin-top: 15px;
}

.deadLine-date div {
  width: 140px;
  height: 30px;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-icon {
  width: 30px;
  height: 30px;
  margin-left: 20px;
}

.deadLineEstimatedTime {
  margin-top: 15px;
}

.deadLineEstimatedTime {
  width: 30%;
}

.testP {
  padding: 10px;
}
</style>

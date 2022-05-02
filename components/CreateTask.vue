<template>
  <div>
    <v-dialog v-model="CreateTaskDialog" width="1200" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 popupText">
          Create New Task
        </v-card-title>
        <div class="container">
          <div class="l-div">
            <v-text-field
              class="task-subject"
              v-model="subject"
              :rules="[
                () => !!subject.trim().length || 'This field is required',
                () =>
                  (!!subject && subject.length <= 40) ||
                  'Subject must be less than 40 characters',
              ]"
              :error-messages="errorSubjectMessages"
              counter="40"
              label="Task Subject"
              @input="errorSubjectMessages = ''"
            ></v-text-field>
            <p class="description-p">Task Description :</p>
            <v-textarea
              class="task-description"
              v-model="description"
              color="teal"
              :rules="[
                () => description.length <= 400 || 'Max 400 characters',
                !!description.trim().length || 'This field is required',
              ]"
              counter="400"
              :error-messages="errorDescriptionMessages"
              @input="errorDescriptionMessages = ''"
              label="Task Description"
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
                  @click="priority = 3"
                  v-bind:class="{ active: priority === 3 }"
                >
                  <p>Low</p>
                </div>
                <div
                  class="selcted"
                  @click="priority = 2"
                  v-bind:class="{ active: priority === 2 }"
                >
                  <p>Meduim</p>
                </div>
                <div
                  class="selcted"
                  @click="priority = 1"
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
                v-model="claimed"
                label="Claimed"
                color="info"
                class="chickbox"
              ></v-checkbox>
              <button class="selectAll" @click="selectAll">select all</button>
              <!-- <v-combobox
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
                chip
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
                    <v-icon small left> mdi-account-circle-outline </v-icon>
                    <span>{{ item.user_name }} </span>
                  </v-chip>
                  <span v-if="index === 2" class="black--text text-caption">
                    (+{{ chips.length - 2 }} others)
                  </span>
                </template>
              </v-autocomplete>
            </div>
            <div v-if="dateToggle">
              <DatePicker :startDay="created_date" @closeDate="closeDate" />
            </div>
            <div v-if="dateToggle2">
              <DatePicker :startDay="''" @closeDate="closeDate2" />
            </div>
            <div v-if="timeToggle">
              <TimePicker @closeTime="closeTime" />
            </div>
            <div v-if="cretedTimeToggle">
              <TimePicker @closeTime="closeCreatedTime" />
            </div>
            <div class="task-type">
              <div class="type-text">
                <p>Task Type :</p>
              </div>
              <div class="type-selcted">
                <div
                  class="selcted"
                  @click="type = 1"
                  v-bind:class="{ active: type === 1 }"
                >
                  <p>Instant</p>
                </div>
                <div
                  class="selcted"
                  @click="type = 2"
                  v-bind:class="{ active: type === 2 }"
                >
                  <p>Schedule</p>
                </div>
              </div>
            </div>

            <div class="schedule" v-if="type === 2">
              <div class="recurrence">
                <p>recurrence</p>
                <div class="recurrence-select">
                  <v-select
                    class="select-categorys"
                    :items="['one time', 'daily']"
                    v-model="selectRecurrence"
                    label="Time Filters"
                  ></v-select>
                </div>
              </div>
              <div v-if="selectRecurrence === 'daily'">
                <p>frequency</p>
                <div class="freq">
                  <div class="freq-chickbox">
                    <v-checkbox
                      v-model="days"
                      @change="selectDays"
                      label="All Days"
                      color="info"
                      class="chickbox"
                    ></v-checkbox>
                  </div>
                  <div class="freq-days">
                    <div
                      class="day"
                      v-bind:class="{ dayactive: selectedDays[0] }"
                      @click="chnageDay(0)"
                    >
                      S
                    </div>
                    <div
                      class="day"
                      v-bind:class="{ dayactive: selectedDays[1] }"
                      @click="chnageDay(1)"
                    >
                      M
                    </div>
                    <div
                      class="day"
                      v-bind:class="{ dayactive: selectedDays[2] }"
                      @click="chnageDay(2)"
                    >
                      T
                    </div>
                    <div
                      class="day"
                      v-bind:class="{ dayactive: selectedDays[3] }"
                      @click="chnageDay(3)"
                    >
                      W
                    </div>
                    <div
                      class="day"
                      v-bind:class="{ dayactive: selectedDays[4] }"
                      @click="chnageDay(4)"
                    >
                      TH
                    </div>
                    <div
                      class="day"
                      v-bind:class="{ dayactive: selectedDays[5] }"
                      @click="chnageDay(5)"
                    >
                      F
                    </div>
                    <div
                      class="day"
                      v-bind:class="{ dayactive: selectedDays[6] }"
                      @click="chnageDay(6)"
                    >
                      SA
                    </div>
                  </div>
                </div>
              </div>
              <div class="req-creation">
                <div class="date">
                  <p>Start Show Date</p>
                  <div class="deadLine-date">
                    <div>
                      <v-text-field
                        v-model="created_date"
                        :rules="[
                          () => !!created_date || 'This field is required',
                        ]"
                        :error-messages="errorcreated_dateMessages"
                        readonly
                      ></v-text-field>
                    </div>
                    <v-icon
                      class="calendar-icon"
                      @click="dateToggle2 = !dateToggle2"
                      large
                      color="primary"
                      >mdi-calendar</v-icon
                    >
                  </div>
                </div>
                <div class="time">
                  <p>Start Show Time :</p>
                  <div class="deadLine-date">
                    <div>
                      <!-- <p>{{ due_time }}</p> -->
                      <v-text-field
                        v-model="created_time"
                        :rules="[
                          () => !!created_time || 'This field is required',
                        ]"
                        :error-messages="errorcreated_timeMessages"
                        readonly
                      ></v-text-field>
                    </div>
                    <v-icon
                      class="calendar-icon"
                      @click="cretedTimeToggle = !cretedTimeToggle"
                      large
                      color="primary"
                      >mdi-clock-outline</v-icon
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="deadLine-container">
              <div
                class="deadLine"
                v-if="type === 1 || selectRecurrence != 'daily'"
              >
                <p>Due Date :</p>
                <div class="deadLine-date">
                  <div>
                    <!-- <p>{{ due_date.split("-").reverse().join("-") }}</p> -->
                    <v-text-field
                      v-model="due_date"
                      :rules="[() => !!due_date || 'This field is required']"
                      :error-messages="errorDueDateMessages"
                      readonly
                    ></v-text-field>
                  </div>
                  <v-icon
                    class="calendar-icon"
                    @click="showDate"
                    large
                    color="primary"
                    >mdi-calendar</v-icon
                  >
                </div>
              </div>
              <div class="deadLine">
                <p>Due Time :</p>
                <div class="deadLine-date">
                  <div>
                    <!-- <p>{{ due_time }}</p> -->
                    <v-text-field
                      v-model="due_time"
                      :rules="[() => !!due_time || 'This field is required']"
                      :error-messages="errorDueTimeMessages"
                      readonly
                    ></v-text-field>
                  </div>
                  <v-icon
                    class="calendar-icon"
                    @click="timeToggle = !timeToggle"
                    large
                    color="primary"
                    >mdi-clock-outline</v-icon
                  >
                </div>
              </div>
            </div>
            <div>
              <p>Estimated Time For Task :</p>
              <div class="deadLineEstimatedTime">
                <div>
                  <!-- <v-text-field
                    v-model="estimated_time"
                    :rules="[
                      () => !!estimated_time || 'This field is required',
                    ]"
                    :error-messages="errorEstimatedMessages"
                    @input="errorEstimatedMessages = ''"
                    label="HH : MM"
                  ></v-text-field> -->
                  <VueTimepicker
                    v-model="estimated_time"
                    @change="handleEstimatedTime"
                    :error-messages="errorEstimatedMessages"
                  />
                  <p v-if="errorEstimatedMessages" class="errorMsg">
                    {{ errorEstimatedMessages }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="v-card-action">
          <v-btn color="error" text @click="closeDialog"> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="createNewTask"> Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import DatePicker from "./DatePicker.vue";
import TimePicker from "./TimePicker.vue";
import AddedMessage from "./AddedMessage.vue";
import Swal from "sweetalert2";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
export default {
  name: "CreateTask",
  data() {
    return {
      // CreateTaskDialog: false,
      type: 1,
      dateToggle: false,
      dateToggle2: false,
      timeToggle: false,
      cretedTimeToggle: false,
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
      claimed: true,
      errorSubjectMessages: "",
      errorDescriptionMessages: "",
      errorDueTimeMessages: "",
      errorDueDateMessages: "",
      errorEstimatedMessages: "",
      errorcreated_dateMessages: "",
      errorcreated_timeMessages: "",
      selectRecurrence: "one time",
      selectedDays: [false, false, false, false, false, false, false],
      days: "",
    };
  },
  components: {
    DatePicker,
    TimePicker,
    AddedMessage,
    VueTimepicker,
  },
  props: {
    CreateTaskDialog: Boolean,
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async getAllUsers() {
      const users = await axios.get("/ecm/users/users");
      this.users = users.data;
      console.log("users", users.data);
    },
    showCreateTask() {
      this.type = 1;
      this.dateToggle = false;
      this.timeToggle = false;
      this.chips = [];
      this.subject = "";
      this.description = "";
      this.status = "created";
      this.priority = 3;
      this.created_date = "";
      this.created_time = "";
      this.due_date = "";
      this.due_time = "";
      this.estimated_time = "";
      this.creator = "";
      this.creator_name = "";
      this.claimed = true;
    },
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
      this.chip.splice(this.chip.indexOf(item.user_id), 1);
      this.chip = [...this.chip];
    },
    showDate() {
      this.dateToggle = !this.dateToggle;
    },
    closeDate(date) {
      this.dateToggle = !this.dateToggle;
      this.due_date = date;
      this.errorDueDateMessages = "";
    },
    closeDate2(date) {
      this.dateToggle2 = !this.dateToggle2;
      this.created_date = date;
      if (this.created_date > this.due_date) {
        this.due_date = "";
      }
    },
    closeTime(time) {
      this.timeToggle = false;
      this.due_time = time;
      this.errorDueTimeMessages = "";
    },
    closeCreatedTime(time) {
      this.cretedTimeToggle = false;
      this.created_time = time;
      this.errorcreated_timeMessages = "";
    },
    chageChips() {
      const arr = [];
      this.chip.forEach((ele) => {
        const user = this.users.find((el) => {
          return el.user_id === ele;
        });
        arr.push(user);
        this.chips = arr;
      });
    },
    handleEstimatedTime() {
      console.log(this.estimated_time);
      console.log(
        this.estimated_time.includes("mm") ||
          this.estimated_time.includes("HH") ||
          !this.estimated_time
      );
      if (
        this.estimated_time.includes("mm") ||
        this.estimated_time.includes("HH") ||
        !this.estimated_time
      ) {
        this.errorEstimatedMessages = "This field is required";
        return;
      }
      this.errorEstimatedMessages = "";
    },
    async createNewTask() {
      let chickVald = true;
      this.errorSubjectMessages = "";
      this.errorDescriptionMessages = "";
      this.errorDueDateMessages = "";
      this.errorDueTimeMessages = "";
      this.errorEstimatedMessages = "";
      if (this.subject.trim().length === 0) {
        this.errorSubjectMessages = "This field is required";
        chickVald = false;
      }
      if (this.description.trim().length === 0) {
        this.errorDescriptionMessages = "This field is required";
        chickVald = false;
      }
      if (!this.due_date) {
        if (this.type === 1) {
          this.errorDueDateMessages = "This field is required";
          chickVald = false;
        } else if (this.type === 2 && this.selectRecurrence != "daily") {
          this.errorDueDateMessages = "This field is required";
          chickVald = false;
        }
      }

      if (!this.due_time) {
        this.errorDueTimeMessages = "This field is required";
        chickVald = false;
      }

      if (!this.estimated_time) {
        this.errorEstimatedMessages = "This field is required";
        chickVald = false;
      }

      if (chickVald === false) {
        return;
      }

      if (this.type === 1) {
        let today = new Date();
        this.created_date = new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10);
        let hour =
          today.getHours() + "".length == 1
            ? "0" + today.getHours()
            : today.getHours() + "";
        let min = today.getMinutes() + "";

        this.created_time = hour + ":" + min;
        // if (hour < 10) {
        //   hour = "0" + hour;
        // }
        // if (min < 10) {
        //   min = "0" + min;
        // }
        // let time24 = hour + ":" + min;
        // let time = time24.split(":")[0];
        // console.log(time);
        // if (time < 12) {
        //   this.created_time = time24 + " AM";
        // } else if (time == 12) {
        //   this.created_time = 12 + ":" + time24.split(":")[1] + " PM";
        // } else {
        //   let hh = time24.split(":")[0] - 12;
        //   if (hh < 10) {
        //     hh = "0" + hh;
        //   }
        //   this.created_time = hh + ":" + time24.split(":")[1] + " PM";
        // }
      } else {
        // this.created_time = "00:00";
      }
      const newTask = {
        creator: this.$store.state.userID,
        creator_name: this.$store.state.username,
        subject: this.subject,
        description: this.description,
        status: "New",
        claimed: this.claimed,
        priority: this.priority,
        created_date: this.created_date,
        created_time: this.created_time,
        due_date: this.due_date,
        due_time: this.due_time,
        estimated_time: this.estimated_time,
        work_status: "created",
        attachment: "",
        refrenced: "",
      };
      if (this.type === 2 && this.selectRecurrence === "daily") {
        console.log("sended");
        await this.$axios.post("/tasks-management/tasks/freq", {
          newTask,
          claimed: this.claimed,
          chips: this.chips,
          selectedDays: this.selectedDays,
        });
        this.$emit("getCreated");
        this.$emit("closeDialog");
        this.$emit("openCreatedMSG");
        this.$emit("taskName", newTask.subject);
        return;
      }

      if (!this.claimed) {
        if (this.chips.length === 0) {
          return alert("mamoun is bitch");
        }
        const users_id = [];
        this.chips.forEach((element) => {
          users_id.push({ id: element.user_id, name: element.user_name });
        });
        users_id.forEach(async (ele) => {
          const res = await this.$axios.post(
            "/tasks-management/tasks",
            newTask
          );
          const as = await this.$axios.post(
            "/tasks-management/tasks/task/assigneUser",
            { task_id: res.data.task_id, user_id: [ele] }
          );
        });
        this.$emit("getCreated");
        this.$emit("closeDialog");
        this.$emit("openCreatedMSG");
        this.$emit("taskName", newTask.subject);
      } else {
        const users_id = [];
        this.chips.forEach((element) => {
          users_id.push({ id: element.user_id, name: element.user_name });
        });
        if (!this.claimed && users_id.length === 0) {
          return alert("you must assingee one user at least");
        }
        const res = await this.$axios.post("/tasks-management/tasks", newTask);
        const as = await this.$axios.post(
          "/tasks-management/tasks/task/assigneUser",
          { task_id: res.data.task_id, user_id: users_id }
        );
        if (res.status === 201) {
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: "Your work has been saved",
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
          this.$emit("getCreated");
          this.$emit("closeDialog");
          this.$emit("openCreatedMSG");
          this.$emit("taskName", newTask.subject);
        }
      }
    },
    selectAll() {
      // Copy all v-select's items in your selectedItem array
      this.chips = [...this.users];
      this.chip = this.users.map((ele) => {
        return ele.user_id;
      });
    },
    selectDays() {
      if (this.days) {
        this.selectedDays = [true, true, true, true, true, true, true];
      } else {
        this.selectedDays = [false, false, false, false, false, false, false];
      }
    },
    chnageDay(index) {
      this.days = false;
      this.selectedDays = this.selectedDays.map((element, i) => {
        if (i === index) {
          return !element;
        } else {
          return element;
        }
      });
    },
    endCreate() {
      this.type = 1;
      this.dateToggle = false;
      this.timeToggle = false;
      this.chips = [];
      this.subject = "";
      this.description = "";
      this.status = "created";
      this.priority = 3;
      this.created_date = "";
      this.created_time = "";
      this.due_date = "";
      this.due_time = "";
      this.estimated_time = "";
      this.creator = "";
      this.creator_name = "";
      this.claimed = true;
      this.errorSubjectMessages = "";
      // this.$router.push({ path: `/task/created/${res.data.task_id}` });
    },
  },
  created() {
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
  width: max-content;
}

/* ----------------------------------------------------------------------- */
.recurrence-select {
  margin-top: 25px;
  width: 40%;
}

.freq {
  margin: 25px 0;
  display: flex;
  justify-content: space-between;
  height: 50px;
}
.freq-chickbox {
  padding: 0;
  width: 20%;
  height: 50px;
}
.freq-days {
  width: 60%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day {
  margin-top: 0;
  width: 40px;
  padding: 3px 5px;
  background: #e0e0e0;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
}

.dayactive {
  background-color: #1867c0;
  color: white;
}

.req-creation {
  display: flex;
  justify-content: space-between;
  z-index: 0;
}

.req-creation div {
  width: 70%;
}

.testP {
  /* width: 40% !important; */
  font-size: 12px !important;
  padding: 10px 5px !important;
}

.errorMsg {
  margin-top: 10px;
  font-size: 12px;
  color: #ff5252 !important;
  width: 100%;
  padding-top: 5px;
  border-top: 1px solid #ff5252;
}
</style>

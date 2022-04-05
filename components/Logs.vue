<template>
  <div class="logs-container">
    <div v-if="taskLogs.length !== 0">
      <div v-for="(ele, i) in taskLogs" :key="i" class="all-parent">
        <div class="chages-data">
          <div v-if="ele.oldSubject" class="subject-container">
            <div class="title-data">
              <p>Subject :</p>
            </div>
            <div class="old-data">
              <p title="Old Subject">{{ ele.oldSubject }}</p>
            </div>
            <div class="icon">
              <v-icon x-large color="primary"> mdi-arrow-right-bold </v-icon>
            </div>
            <div class="new-data">
              <p title="New Subject">{{ ele.newSubject }}</p>
            </div>
          </div>
          <div v-if="ele.oldDescription" class="description-container">
            <div class="title-data">
              <p>Description :</p>
            </div>
            <div class="old-data">
              <p
                class="descText"
                title="Old Description"
              >
                {{ ele.oldDescription }}
              </p>
            </div>
            <div class="icon">
              <v-icon x-large color="primary"> mdi-arrow-right-bold </v-icon>
            </div>
            <div class="new-data">
              <p
                class="descText"
                title="New Description"
              >
                {{ ele.newDescription }}
              </p>
            </div>
          </div>
          <div v-if="ele.oldDeadLine" class="description-container">
            <div class="title-data">
              <p>Deadline :</p>
            </div>
            <div class="old-data">
              <p title="Old Deadline">{{ ele.oldDeadLine }}</p>
            </div>
            <div class="icon">
              <v-icon x-large color="primary"> mdi-arrow-right-bold </v-icon>
            </div>
            <div class="new-data">
              <p title="New Deadline">{{ ele.newDeadLine }}</p>
            </div>
          </div>
          <div v-if="ele.oldStatus" class="description-container">
            <div class="title-data">
              <p>Status :</p>
            </div>
            <div class="old-data">
              <p title="Old Status">{{ ele.oldStatus }}</p>
            </div>
            <div class="icon">
              <v-icon x-large color="primary"> mdi-arrow-right-bold </v-icon>
            </div>
            <div class="new-data">
              <p title="New Status">{{ ele.newStatus }}</p>
            </div>
          </div>
          <div v-if="ele.oldPriority" class="description-container">
            <div class="title-data">
              <p>Priority :</p>
            </div>
            <div class="old-data">
              <p title="Old Priority">
                {{
                  ele.oldPriority === 1
                    ? "High"
                    : ele.oldPriority === 2
                    ? "Meduim"
                    : "Low"
                }}
              </p>
            </div>
            <div class="icon">
              <v-icon x-large color="primary"> mdi-arrow-right-bold </v-icon>
            </div>
            <div class="new-data">
              <p title="New Priority">
                {{
                  ele.newPriority === 1
                    ? "High"
                    : ele.newPriority === 2
                    ? "Meduim"
                    : "Low"
                }}
              </p>
            </div>
          </div>
          <div v-if="ele.newEstimated_time" class="description-container">
            <div class="title-data">
              <p>Estimated time :</p>
            </div>
            <div class="old-data">
              <p title="Old Estimated time">{{ ele.oldEstimated_time }}</p>
            </div>
            <div class="icon">
              <v-icon x-large color="primary"> mdi-arrow-right-bold </v-icon>
            </div>
            <div class="new-data">
              <p title="New Estimated time">{{ ele.newEstimated_time }}</p>
            </div>
          </div>
        </div>
        <div class="at-time">
          This happed on <span class="dynamic-time">{{ ele.at }}</span>
        </div>
        <!-- <div v-if="ele.oldSubject" class="parent">
          <div class="ch-text">
            <p title="Old Subject">{{ ele.oldSubject }}</p>
          </div>
          <div class="ch-icon">
            <v-icon x-large color="primary"> mdi-arrow-right-bold </v-icon>
          </div>
          <div class="ch-text">
            <p title="New Subject">{{ ele.newSubject }}</p>
          </div>
          <div class="ch-time">
            <p>{{ ele.at }}</p>
          </div>
        </div>
        <div v-if="ele.oldDescription" class="parent">
          <div class="ch-text">
            <p title="Old Description">{{ ele.oldDescription }}</p>
          </div>
          <div class="ch-icon">
            <v-icon x-large color="primary"> mdi-arrow-right-bold </v-icon>
          </div>
          <div class="ch-text">
            <p title="New Description">{{ ele.newDescription }}</p>
          </div>
          <div class="ch-time">
            <p>{{ ele.at }}</p>
          </div>
        </div> -->
      </div>
    </div>
    <div v-else>
      <p>There is no Activity on this Task</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Logs",
  props: {
    taskLogs: Array,
  },
};
</script>

<style scoped>
.logs-container {
  width: 80%;
  margin: 0 auto;
  margin-top: 40px;
  min-height: 600px;
  max-height: 700px;
  overflow-y: auto;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  padding: 20px;
}

p {
  margin: 0;
}

.all-parent {
  display: flex;
  justify-content: space-between;
  height: auto;
  align-items: center;
  margin-top: 25px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  padding: 20px;
}

.chages-data {
  width: 82%;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.at-time {
  width: 17%;
  height: max-content;
}

.dynamic-time {
  color: #1976d2;
}

.subject-container,
.description-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin-top: 25px;
}

.title-data {
  width: 200px;
}

.title-data p {
  background-color: #1976d2;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
}

.old-data,
.new-data {
  width: 40%;
  /* height: max-content; */
}

.icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}

.logs-container::-webkit-scrollbar {
  width: 10px;
}

.logs-container::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}

.logs-container::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background-image: linear-gradient(180deg, #00bcd4 0%, #1976d2 99%);
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
}
</style>

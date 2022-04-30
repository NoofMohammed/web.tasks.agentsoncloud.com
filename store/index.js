import axios from "axios";

// holds your root state
export const state = () => ({
  userID: "user_id 1",
  username: "user_name 1 ",
  fixTasks: [],
  fixSearchTasks: [],
  tasks: [],
  createTaskDialog: false,
  taskDraior: false,
});

// contains your actions
export const actions = {
  async getAssignedTaskas(commit) {
    const data = await this.$axios.get(
      `/tasks-management/tasks/assignedToMe/${this.state.userID}`
    );
    console.log(data.data, "res data arr");
    data.data.forEach((element) => {
      element.created =
        element.created_date.split("-").reverse().join("-") +
        " at " +
        element.created_time;
      element.deadline =
        element.due_date.split("-").reverse().join("-") +
        " at " +
        element.due_time;
    });
    // console.log("tasksss" , this.state.tasks);
    commit.commit("setTasks", data.data);

    // const res = await axios.get(
    //   `http://localhost:5000/tasks/assignedToMeCompleted/${this.state.userID}`
    // );
    // res.data.forEach((element) => {
    //   element.created =
    //     element.created_date.split("-").reverse().join("-") +
    //     " at " +
    //     element.created_time;
    //   element.deadline =
    //     element.due_date.split("-").reverse().join("-") +
    //     " at " +
    //     element.due_time;
    // });
    // commit.commit("setTasks", [...this.state.tasks, ...res.data]);
    // console.log(res.data, "storeee");
  },
  async getGeneralTaskas(commit) {
    const data = await this.$axios.get(
      `/tasks-management/tasks/generalTasks/${this.state.userID}`
    );
    data.data.forEach((element) => {
      element.created =
        element.created_date.split("-").reverse().join("-") +
        " at " +
        element.created_time;
      element.deadline =
        element.due_date.split("-").reverse().join("-") +
        " at " +
        element.due_time;
    });
    commit.commit("setTasks", data.data);

    const res = await this.$axios.get(
      "/tasks-management/tasks/allGeneralTasks/"
    );
    res.data.forEach((element) => {
      element.created =
        element.created_date.split("-").reverse().join("-") +
        " at " +
        element.created_time;
      element.deadline =
        element.due_date.split("-").reverse().join("-") +
        " at " +
        element.due_time;
    });
    commit.commit("setTasks", [...this.state.tasks, ...res.data]);
  },

  async getCreatedTasks(commit) {
    const res = await this.$axios.get(
      `/tasks-management/tasks/myTasks/${this.state.userID}`
    );
    res.data.forEach((element) => {
      element.created =
        element.created_date.split("-").reverse().join("-") +
        " at " +
        element.created_time;
      element.deadline =
        element.due_date.split("-").reverse().join("-") +
        " at " +
        element.due_time;
    });
    commit.commit("setTasks", res.data);

    const res2 = await this.$axios.get(
      `/tasks-management/tasks/myCompletedTasks/${this.state.userID}`
    );
    res2.data.forEach((element) => {
      element.created =
        element.created_date.split("-").reverse().join("-") +
        " at " +
        element.created_time;
      element.deadline =
        element.due_date.split("-").reverse().join("-") +
        " at " +
        element.due_time;
    });
    commit.commit("setTasks", [...this.state.tasks, ...res2.data]);
  },

  async getDeletedTasks(commit) {
    console.log("hi hi  ih i ");
    const res = await this.$axios.get(
      `/tasks-management/tasks/MyDeletedTasks/${this.state.userID}`
    );
    console.log(res.data, "new data");
    res.data.forEach((element) => {
      element.created =
        element.created_date.split("-").reverse().join("-") +
        " at " +
        element.created_time;
      element.deadline =
        element.due_date.split("-").reverse().join("-") +
        " at " +
        element.due_time;
    });
    commit.commit("setTasks", res.data);
  },

  async deleteTask(commit, taskId) {
    const res = await this.$axios.delete(
      `/tasks-management/tasks/deleteTask/${taskId}`
    );
    console.log(res.data, "teeeesting");
    if (res.status === 200) {
      const newTasks = this.state.tasks.filter((element) => {
        return element.task_id !== taskId;
      });
      console.log(newTasks, "newTasks");
      commit.commit("setTasks", newTasks);
    }
  },
};

// contains your mutations
export const mutations = {
  setTasks(state, payload) {
    state.fixTasks = payload;
    state.fixSearchTasks = payload;
    return (state.tasks = payload);
  },
  setCreateTaskDialog(state, payload) {
    return (state.createTaskDialog = payload);
  },
  setTaskDraior(state, payload) {
    console.log("payload", "payload", payload);
    return (state.taskDraior = payload);
  },
  setTodayTasks(state, payload) {
    let todayDate = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10);
    let filterTasks = state.fixTasks.filter((element) => {
      return element.due_date === todayDate;
    });
    state.fixSearchTasks = filterTasks;
    return (state.tasks = filterTasks);
  },
  setAllTasks(state, payload) {
    state.fixSearchTasks = state.fixTasks;
    return (state.tasks = state.fixTasks);
  },
  setLastWeekTasks(state) {
    const todayDate = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10);
    let dateOffset = 24 * 60 * 60 * 1000 * 7;
    let myDate = new Date(todayDate);
    let lastWeak = new Date(myDate.setTime(myDate.getTime() - dateOffset))
      .toISOString()
      .substr(0, 10);
    let filterTasks = state.fixTasks.filter((element) => {
      return element.due_date >= lastWeak && element.due_date < todayDate;
    });
    state.fixSearchTasks = filterTasks;
    return (state.tasks = filterTasks);
  },
  setThisWeekTasks(state) {
    const todayDate = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10);
    let dateOffset = 24 * 60 * 60 * 1000 * 7;
    let myDate = new Date(todayDate);
    let thisWeak = new Date(myDate.setTime(myDate.getTime() + dateOffset))
      .toISOString()
      .substr(0, 10);
    let filterTasks = state.fixTasks.filter((element) => {
      return todayDate <= element.due_date && thisWeak >= element.due_date;
    });
    state.fixSearchTasks = filterTasks;
    return (state.tasks = filterTasks);
  },
  setTomorrowTasks(state) {
    const todayDate = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10);
    let dateOffset = 24 * 60 * 60 * 1000 * 1;
    let myDate = new Date(todayDate);
    let tomorrow = new Date(myDate.setTime(myDate.getTime() + dateOffset))
      .toISOString()
      .substr(0, 10);
    let filterTasks = state.fixTasks.filter((element) => {
      return element.due_date === tomorrow;
    });
    state.fixSearchTasks = filterTasks;
    return (state.tasks = filterTasks);
  },
  search(state, text) {
    const arr = state.fixSearchTasks.filter((element) => {
      return element.subject.toLowerCase().includes(text.toLowerCase());
    });
    return (state.tasks = arr);
  },
  searchByCreator(state, text) {
    const arr = state.fixSearchTasks.filter((element) => {
      return element.creator_name.toLowerCase().includes(text.toLowerCase());
      // return true;
    });
    return (state.tasks = arr);
  },


/* -------------------------------------------------------------------------------------------------------------------------------------------------------- */


  searchAll(state, payload) {
    const { subject, creator, priority, workStatus } = payload;
    console.log({ subject, creator, priority, workStatus });
    if (subject && creator && priority && workStatus) {
      // ---------------------- 1 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.subject.toLowerCase().includes(subject.toLowerCase()) &&
          element.creator_name.toLowerCase().includes(creator.toLowerCase()) &&
          element.priority === priority &&
          element.status.toLowerCase() === workStatus.toLowerCase()
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (subject && creator && priority) {
      // ---------------------- 3-1 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.subject.toLowerCase().includes(subject.toLowerCase()) &&
          element.creator_name.toLowerCase().includes(creator.toLowerCase()) &&
          element.priority === priority
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (creator && priority && workStatus) {
      // ---------------------- 3-2 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.creator_name.toLowerCase().includes(creator.toLowerCase()) &&
          element.priority === priority &&
          element.status.toLowerCase() === workStatus.toLowerCase()
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (subject && priority && workStatus) {
      // ---------------------- 3-3 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.subject.toLowerCase().includes(subject.toLowerCase()) &&
          element.priority === priority &&
          element.status.toLowerCase() === workStatus.toLowerCase()
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (subject && creator && workStatus) {
      // ---------------------- 3-4 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.subject.toLowerCase().includes(subject.toLowerCase()) &&
          element.creator_name.toLowerCase().includes(creator.toLowerCase()) &&
          element.status.toLowerCase() === workStatus.toLowerCase()
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (subject && creator) {
      // ---------------------- 3-1 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.subject.toLowerCase().includes(subject.toLowerCase()) &&
          element.creator_name.toLowerCase().includes(creator.toLowerCase())
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (subject && priority) {
      // ---------------------- 3-2 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.subject.toLowerCase().includes(subject.toLowerCase()) &&
          element.priority === priority
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (subject && workStatus) {
      // ---------------------- 3-3 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.subject.toLowerCase().includes(subject.toLowerCase()) &&
          element.status.toLowerCase() === workStatus.toLowerCase()
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (creator && priority) {
      // ---------------------- 3-4 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.creator_name.toLowerCase().includes(creator.toLowerCase()) &&
          element.priority === priority
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (creator && workStatus) {
      // ---------------------- 3-5 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.creator_name.toLowerCase().includes(creator.toLowerCase()) &&
          element.status.toLowerCase() === workStatus.toLowerCase()
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (priority && workStatus) {
      // ---------------------- 3-6 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return (
          element.priority === priority &&
          element.status.toLowerCase() === workStatus.toLowerCase()
        );
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (subject) {
      // ---------------------- 1 fliter --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return element.subject.toLowerCase().includes(subject.toLowerCase());
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (creator) {
      // ---------------------- 1 fliter --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return element.creator_name
          .toLowerCase()
          .includes(creator.toLowerCase());
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (priority) {
      // ---------------------- 1 fliter --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        return element.priority === priority;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (workStatus) {
      // ---------------------- 1 --------------------------------- //
      const arr = state.fixSearchTasks.filter((element) => {
        console.log(element.status.toLowerCase() , workStatus);
        return element.status.toLowerCase() === workStatus.toLowerCase();
        // return true;
      });
      return (state.tasks = arr);
      // ----------------------------------------------------------------- //
    } else if (!subject && !creator && !priority) {
      return (state.tasks = state.fixSearchTasks);
    }
  },
};

// your root getters
export const getters = {
  getTaskDraior(state) {
    return state.taskDraior;
  },
  getTasks(state) {
    return state.tasks;
  },
};

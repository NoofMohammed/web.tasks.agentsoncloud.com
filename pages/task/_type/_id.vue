<template>
    <Task  :id="this.$route.params.id" :type="this.$route.params.type"/>
</template>



<script>
import Task from "../../../components/Task.vue"
export default {
    components :{
        Task
    },

}
</script>

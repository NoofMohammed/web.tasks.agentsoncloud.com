<template>
<div class="container-co">
  <v-card  max-width="75%" class="mx-auto">
    <v-toolbar color="cyan" dark>
      <v-toolbar-title>Comments</v-toolbar-title>
    </v-toolbar>

    <v-list three-line>
      <template v-for="(item, index) in comments" class="cards">
        <v-subheader
          v-if="item.header"
          :key="item.header"
          v-text="item.header"
        ></v-subheader>

        <v-divider
          v-else-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider>

        <v-list-item v-else :key="item.user_name">
          <v-list-item-avatar>
            <v-img
              src="https://firebasestorage.googleapis.com/v0/b/myfirst-77744.appspot.com/o/4e237423-c1fd-4c43-aba0-646b836bd14a.jpg?alt=media&token=8a79fc3c-107f-4d77-9238-8fa20f67225a"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.user_name"></v-list-item-title>
            <v-list-item-subtitle v-html="item.comment"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
  </div>
</template>

<script>
export default {
  name: "Comments",
  props: {
    comments: Array,
  },
  data: () => ({}),
};
</script>

<style scoped>

.container-co {
  margin-top: 40px;
  height: auto;
}

.v-list {
  margin-top: 20px;
  height: 400px;
  overflow-y: auto;
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
  background-image: linear-gradient(180deg, #00BCD4 0%, #1976D2 99%);
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
}

</style>

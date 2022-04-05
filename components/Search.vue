<template>
<body>
    <v-container>
      <div class="Main-Filter">
        <v-row>
          <v-col cols="12" sm='2'>
            Hello
          </v-col>
            <v-col cols="12" sm='2'>
            Hello
          </v-col>
            <v-col cols="12" sm='2'>
            Hello
          </v-col>  <v-col cols="12" sm='2'>
            Hello
          </v-col>
             <v-col
        class=""
        cols="12"
        sm="4"
      >
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
    </v-container>
</body>
</template>
<script>
export default {
  name: "FilterForm",
  data: () => ({
    // filterationResult: [],
    categorys:['All','machine Part','disposables' ,'office Supplier','tools' , 'Medicine' , 'products'],
  }),
  methods: {
    getitembyCategory() {
    //   this.$axios
    //     .$get(`/inventory-management/items`)
    //     .then((response) => {
    //       this.categoryname = response.data;
    //     })
    //     .catch((err) => {
    //       console.log(err.message);
    //     });
    },
    getAllName() {
    //   this.$axios
    //     .get(`/inventory-management/items/Allitems`)
    //     .then((response) => {
    //       for (let i = 0; i < response.data.length; i++) {
    //         const data = response.data[i].name;
    //         this.items.push(data);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error.message);
    //     });
    },
    getName() {
    //   if (this.selectCategoryname === "All") {
    //     this.selectCategoryname = undefined;
    //   }
    //   const data = {
    //     catrgory: this.selectCategoryname,
    //     name: this.value,
    //   };
    //   this.$store.dispatch("getFilterationResult", { data: data });
    },
  },
  created() {
    // this.getitembyCategory();
    // this.getAllName();
  },
};
</script>
<style scoped>
.select-categorys{
   background-color: #fff;
      height: 53px;
    padding: 0px;
    margin-top:3px;
}
.selectOption{
  background-color: #fff;
      height: 53px;
    padding: 0px;
    margin-top: 15px;
}
h3 {
  color: #3065B5;
  margin: 10px 0px;
  font-size: 25px;
  font-weight: bold;
}
.Main-Filter {
  padding: 25px;
  /* background-color: #2666CF; */
  border-radius: 10px;
  background-color: #3065B5;
}
.btn-search {
  background-color: #fff;
  font-size: 25px;
  color:#000;
  padding: 0px 20px;
  width: 100%;
  border-radius: 3px;
}
</style>
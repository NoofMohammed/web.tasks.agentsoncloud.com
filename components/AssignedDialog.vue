<template>
  <div>
    <v-dialog v-model="toggle" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 popupText">
          Are You Sure
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text class="delete-message">
          Do you want to delete this task
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text> delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "AssignedDialog",
  props: {
    toggle: Boolean,
  },
};
</script>

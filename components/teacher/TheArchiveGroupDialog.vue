<template>
  <v-dialog v-model="dialog" width="440">
    <template #activator="{ on }">
      <v-btn elevation="0" text color="red" rounded v-on="on">
        Archive class
      </v-btn>
    </template>
    <v-card class="">
      <v-card-title class="d-flex justify-center">
        Archive class?
      </v-card-title>
      <v-card-text>
        <p>
          Archived classes are moved to the 'ARCHIVE' section of your home page.
        </p>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false"> Cancel </v-btn>
          <v-btn
            color="red"
            :loading="loading"
            :disabled="loading"
            dark
            elevation="0"
            rounded
            class="ml-2"
            @click="archiveGroup()"
          >
            Archive class
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    groupId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  methods: {
    archiveGroup() {
      try {
        this.loading = true
        this.$store.dispatch('user/archiveGroup')
        this.$snack.showMessage({
          type: 'success',
          msg: 'Class archived',
        })
        this.$router.push('/classes')
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error archiving class`,
        })
      } finally {
        this.dialog = false
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <v-dialog v-model="dialog" width="440">
    <template #activator="{ on }">
      <v-btn elevation="0" text rounded color="red" v-on="on">
        <font-awesome-icon icon="fa-light fa-box-archive" class="mr-2" />
        Archive
      </v-btn>
    </template>
    <v-card class="rounded-xl" color="#fbfcff">
      <v-card-title
        class="d-flex justify-center text-h5 secondary--text mb-1 pt-5"
      >
        <font-awesome-icon icon="fa-light fa-box-archive" class="fa-sm" />
      </v-card-title>
      <v-card-text>
        <p class="text-h5 text-center">Archive class?</p>
        <p class="#41484d--text">
          This will move {{ group.name }} into the 'Archive'. Archived classes
          can be retored at any time.
        </p>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false"> Cancel </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            text
            rounded
            class="ml-2"
            @click="archiveGroup()"
          >
            Archive
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
  },
  methods: {
    async archiveGroup() {
      try {
        this.loading = true
        await this.$store.dispatch('user/archiveGroup')
        this.$snack.showMessage({
          type: 'success',
          msg: 'Class archived',
        })
        this.$router.push('/home')
      } catch (err) {
        console.error(err)
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

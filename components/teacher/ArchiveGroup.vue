<template>
  <v-dialog v-model="dialog" width="440">
    <template #activator="{ on }">
      <v-btn elevation="0" text color="red" v-on="on"> Archive class </v-btn>
    </template>
    <v-card class="modal danger">
      <v-card-title class="d-flex justify-center">
        Archive class?
      </v-card-title>
      <v-card-text>
        Are you sure? Archived classes are moved to the 'Archive' section on
        your home page.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> Cancel </v-btn>
        <v-btn
          color="red"
          :loading="loading"
          :disabled="loading"
          dark
          elevation="0"
          @click="archiveGroup()"
        >
          <v-icon left>{{ $icons.mdiArchiveOutline }}</v-icon>
          Archive class
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiArchiveOutline } from '@mdi/js'

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
  created() {
    this.$icons = {
      mdiArchiveOutline,
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

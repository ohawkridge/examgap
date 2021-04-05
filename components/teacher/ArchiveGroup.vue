<template>
  <v-dialog v-model="dialog" width="440">
    <template #activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on"> Archive class </v-btn>
    </template>
    <v-card class="modal danger">
      <v-card-title class="d-flex justify-center">
        Archive class?
      </v-card-title>
      <v-card-text>
        Are you sure? Archived classes are moved to the
        <span class="font-weight-medium">ARCHIVE</span> tab on the home page.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> Cancel </v-btn>
        <v-btn color="error" elevation="0" @click="archive()">
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
    }
  },
  created() {
    this.$icons = {
      mdiArchiveOutline,
    }
  },
  methods: {
    archive() {
      this.$store.dispatch('groups/archiveGroup')
      this.$snack.showMessage({
        type: 'success',
        msg: 'Class archived',
      })
      this.$router.push('/classes')
    },
  },
}
</script>

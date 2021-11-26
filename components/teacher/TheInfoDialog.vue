<template>
  <v-dialog v-model="dialog" width="400">
    <template #activator="{ on: dial }">
      <v-tooltip bottom>
        <template #activator="{ on: tool }">
          <v-btn class="ml-2" icon v-on="{ ...tool, ...dial }">
            <font-awesome-icon icon="fa-light fa-circle-info" class="ico-btn" />
          </v-btn>
        </template>
        <span>More information</span>
      </v-tooltip>
    </template>
    <v-card class="modal">
      <v-card-title class="d-flex justify-center">
        More information
      </v-card-title>
      <v-card-text>
        <ul>
          <li>
            Response id:
            <code>{{ response.id }}</code>
            <v-btn icon small @click="copyId()">
              <font-awesome-icon icon="fa-light fa-copy" class="xx" />
            </v-btn>
          </li>
          <li>
            Time taken: <span class="font-weight-medium">{{ timeTaken }}</span>
          </li>
        </ul>
        <div class="d-flex justify-end">
          <v-btn color="primary" rounded elevation="0" @click="dialog = false">
            Close
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    response: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    // Format time taken as mm:ss
    timeTaken() {
      const t = this.response.time
      if (t === 0) return 'N/A'
      return `${Math.floor(t / 60)}:${String(
        t - Math.floor(t / 60) * 60
      ).padStart(2, '0')}`
    },
  },
  methods: {
    // Copy response id to clipboard
    async copyId() {
      await navigator.clipboard.writeText(this.response.id)
      this.$snack.showMessage({
        msg: 'Copied to clipboard',
      })
    },
  },
}
</script>

<style scoped>
.ico-btn {
  height: 24px;
  width: 24px;
}

.xx {
  height: 18px;
  width: 18px;
}
</style>

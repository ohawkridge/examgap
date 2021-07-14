<template>
  <v-dialog v-model="dialog" width="400">
    <template #activator="{ on: dial }">
      <v-tooltip bottom>
        <template #activator="{ on: tool }">
          <v-btn class="ml-2" icon v-on="{ ...tool, ...dial }">
            <v-icon>{{ $icons.mdiInformationOutline }}</v-icon>
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
            Response id: <code>{{ response.id }}</code>
            <v-btn icon small @click="copyId()">
              <v-icon small>
                {{ $icons.mdiContentCopy }}
              </v-icon>
            </v-btn>
          </li>
          <li>Time taken: {{ timeTaken }}</li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" elevation="0" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiInformationOutline, mdiContentCopy } from '@mdi/js'

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
  created() {
    this.$icons = {
      mdiInformationOutline,
      mdiContentCopy,
    }
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

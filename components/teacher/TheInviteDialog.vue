<template>
  <v-dialog v-model="dialog" width="510">
    <v-card>
      <v-card-title class="d-flex justify-center">
        Invite students
      </v-card-title>
      <v-card-text>
        <p>There are three ways to add students:</p>
        <p class="text-subtitle-1 font-weight-medium mb-2">Share invite link</p>
        <v-text-field ref="link" :value="link" readonly outlined hide-details>
          <template #append>
            <v-btn class="fix-btn" text rounded @click="copy()">
              <v-icon left>{{ $icons.mdiContentCopy }}</v-icon>
              {{ copyBtn }}
            </v-btn>
          </template>
        </v-text-field>
        <p class="text-subtitle-1 font-weight-medium mb-2 mt-6">
          Share join code
        </p>
        <v-text-field :value="formattedLink" readonly outlined hide-details>
          <template #append>
            <v-btn class="fix-btn" text rounded @click="overlay = true">
              <v-icon left>{{ $icons.mdiFullscreen }}</v-icon>
              Show
            </v-btn>
          </template>
        </v-text-field>
        <p class="mt-2">Students can go to examgap.com and click Join Class.</p>
        <p class="text-subtitle-1 font-weight-medium mb-2 mt-6">
          Create accounts
        </p>
        <p class="mb-0">
          On the
          <span class="font-weight-medium">'STUDENTS'</span>
          tab, click Students, Add students.
        </p>
        <div class="d-flex justify-end">
          <v-btn color="primary" rounded elevation="0" @click="dialog = false">
            Close
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <!-- Giant join code -->
    <v-overlay
      opacity="0.86"
      :value="overlay"
      class="font-weight-bold white--text text-center big"
      @click.native="overlay = !overlay"
    >
      <div>Join Class</div>
      <div class="secondary--text">{{ formattedLink }}</div>
    </v-overlay>
  </v-dialog>
</template>

<script>
import { mdiFullscreen, mdiContentCopy } from '@mdi/js'

export default {
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      overlay: false,
      copyBtn: 'Copy',
    }
  },
  computed: {
    link() {
      return `https://examgap.com/signup?code=${this.formattedLink}`
    },
    formattedLink() {
      return `${this.group.code.substring(0, 3)}-${this.group.code.substring(
        3,
        6
      )}`
    },
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        // Reset text on Copy button
        this.copyBtn = 'Copy'
      }
      if (!this.dialog && this.group.assignments.length < 2) {
        // Continue onboarding
        this.$store.commit('app/setOnboardStep', 3)
      }
    },
  },
  created() {
    this.$icons = {
      mdiFullscreen,
      mdiContentCopy,
    }
  },
  beforeDestroy() {
    this.$nuxt.$off('open-invite')
  },
  mounted() {
    this.$nuxt.$on('open-invite', () => {
      this.dialog = true
    })
  },
  methods: {
    async copy() {
      await navigator.clipboard.writeText(this.link)
      this.copyBtn = 'Copied'
      this.$snack.showMessage({
        type: '',
        msg: 'Copied to clipboard',
      })
    },
  },
}
</script>

<style scoped>
/* Align buttons in inputs */
.fix-btn {
  margin-top: -7px;
  margin-right: -2px;
}

/* Big class code */
.big {
  font-size: 10vw;
}
@media only screen and (max-width: 600px) {
  .big {
    font-size: 14vw;
  }
}
</style>

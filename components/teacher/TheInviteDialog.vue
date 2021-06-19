<template>
  <v-dialog v-model="dialog" width="510">
    <template #activator="{ on: dialg }">
      <v-tooltip bottom>
        <template #activator="{ on: tooltip }">
          <v-btn
            :block="$vuetify.breakpoint.name === 'xs'"
            elevation="0"
            outlined
            color="primary"
            class="mr-2"
            :class="$store.state.user.onboardStep === 3 ? 'red-out' : ''"
            v-on="{ ...tooltip, ...dialg }"
            @click="onboard()"
          >
            Invite students
          </v-btn>
        </template>
        <span>Invite students</span>
      </v-tooltip>
    </template>
    <v-card class="modal">
      <v-card-title class="d-flex justify-center">
        Invite students
      </v-card-title>
      <v-card-text>
        <p>There are three ways to add students:</p>
        <p class="text-subtitle-1 font-weight-medium mb-2">Share invite link</p>
        <v-text-field ref="link" :value="link" readonly outlined hide-details>
          <template #append>
            <v-btn class="fix-btn" text color="primary" @click="copy()">
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
            <v-btn class="fix-btn" text color="primary" @click="overlay = true">
              <v-icon left>{{ $icons.mdiFullscreen }}</v-icon>
              Show
            </v-btn>
          </template>
        </v-text-field>
        <p class="mt-2">
          Students can go to examgap.com/signup and use this code to join your
          class.
        </p>
        <p class="text-subtitle-1 font-weight-medium mb-2 mt-6">
          Create accounts
        </p>
        <p class="mb-0">
          On the
          <nuxt-link :to="`/students/${group.id}`">Students</nuxt-link>
          screen, click Students, Add students.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" elevation="0" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
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
      // Reset text on Copy button
      if (!this.dialog) this.copyBtn = 'Copy'
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
    if (this.group.num_students === 0) {
      this.$store.commit('user/setOnboardStep', 3)
    }
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
    onboard() {
      // Continue onboarding if few assignments
      if (this.group.assignments.length < 3) {
        this.$store.commit('user/setOnboardStep', 4)
      }
    },
  },
}
</script>

<style scoped>
/* align buttons in inputs */
.fix-btn {
  margin-top: -7px;
  margin-right: -2px;
}

/* big class code */
.big {
  font-size: 10vw;
}
@media only screen and (max-width: 600px) {
  .big {
    font-size: 14vw;
  }
}
</style>

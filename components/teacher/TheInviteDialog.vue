<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ on, attrs }">
      <v-btn
        :block="$vuetify.breakpoint.name === 'xs'"
        elevation="0"
        v-bind="attrs"
        :class="
          onboard && n === 3 && group.num_students === 0
            ? 'red-out mr-2'
            : 'mr-2'
        "
        v-on="on"
        @click="
          $store.commit('user/setOnboardStep', 4)
          outline = false
        "
      >
        Invite students
      </v-btn>
    </template>
    <v-card class="modal">
      <v-card-title class="d-flex justify-center">
        Invite students
      </v-card-title>
      <v-card-text>
        <p>There are three ways to add students&hellip;</p>
        <p class="text-subtitle-1 font-weight-medium mb-2">Share invite link</p>
        <v-text-field ref="link" :value="link" readonly outlined hide-details>
          <template #append>
            <v-btn class="btn-slot" text color="primary" @click="copy()">
              <v-icon left>{{ $icons.mdiContentCopy }}</v-icon>
              {{ copyBtn }}
            </v-btn>
          </template>
        </v-text-field>
        <p class="text-subtitle-1 font-weight-medium mb-2 mt-6">
          Share join code
        </p>
        <v-text-field :value="formattedCode" readonly outlined hide-details>
          <template #append>
            <v-btn
              class="btn-slot"
              text
              color="primary"
              @click="overlay = true"
            >
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
      @click.native="overlay = !overlay"
    >
      <div class="font-weight-bold white--text text-center big">
        Go to examgap.com, Join Class
      </div>
      <div class="font-weight-bold white--text text-center big">
        Use code <span class="accent--text">{{ formattedCode }}</span>
      </div>
    </v-overlay>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
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
    ...mapState({
      n: (state) => state.user.onboardStep,
      onboard: (state) => state.user.onboard,
    }),
    link() {
      return `https://examgap.com/signup?code=${this.formattedCode}`
    },
    formattedCode() {
      return `${this.group.code.substring(0, 3)}-${this.group.code.substring(
        3,
        6
      )}`
    },
  },
  watch: {
    dialog() {
      if (!this.dialog) this.copyBtn = 'Copy'
    },
  },
  created() {
    this.$icons = {
      mdiFullscreen,
      mdiContentCopy,
    }
  },
  mounted() {
    if (this.group.num_students === 0) {
      this.$store.commit('user/setOnboardStep', 3)
      this.$store.commit('user/setOnboard', true)
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
  },
}
</script>

<style scoped>
.btn-slot {
  margin-top: -7px;
  margin-right: -2px;
}

.big {
  font-size: 6vw;
}
</style>

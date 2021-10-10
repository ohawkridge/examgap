<template>
  <v-dialog v-model="dialog" width="440">
    <v-card>
      <v-card-title class="d-flex justify-center">
        Invite students
      </v-card-title>
      <v-card-text>
        <p>There are three ways to add students:</p>
        <p class="text-subtitle-1 font-weight-medium mb-2">Manual creation</p>
        <p>
          On the
          <span class="font-weight-medium">'STUDENTS'</span>
          tab, click Students → Add students.
        </p>
        <p class="text-subtitle-1 font-weight-medium mb-2">Share invite link</p>
        <v-text-field ref="link" :value="link" readonly outlined hide-details>
          <template #append>
            <v-btn class="fix-btn" text rounded @click="copy()">
              <font-awesome-icon icon="fa-light fa-copy" class="mr-2" />
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
              <font-awesome-icon icon="fa-light fa-maximize" class="mr-2" />
              Show
            </v-btn>
          </template>
        </v-text-field>
        <p class="mt-2">Students can go to examgap.com and click JOIN CLASS.</p>
        <div class="d-flex justify-end">
          <v-btn color="primary" rounded elevation="0" @click="dialog = false">
            <span class="heading--text">Close</span>
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
      <div>{{ formattedLink }}</div>
    </v-overlay>
  </v-dialog>
</template>

<script>
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
    // Reset text on Copy button
    dialog() {
      if (!this.dialog) {
        this.copyBtn = 'Copy'
      }
    },
  },
  beforeDestroy() {
    this.$nuxt.$off('show-invite')
  },
  mounted() {
    this.$nuxt.$on('show-invite', () => {
      this.dialog = true
    })
  },
  methods: {
    async copy() {
      await navigator.clipboard.writeText(this.link)
      this.copyBtn = 'Copied'
      this.$snack.showMessage({
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

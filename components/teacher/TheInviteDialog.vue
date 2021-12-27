<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="d-flex justify-center">
        Invite students
      </v-card-title>
      <v-card-text>
        <p>There are three ways to add students:</p>
        <p class="text-subtitle-1 font-weight-medium mb-2">Manually</p>
        <p>Click 'MANAGE STUDENTS' → Add students.</p>
        <p class="text-subtitle-1 font-weight-medium mb-2">Share invite link</p>
        <v-text-field ref="link" :value="code" readonly outlined hide-details>
          <template #append>
            <v-btn class="fix-btn" text rounded @click="copy()">
              <font-awesome-icon icon="fa-light fa-copy" class="mr-2 ico-btn" />
              {{ copyBtn }}
            </v-btn>
          </template>
        </v-text-field>
        <p class="text-subtitle-1 font-weight-medium mb-2 mt-6">
          Share join code
        </p>
        <v-text-field :value="link" readonly outlined hide-details>
          <template #append>
            <v-btn class="fix-btn" text rounded @click="overlay = true">
              <font-awesome-icon
                icon="fa-light fa-maximize"
                class="mr-2 ico-btn"
              />
              Show
            </v-btn>
          </template>
        </v-text-field>
        <p class="mt-2">Students can go to examgap.com → JOIN CLASS.</p>
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
      <div>{{ link }}</div>
    </v-overlay>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

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
    ...mapGetters({
      code: 'user/activeGroupCode',
      link: 'user/activeGroupLink',
    }),
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
/* Big class code */
.big {
  font-size: 10vw;
}
@media only screen and (max-width: 600px) {
  .big {
    font-size: 14vw;
  }
}

.ico-btn {
  height: 24px;
  width: 24px;
}
</style>

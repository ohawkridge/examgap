<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"> Add students </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="usernames"
          outlined
          clearable
          label="Email addresses*"
          :error-messages="errors"
          autofocus
        ></v-textarea>
        <v-alert
          :icon="$icons.mdiInformationOutline"
          border="left"
          type="info"
          text
        >
          Enter student email addresses. <b>One email per line</b>
        </v-alert>
        <v-text-field
          v-model="domain"
          label="Append email domain"
          placeholder="schoolemail.com"
          outlined
          hide-details
        >
          <template #append>
            <v-btn class="fix-chip" text color="primary" @click="append()">
              Append
            </v-btn>
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          elevation="0"
          :loading="loading"
          :disabled="loading"
          @click="addStudents()"
          >Add Students</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js'

export default {
  name: 'AddStudents',
  props: {
    groupId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
      usernames: '',
      errors: [],
      loading: false,
      domain: '',
    }
  },
  computed: {
    namesArray() {
      return this.usernames
        .split(/[\r\n|,]+/)
        .map((name) => name.trim().replace(',', '').toLowerCase())
        .filter((name) => name !== '')
    },
  },
  created() {
    this.$icons = {
      mdiInformationOutline,
    }
  },
  mounted() {
    this.$nuxt.$on('open-add', () => {
      this.dialog = true
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('open-add')
  },
  methods: {
    append() {
      let out = ''
      for (let name of this.namesArray) {
        // Remove any old appendings
        if (name.includes('@')) {
          name = name.substring(0, name.indexOf('@'))
        }
        out = out + name + '@' + this.domain + '\n'
      }
      this.usernames = out
    },
    // N.B. When you add students like this, they *don't*
    // automatically get all existing assignments added
    async addStudents() {
      this.loading = true
      // Create new student accounts
      try {
        for (const username of this.namesArray) {
          const url = new URL(
            '/.netlify/functions/createAccount',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              username,
              groupId: this.groupId,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error adding ${username} ${response.status}`)
          }
          response = await response.json()
          // N.B. If you want to access student here use data.student
          // Send intro email to student
          const url2 = new URL(
            '/.netlify/functions/sendEmailWelcomeStudent',
            this.$config.baseURL
          )
          const mailResponse = await fetch(url2, {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: username }),
          })
          if (!mailResponse.ok) {
            throw new Error(`Error sending email ${mailResponse.status}`)
          }
          // Increment num_students on group in store
          this.$store.commit('user/incrementStudentCount')
          // Emit event to re-fetch student data in parent
          this.$nuxt.$emit('user-added')
        }
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error adding students',
        })
      } finally {
        this.dialog = false
        this.loading = false
        this.usernames = ''
      }
    },
  },
}
</script>

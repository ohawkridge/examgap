<template>
  <v-dialog v-model="dialog" max-width="440px">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"> Add students </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="usernames"
          outlined
          clearable
          label="Email addresses*"
          autofocus
        ></v-textarea>
        <v-alert
          :icon="$icons.mdiInformationOutline"
          border="left"
          dense
          type="info"
          text
        >
          <div>Enter student email addresses.</div>
          <div class="font-weight-bold">One address per line.</div>
        </v-alert>
        <v-text-field
          v-model="domain"
          label="Append email domain"
          placeholder="yourschool.org.uk"
          outlined
          hide-details
        >
          <template #append>
            <v-btn class="fix-btn" text color="primary" @click="append()">
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
  name: 'TheAddStudentsDialog',
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
      usernames: '',
      domain: '',
    }
  },
  computed: {
    userNamesArray() {
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
      for (let name of this.userNamesArray) {
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
      try {
        this.loading = true
        await this.$store.dispatch('students/addStudents', {
          usernames: this.userNamesArray,
          groupId: this.groupId,
        })
        this.$snack.showMessage({
          type: 'success',
          msg: `Student${this.userNamesArray.length !== 1 ? 's' : ''} added`,
        })
      } catch (err) {
        console.error(err)
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

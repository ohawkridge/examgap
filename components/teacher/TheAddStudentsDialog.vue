<template>
  <v-dialog v-model="dialog" max-width="480px">
    <v-card>
      <v-card-title class="d-flex justify-center"> Add students </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="usernames"
          outlined
          clearable
          placeholder="One address per line"
          label="Email addresses*"
          autofocus
        ></v-textarea>
        <v-text-field
          v-model="domain"
          label="Append email domain"
          placeholder="yourschool.org.uk"
          outlined
        >
          <template #append>
            <v-btn class="fix-btn" text rounded @click="append()">
              Append
            </v-btn>
          </template>
        </v-text-field>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            elevation="0"
            class="ml-2"
            rounded
            :loading="loading"
            :disabled="loading"
            @click="addStudents()"
            >Add Students</v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js'

export default {
  name: 'TheAddStudentsDialog',
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
        await this.$store.dispatch('group/addStudents', this.userNamesArray)
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

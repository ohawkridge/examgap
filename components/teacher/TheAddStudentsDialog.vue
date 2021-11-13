<template>
  <v-dialog v-model="dialog" max-width="480px">
    <v-card>
      <v-card-title class="d-flex justify-center"> Add students </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="usernames"
          outlined
          clearable
          placeholder="One email per line"
          label="Email addresses*"
          autofocus
        ></v-textarea>
        <v-text-field
          v-model="domain"
          label="Append domain"
          placeholder="@school.org.uk"
          outlined
          :rules="[domainRules]"
          @input="append()"
        >
          <template #append>
            <v-menu offset-y open-on-hover>
              <template #activator="{ on }">
                <font-awesome-icon
                  icon="fa-light fa-circle-info"
                  class="fa-lg"
                  v-on="on"
                />
              </template>
              <v-card max-width="260">
                <v-card-text class="text-body-2">
                  Enter your school's email domain to append to all students.
                </v-card-text>
              </v-card>
            </v-menu>
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
            :disabled="loading || userNamesArray.length === 0"
            @click="addStudents()"
            ><span class="heading--text">Add Students</span></v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TheAddStudentsDialog',
  data() {
    return {
      dialog: false,
      loading: false,
      usernames: '',
      domain: '',
      domainRules: (v) => !!(v[0] === '@') || "'@' sign is required.",
    }
  },
  computed: {
    userNamesArray() {
      if (this.usernames === null) {
        return []
      }
      return this.usernames
        .split(/[\r\n|,]+/)
        .map((name) => name.trim().replace(',', '').toLowerCase())
        .filter((name) => name !== '')
    },
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.domain = ''
      }
    },
  },
  beforeDestroy() {
    this.$nuxt.$off('open-add')
  },
  mounted() {
    this.$nuxt.$on('open-add', () => {
      this.dialog = true
    })
  },
  methods: {
    append() {
      if (this.domain[0] === '@') {
        let out = ''
        for (let name of this.userNamesArray) {
          // Remove any old appendings
          if (name.includes('@')) {
            name = name.substring(0, name.indexOf('@'))
          }
          out = out + name + this.domain + '\n'
        }
        this.usernames = out
      }
    },
    // N.B. When you add students like this, they *don't*
    // automatically get all existing assignments added
    async addStudents() {
      if (this.userNamesArray.length > 0) {
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
          this.domain = ''
        }
      }
    },
  },
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center">
        Copy student{{ selected.length === 1 ? '' : 's' }}
      </v-card-title>
      <v-card-text>
        <ul class="mb-4">
          <li v-for="(user, i) in selected" :key="i">{{ user.username }}</li>
        </ul>
        <v-select
          v-model="selectedClass"
          outlined
          :items="groups"
          label="To class*"
        ></v-select>
        <p class="red--text">s: {{ selected }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          elevation="0"
          :disabled="loading"
          :loading="loading"
          @click="copy()"
        >
          Copy student{{ selected.length === 1 ? '' : 's' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    selected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      selectedClass: '',
    }
  },
  computed: {
    // Re-format groups for Vuetify select
    ...mapGetters({ groups: 'groups/groupsForSelect' }),
  },
  mounted() {
    this.$nuxt.$on('open-copy', () => {
      this.dialog = true
    })
  },
  methods: {
    // Copy student(s) into another group by
    // creating new mappings in GroupStudent
    async copy() {
      this.loading = true
      try {
        for (const user of this.selected) {
          const response = await fetch(
            '/.netlify/functions/createGroupStudent',
            {
              body: JSON.stringify({
                secret: this.$store.state.user.secret,
                studentId: user.id,
                groupId: this.selectedClass,
                addStudent: true,
              }),
              method: 'POST',
            }
          )
          if (!response.ok) {
            throw new Error(`Error copying student(s) ${response.status}`)
          }
        }
        this.$snack.showMessage({
          type: 'success',
          msg: `Success. Student${
            this.selected.length === 1 ? '' : 's'
          } copied`,
        })
      } catch (e) {
        console.error(e)
        this.$snack.showMessage({
          type: 'error',
          msg: `Error copying student${this.selected.length === 1 ? '' : 's'}`,
        })
      } finally {
        this.dialog = false
        this.loading = false
      }
    },
  },
}
</script>

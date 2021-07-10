<template>
  <v-dialog v-model="dialog" max-width="440">
    <v-card class="modal">
      <v-card-title class="d-flex justify-center">
        Copy student{{ selected.length === 1 ? '' : 's' }}
      </v-card-title>
      <v-card-text>
        <ul class="mb-4 debug">
          <li v-for="(user, i) in selected" :key="i">{{ user.username }}</li>
        </ul>
        <v-select
          v-model="selectedClass"
          no-data-text="No classes available"
          outlined
          :items="groups"
          label="To class*"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          elevation="0"
          :disabled="loading"
          :loading="loading"
          @click="copyStudents()"
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
    // Array of student ids to copy
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
    // Groups for v-select
    ...mapGetters({
      groups: 'user/selectGroups',
    }),
  },
  mounted() {
    this.$nuxt.$on('open-copy', () => {
      this.dialog = true
    })
  },
  methods: {
    async copyStudents() {
      this.loading = true
      try {
        await this.$store.dispatch('user/copyStudents', this.selected)
        this.$snack.showMessage({
          type: 'success',
          msg: `Student${this.selected.length === 1 ? '' : 's'} copied`,
        })
      } catch (err) {
        console.error(err)
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

<template>
  <v-dialog v-model="dialog" max-width="360">
    <v-card class="rounded-xl">
      <v-card-title class="d-flex justify-center">Choose class</v-card-title>
      <v-card-text>
        <v-btn
          v-for="(group, i) in groups"
          :key="i"
          elevation="0"
          block
          large
          :color="$vuetify.theme.dark ? '#620d1e' : '#ffd9dc'"
          rounded
          class="mb-6"
          @click="nav(group)"
        >
          {{ group.name }}
        </v-btn>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false"> Cancel </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    ...mapState({
      groups: (state) => state.user.groups,
    }),
  },
  mounted() {
    this.$nuxt.$on('show-new', () => {
      this.dialog = true
    })
  },
  methods: {
    nav(group) {
      this.$store.commit('user/setActiveGroupId', group.id)
      this.dialog = false
      this.$router.push(`/questions/${group.course.id}`)
    },
  },
}
</script>

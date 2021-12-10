<template>
  <v-dialog v-model="dialog" max-width="360" class="rounded-xl">
    <v-card class="rounded-xl" color="#fbfcff">
      <v-card-title></v-card-title>
      <v-card-text>
        <p class="text-h5 text-center">Choose class</p>
        <v-btn
          v-for="(group, i) in groups"
          :key="i"
          elevation="0"
          block
          large
          color="#ffd9dc"
          rounded
          class="mb-4"
          @click="nav(group)"
        >
          <span style="color: 40000c">{{ group.name }}</span>
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
      this.$router.push(`/browse/${group.course.id}`)
    },
  },
}
</script>

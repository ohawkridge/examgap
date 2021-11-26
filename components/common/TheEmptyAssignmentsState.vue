<template>
  <v-row style="height: 50vh">
    <v-col cols="12" class="d-flex justify-center align-center">
      <div class="text-center">
        <v-img
          src="/no-task.svg"
          width="180"
          height="130"
          contain
          class="mx-auto"
          alt="Books and pens illustrations"
        />
        <p class="text-center black--text mt-4">
          No {{ !$store.state.app.upcoming ? 'upcoming' : 'past' }} assignments
        </p>
        <v-tooltip v-if="teacher" bottom>
          <template #activator="{ on }">
            <v-btn
              elevation="0"
              rounded
              outlined
              color="primary"
              v-on="on"
              @click="addAssignment()"
            >
              <font-awesome-icon icon="fa-light fa-plus" class="mr-2" />
              Assignment
            </v-btn>
          </template>
          <span>Add assignment</span>
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      teacher: (state) => state.user.teacher,
    }),
  },
  methods: {
    addAssignment() {
      // Clear previous selections (shouldn't be any)
      this.$store.commit('topics/clearSelectedQuestions')
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>

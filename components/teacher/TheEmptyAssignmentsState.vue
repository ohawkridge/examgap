<template>
  <v-row style="height: 50vh">
    <v-col cols="12" class="d-flex justify-center align-center">
      <div class="text-center">
        <v-img src="/no-task.svg" contain alt="Books and pens illustrations" />
        <p class="text-center">No upcoming assignments</p>
        <v-tooltip bottom>
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
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
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

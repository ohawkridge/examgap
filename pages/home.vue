<template>
  <v-container class="pt-3 pt-md-10">
    <!-- Teacher xx -->
    <template v-if="teacher">
      <v-row>
        <v-col cols="12" offset-md="1" md="10">
          <p class="text-h5">
            <font-awesome-icon
              icon="fa-light fa-plus"
              class="mr-2"
              style="width: 24px"
            />
            New assignment for&hellip;
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="1" md="10">
          <template v-for="(group, i) in groups">
            <v-tooltip :key="i" bottom>
              <template #activator="{ on }">
                <v-btn
                  elevation="0"
                  large
                  rounded
                  :block="$vuetify.breakpoint.name === 'xs'"
                  :color="$vuetify.theme.dark ? '#620d1e' : '#ffd9dc'"
                  class="mb-4 mr-3"
                  @click="newAssignment(group)"
                  v-on="on"
                >
                  {{ group.name }}
                </v-btn>
              </template>
              <span>Add assignment</span>
            </v-tooltip>
          </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="1" md="10">
          <p class="text-h5">
            <font-awesome-icon
              icon="fa-light fa-clock-rotate-left"
              class="mr-2"
            />
            Recent assignments
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" offset-md="1" md="8">
          <template v-for="(assignment, i) in assignments">
            <teacher-assignment-card :key="i" :assignment="assignment" />
          </template>
        </v-col>
      </v-row>
    </template>
    <!-- Student xx -->
    <template v-else>
      <v-row>
        <v-col cols="12" md="9" offset-md="1" class="text-h5">
          <v-menu offset-y open-on-hover>
            <template #activator="{ on }">
              <span v-on="on">
                <font-awesome-icon
                  icon="fa-light fa-hand-wave"
                  class="section-icon"
                />
                {{ greeting.text }},</span
              >
              {{ username | name }}
            </template>
            <v-card class="rounded-lg" max-width="220">
              <v-card-text>
                {{ greeting.text }} is how you say 'Hello' in
                {{ greeting.country }}.
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="9" offset-md="1">
          <p class="text-subtitle-1">
            {{ quote.quote }}&mdash;<span class="font-weight-light">{{
              quote.author
            }}</span>
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="9" offset-md="1">
          <p class="text-h5">
            <font-awesome-icon
              icon="fa-light fa-calendar-star"
              class="section-icon"
            />
            Upcoming assignments
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="7" offset-md="1">
          <template v-if="$fetchState.pending">
            <assignment-card-loader v-for="i in 1" :key="i" />
          </template>
          <student-assignment-card
            v-for="(assignment, i) in assignments"
            v-else-if="!$fetchState.pending && assignments.length > 0"
            :key="i"
            :assignment="assignment"
          />
          <!-- Empty state xx -->
          <template v-else>
            <v-img
              src="/no-task.svg"
              width="180"
              height="130"
              contain
              class="mx-auto"
              alt="Books and pens illustrations"
            />
            <p class="text-center mt-4">No upcoming assignments</p>
          </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="9" offset-md="1">
          <p class="text-h5">
            <font-awesome-icon
              icon="fa-light fa-head-side-brain"
              class="section-icon"
            />
            Revise
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="9" offset-md="1">
          <template v-for="(group, i) in groups">
            <v-btn
              :key="i"
              elevation="0"
              large
              rounded
              :block="$vuetify.breakpoint.name === 'xs'"
              :color="$vuetify.theme.dark ? '#620d1e' : '#ffd9dc'"
              class="mb-4 mr-4"
              @click="revise(group.id)"
            >
              {{ group.course.name }}
            </v-btn>
          </template>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TeacherAssignmentCard from '~/components/teacher/TeacherAssignmentCard.vue'
import StudentAssignmentCard from '~/components/student/StudentAssignmentCard.vue'
import AssignmentCardLoader from '~/components/student/AssignmentCardLoader.vue'

export default {
  components: {
    TeacherAssignmentCard,
    StudentAssignmentCard,
    AssignmentCardLoader,
  },
  beforeRouteLeave(to, from, next) {
    // Clear store to avoid flash of recents on _group.vue
    this.$store.commit('group/setAssignments', [])
    next()
  },
  layout: 'app',
  async fetch() {
    await this.$store.dispatch('user/getQuote')
    await this.$store.dispatch('group/getUpcoming')
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
    }),
    ...mapState({
      teacher: (state) => state.user.teacher,
      username: (state) => state.user.username,
      groups: (state) => state.user.groups,
      quote: (state) => state.user.quote,
      assignments: (state) => state.group.assignments,
    }),
    greeting() {
      const greetings = [
        { country: 'Arabic', text: 'Asalaam alaikum' },
        { country: 'Bengali', text: 'Namaskar' },
        { country: 'Bulgarian', text: 'Zdraveĭte' },
        { country: 'Catalan', text: 'Hola' },
        { country: 'Chinese', text: 'Nǐ hǎo' },
        { country: 'Dutch', text: 'Goede dag' },
        { country: 'English', text: 'Hi' },
        { country: 'French', text: 'Bonjour' },
        { country: 'German', text: 'Guten tag' },
        { country: 'Greek', text: 'Kalimera' },
        { country: 'Hebrew', text: 'Shalom aleichem' },
        { country: 'Hindi', text: 'Namastē' },
        { country: 'Hungarian', text: 'Jo napot' },
        { country: 'Indonesian', text: 'Selamat siang' },
        { country: 'Italian', text: 'Salve' },
        { country: 'Japanese', text: 'Konnichiwa' },
        { country: 'Korean', text: 'Anyoung haseyo' },
        { country: 'Lithuanian', text: 'Sveiki' },
        { country: 'Norwegian', text: 'God dag' },
        { country: 'Polish', text: 'Dzień dobry' },
        { country: 'Portuguese', text: 'Olá' },
        { country: 'Romainian', text: 'Bună ziua' },
        { country: 'Russian', text: 'Zdravstvuyte' },
        { country: 'Serbian', text: 'Zdravo' },
        { country: 'Spanish', text: 'Hola' },
        { country: 'Swahili', text: 'Shikamoo' },
        { country: 'Swedish', text: 'God dag' },
        { country: 'Thai', text: 'Sawasdee' },
        { country: 'Tahitian', text: 'Ia ora na' },
        { country: 'Turkish', text: 'Merhaba' },
        { country: 'Ukrainian', text: 'Zdravstvuyte' },
        { country: 'Vietnamese', text: 'Xin chào' },
        { country: 'Welsh', text: 'Shwmae' },
        { country: 'Zulu', text: 'Ngiyakwemukela' },
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    },
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Home')
  },
  methods: {
    newAssignment(group) {
      this.$store.commit('user/setActiveGroupId', group.id)
      this.$router.push(`/questions/${group.course.id}`)
    },
    revise(groupId) {
      this.$store.commit('user/setActiveGroupId', groupId)
      this.$store.commit('app/setTab', 1)
      this.$router.push(`/class/${groupId}`)
    },
  },
}
</script>

<style scoped>
/* align section icons */
.section-icon {
  width: 24px;
  height: 24px;
  margin-right: 16px;
}
</style>

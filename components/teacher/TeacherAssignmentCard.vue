<template>
  <v-card
    class="mb-6 rounded-lg outline"
    outlined
    hover
    color="#ffffff"
    @click="nav()"
  >
    <v-card-title class="d-flex text-h6 justify-space-between">
      {{ assignment.name }}
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn icon @click.stop="">
            <font-awesome-icon
              icon="fa-light fa-ellipsis-vertical"
              class="ico-btn"
              v-on="on"
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item disabled>
            <v-list-item-title class="red--text"> Delete </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text class="d-flex justify-space-between">
      <div>
        <div>
          <span class="align-date font-weight-bold">Start:</span
          >{{ assignment.start | date }}
        </div>
        <div>
          <span class="align-date font-weight-bold">Due:</span
          >{{ assignment.dateDue | date }}
        </div>
      </div>
      <div class="d-flex align-end">
        <v-chip label color="#c1e8ff" small class="mr-3">
          <!-- TODO Qs on mobile -->
          <span class="xy">
            {{ assignment.numQuestions }} Q{{
              assignment.numQuestions | pluralize
            }}
          </span>
        </v-chip>
        <v-chip label color="#c1e8ff" small>
          <span class="xy"
            >{{ assignment.numStudents }} student{{
              assignment.numStudents | pluralize
            }}</span
          >
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    assignment: {
      type: Object,
      default: () => {},
    },
    courseName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  computed: {
    // On /home, show group name
    // On /class, show course name
    subtitle() {
      return this.$route.name === 'home'
        ? this.assignment.group.name
        : this.courseName
    },
  },
  methods: {
    nav() {
      this.$store.commit('user/setActiveGroupId', this.assignment.group.id)
      this.$router.push(`/report/${this.assignment.id}`)
    },
  },
}
</script>

<style scoped>
.xx {
  color: #40000c;
}

.xy {
  color: #001e2c;
}
</style>

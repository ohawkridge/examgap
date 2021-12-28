<template>
  <v-card class="mb-6 rounded-lg" hover @click="nav()">
    <v-card-title class="d-flex text-h6 justify-space-between">
      {{ assignment.name }}
      <v-menu offset-y rounded="lg">
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
          <v-list-item @click="delAss()">
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
        <v-chip label color="tertiary" outlined small class="mr-3">
          {{ assignment.numQuestions }} Q{{
            assignment.numQuestions | pluralize
          }}
        </v-chip>
        <v-chip label color="tertiary" outlined small>
          {{ assignment.numStudents }} student{{
            assignment.numStudents | pluralize
          }}
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
    delAss() {
      $nuxt.$emit('show-delete', this.assignment.id, this.assignment.group.id)
    },
  },
}
</script>

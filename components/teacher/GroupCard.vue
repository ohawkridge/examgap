<template>
  <v-card class="bordered" hover nuxt :to="`/group/${group.id}`">
    <v-card-title class="text-h6 font-weight-bold">
      {{ group.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ group.course.name }} ({{ group.course.board }})
    </v-card-subtitle>
    <v-card-text class="same-height d-flex align-end">
      <v-chip small label outlined color="primary">
        {{ group.num_students }} student{{ group.num_students | pluralize }}
      </v-chip>
      <!-- <v-alert
        v-if="group.num_students === 0"
        text
        type="info"
        :icon="$icons.mdiAlertCircleOutline"
      >
        <nuxt-link :to="`/students/${group.id}`"><b>Add students</b></nuxt-link>
        to complete setup
      </v-alert> -->
      <!-- <v-list v-else dense>
        <v-subheader class="overline"> Recent Assignments </v-subheader>
        <v-list-item
          v-for="(assignment, j) in group.assignments.slice(0, 3)"
          :key="j"
          two-line
          nuxt
          :to="`assignment/${assignment.id}`"
        >
          <v-list-item-content>
            <v-list-item-title>{{ assignment.name }}</v-list-item-title>
            <v-list-item-subtitle>
              Due {{ assignment.dateDue | date }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="group.assignments.length === 0">
          <v-list-item-content>
            <v-list-item-title>No assignments yet</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
    </v-card-text>
    <!-- <v-card-actions>
      <v-btn
        text
        block
        color="primary"
        elevation="0"
        @click="createAssign(group)"
      >
        <v-icon left>{{ $icons.mdiPlus }}</v-icon>
        Create assignment
      </v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
import { mdiPlus, mdiChevronDown, mdiAlertCircleOutline } from '@mdi/js'

export default {
  name: 'GroupCard',
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiChevronDown,
      mdiAlertCircleOutline,
    }
  },
  methods: {
    createAssign(group) {
      // Store group id for when assignment is actually created
      this.$store.commit('user/setGroup', group.id)
      this.$router.push(`/course/${group.course.id}`)
    },
  },
}
</script>

<style scoped>
.same-height {
  height: 80px;
}
</style>

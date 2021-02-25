<template>
  <v-card class="bordered" hover @click="open(group.id)">
    <v-card-title>
      {{ group.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ group.course.name }} ({{ group.course.board }})
    </v-card-subtitle>
    <v-card-text class="same-height d-flex align-end">
      <v-chip small label outlined color="primary">
        {{ group.num_students }} student{{ group.num_students | pluralize }}
      </v-chip>
      <!-- TODO -->
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
    // Remember group so, for example, on _report.vue
    // we don't have to re-fetch the group's info
    open(id) {
      this.$store.commit('groups/setGroup', this.group)
      this.$router.push(`/group/${this.group.id}`)
    },
  },
}
</script>

<style scoped>
.same-height {
  height: 80px;
}
</style>

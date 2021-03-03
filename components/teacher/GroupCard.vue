<template>
  <v-card hover @click="open(group.id)">
    <v-card-title>
      {{ group.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ group.course.name }} ({{ group.course.board }})
    </v-card-subtitle>
    <!-- N.B. min-height must be in-line -->
    <v-card-text class="d-flex align-end" style="min-height: 80px">
      <v-chip small label outlined color="primary">
        {{ group.num_students }} student{{ group.num_students | pluralize }}
      </v-chip>
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
    // Remember group so we don't have to re-fetch
    open(id) {
      this.$store.commit('groups/setGroup', this.group)
      this.$router.push(`/group/${this.group.id}`)
    },
  },
}
</script>

<template>
  <v-col cols="12" md="6" lg="4">
    <v-hover v-slot="{ hover }">
      <v-card hover @click="open()">
        <v-card-title :class="hover ? 'primary--text' : ''">
          {{ group.name }}
        </v-card-title>
        <v-card-subtitle>
          {{ group.course.name }} ({{ group.course.board }})
        </v-card-subtitle>
        <!-- min-height must be in-line -->
        <v-card-text class="d-flex align-end" style="min-height: 80px">
          <v-chip label outlined>
            <v-avatar left>
              <v-icon>{{ $icons.mdiAccountGroupOutline }}</v-icon>
            </v-avatar>
            {{ group.num_students }} student{{ group.num_students | pluralize }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import { mdiAccountGroupOutline } from '@mdi/js'

export default {
  name: 'GroupCard',
  props: {
    group: {
      type: Object,
      required: true,
    },
    groupIndex: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.$icons = { mdiAccountGroupOutline }
  },
  methods: {
    open() {
      // Remember active group
      this.$store.commit('user/setActiveGroupIndex', this.groupIndex)
      this.$router.push(`/group/${this.group.id}`)
    },
  },
}
</script>

<template>
  <v-container>
    <v-row class="justify-center mt-2">
      <v-col v-for="(group, i) in groups" :key="i" cols="12" md="4">
        <v-card hover outlined @click="navTo(group.id)">
          <v-card-title>
            {{ group.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ group.course.name }}
          </v-card-subtitle>
          <v-card-text class="d-flex justify-end">
            <v-chip label outlined small>
              {{ group.count }} Student{{ group.count | pluralize }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Archive',
  layout: 'app',
  async fetch() {
    try {
      await this.$store.dispatch('user/getGroups', false)
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching courses',
      })
    }
  },
  head() {
    return {
      title: 'Archive',
    }
  },
  computed: {
    ...mapState({
      groups: (state) => state.user.archivedGroups,
    }),
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Archive')
  },
  methods: {
    navTo(groupId) {
      this.$store.commit('user/setActiveGroupId', groupId)
      this.$router.push(`/group/${groupId}`)
    },
  },
}
</script>

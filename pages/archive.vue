<template>
  <v-container
    v-if="!$fetchState.pending && groups.length === 0"
    id="nav-fix"
    class="fill-height"
  >
    <!-- Empty state -->
    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <div class="text-center">
          <v-img
            src="/no-class.svg"
            width="180"
            contain
            class="mx-auto"
            alt="Mortar board illustrations"
          />
          <p class="mt-4">No archived classes</p>
          <p>
            Choose an active class from the sidebar or
            <nuxt-link to="/home">go home</nuxt-link>.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else class="pt-10">
    <v-row>
      <v-col v-for="(group, i) in groups" :key="i" cols="12" md="4">
        <v-card class="archived" hover outlined @click="nav(group.id)">
          <v-card-title>
            {{ group.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ group.course.name }}
          </v-card-subtitle>
          <v-card-text class="d-flex justify-end">
            <v-chip label small class="wht-bg">
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
  layout: 'app',
  async fetch() {
    try {
      await this.$store.dispatch('user/getArchived')
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
    nav(groupId) {
      this.$store.commit('user/setActiveGroupId', groupId)
      this.$router.push(`/group/${groupId}`)
    },
  },
}
</script>

<style scoped>
/* stripes */
.archived {
  background-image: repeating-linear-gradient(
    55deg,
    transparent 0 8px,
    #f5f5f5 8px 10px
  );
}

/* no stripes on chips */
span.wht-bg.v-chip.v-chip--no-color {
  background-color: #fff !important;
  border: 1px solid #bebebe !important;
}
</style>

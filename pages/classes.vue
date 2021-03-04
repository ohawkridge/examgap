<template>
  <div>
    <v-row>
      <v-col id="div1" cols="12">
        <div class="d-flex justify-space-between align-center">
          <v-btn-toggle v-model="tab" color="primary" group mandatory>
            <v-btn :value="true" class="rounded"> Classes </v-btn>
            <v-btn :value="false" class="rounded"> Archive </v-btn>
          </v-btn-toggle>
          <v-btn color="primary" text @click="$nuxt.$emit('show-create')">
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            {{ $vuetify.breakpoint.name == 'xs' ? 'Class' : 'Create Class' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(group, i) in groups" :key="i" cols="12" md="6" lg="4">
        <GroupCard :group="group" />
      </v-col>
      <!-- Create class card button -->
      <v-col v-if="tab" cols="12" md="6" lg="4">
        <v-card
          id="create-card"
          class="d-flex align-center justify-center"
          outlined
          hover
          height="172"
          @click="emitNew"
        >
          <v-btn color="primary" text>
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            Create class
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mdiPlus } from '@mdi/js'
import { mapGetters } from 'vuex'
import GroupCard from '@/components/teacher/GroupCard'

export default {
  components: {
    GroupCard,
  },
  layout: 'app',
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    // Get groups for 'Classes' menu
    ...mapGetters({
      groups: 'groups/activeGroups',
    }),
    // Remember which tab is active
    tab: {
      get() {
        return this.$store.state.groups.tab
      },
      set(value) {
        this.$store.commit('groups/setTab', value)
      },
    },
  },
  created() {
    this.$icons = { mdiPlus }
  },
}
</script>

<style scoped>
/* create class card */
#create-card {
  background: #f1eeee !important;
  border: 1px dashed #0078a0 !important;
}
</style>

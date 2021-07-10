<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <v-btn-toggle v-model="tab" color="primary" group mandatory>
            <v-btn :value="true" class="rounded">
              <v-icon left>{{ $icons.mdiHomeOutline }}</v-icon>
              Home
            </v-btn>
            <v-btn :value="false" class="rounded">
              <v-icon left>{{ $icons.mdiArchiveOutline }}</v-icon>
              Archive
            </v-btn>
          </v-btn-toggle>
          <v-btn
            elevation="0"
            color="primary"
            text
            @click="$nuxt.$emit('show-create')"
          >
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            {{ $vuetify.breakpoint.name == 'xs' ? 'Class' : 'Create Class' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="div mb-3"></div>
      </v-col>
    </v-row>
    <v-row>
      <template v-for="(group, i) in groups">
        <GroupCard
          v-if="group.active === tab"
          :key="i"
          :group="group"
          :group-index="i"
        />
      </template>
      <!-- Create class card -->
      <v-col v-if="tab && activeGroupCount > 0" cols="12" md="6" lg="4">
        <v-hover v-slot="{ hover }">
          <v-card
            :id="hover ? 'cc2' : 'cc1'"
            class="d-flex align-center justify-center rounded-lg"
            outlined
            hover
            height="172"
            @click="$nuxt.$emit('show-create')"
          >
            <v-btn text :color="hover ? 'primary' : ''">
              <v-icon left>{{ $icons.mdiPlus }}</v-icon>
              Create class
            </v-btn>
          </v-card>
        </v-hover>
      </v-col>
      <!-- Empty state -->
      <template v-if="!loading && activeGroupCount === 0 && tab">
        <v-col cols="12" class="d-flex justify-center">
          <v-img
            src="/no-class.svg"
            max-width="200"
            alt="Empty chair illustration"
          />
        </v-col>
        <v-col cols="12" class="text-center">
          <p class="text-body-2 mt-4">No classes yet</p>
          <v-btn
            elevation="0"
            color="primary"
            @click="$nuxt.$emit('show-create')"
          >
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            Create class
          </v-btn>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mdiPlus, mdiHomeOutline, mdiArchiveOutline } from '@mdi/js'
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
    ...mapGetters({
      // N.B. You *cannot* use this for GroupCards
      // Filter function throws off activeGroupIndex
      activeGroupCount: 'user/activeGroupCount',
    }),
    ...mapState({
      groups: (state) => state.user.groups,
      loading: (state) => state.app.loading,
    }),
    // Remember active tab (in store)
    tab: {
      get() {
        return this.$store.state.app.tab
      },
      set(value) {
        this.$store.commit('app/setTab', value)
      },
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiHomeOutline,
      mdiArchiveOutline,
    }
  },
}
</script>

<style scoped>
/* create class card hover */
#cc1 {
  background: #fefcfb !important;
  border: 1px dashed darkgray !important;
}

#cc2 {
  background: #fefcfb !important;
  border: 2px dashed #0078a0 !important;
}

.div {
  /* border-bottom: 1px solid #e3dede; */
  border-bottom: 1px solid #cccccc;
}
</style>

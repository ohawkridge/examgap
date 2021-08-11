<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn-toggle v-model="tab" color="primary" mandatory rounded>
          <v-btn :value="true">
            <v-icon left>{{ $icons.mdiHomeOutline }}</v-icon>
            Home
          </v-btn>
          <v-btn :value="false">
            <v-icon left>{{ $icons.mdiArchiveOutline }}</v-icon>
            Archive
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <template v-for="(group, i) in groups">
        <group-card
          v-if="group.active === tab"
          :key="i"
          :group="group"
          :group-index="i"
        />
      </template>
      <!-- Create Class -->
      <v-col v-if="tab && activeGroupCount > 0" cols="12" md="6" lg="4">
        <v-hover v-slot="{ hover }">
          <v-card
            :id="hover ? 'cc2' : 'cc1'"
            class="d-flex align-center justify-center"
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
      <template v-if="activeGroupCount === 0 && tab">
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
  <!-- <div>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader v-if="loading" :loading="true" type="heading">
        </v-skeleton-loader>
        <v-skeleton-loader
          v-if="loading"
          :loading="true"
          type="text"
          width="50%"
        >
        </v-skeleton-loader>
        <template v-else>
          <div class="text-h6 font-weight-black">
            {{ group.name }}
          </div>
          <div>{{ group.course.name }} ({{ group.course.board }})</div>
        </template>
      </v-col>
    </v-row>
    <divider-row />
    <v-row>
      <v-col cols="12" md="7">
        <the-assignments-card />
      </v-col>
      <v-col cols="12" md="5">
        <v-row>
          <v-col cols="12">
            <the-quote-of-the-day />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <the-revision-card />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div> -->
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
      title: 'Classes',
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
  border: 1px dashed darkgray !important;
}

#cc2 {
  border: 1px dashed #0078a0 !important;
}
</style>

<template>
  <div>
    <!-- **TEACHER** -->
    <template v-if="teacher">
      <v-tabs
        v-model="tab"
        centered
        background-color="transparent"
        style="border-bottom: 1px solid #d2d2d2 !important"
      >
        <v-tab class="text-capitalize">Home</v-tab>
        <v-tab class="text-capitalize">Archive</v-tab>
      </v-tabs>
    </template>
    <!-- **STUDENT** -->
    <template v-else>
      <v-tabs
        v-model="tab"
        centered
        background-color="transparent"
        style="border-bottom: 1px solid #d2d2d2 !important"
      >
        <v-tab class="text-capitalize">Assignments</v-tab>
        <v-tab class="text-capitalize">Revision</v-tab>
        <v-tab class="text-capitalize">Quote</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item> </v-tab-item>
        <v-tab-item> </v-tab-item>
        <v-tab-item>
          <the-quote-of-the-day />
        </v-tab-item>
      </v-tabs-items>
    </template>
    <!-- <template v-for="(group, i) in groups">
        <group-card
          v-if="group.active === tab"
          :key="i"
          :group="group"
          :group-index="i"
        />
      </template> -->
    <!-- Create Class -->
    <!-- <v-col v-if="tab && activeGroupCount > 0" cols="12" md="6" lg="4">
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
      </v-col> -->
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
import TheQuoteOfTheDay from '@/components/student/TheQuoteOfTheDay'
// import GroupCard from '@/components/teacher/GroupCard'

export default {
  components: {
    TheQuoteOfTheDay,
    // GroupCard,
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
      teacher: (state) => state.user.teacher,
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
  mounted() {
    this.$store.commit('app/setPageTitle', 'Classes')
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

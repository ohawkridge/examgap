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
      <v-row class="pa-3">
        <template v-for="(group, i) in groups">
          <group-card
            v-if="group.active === (tab === 0 ? true : false)"
            :key="i"
            :group="group"
            :group-index="i"
          />
        </template>
      </v-row>
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
        <v-tab-item>
          <v-list class="py-0">
            <v-list-item v-if="assignments.length === 0" class="divide">
              <v-list-item-content>
                <div class="d-flex align-center">
                  <div class="col1 font-weight-medium">No assignments yet.</div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(assignment, i) in assignments"
              v-else
              :key="i"
              nuxt
              :to="`/assignment/${assignment.id}`"
              class="divide"
            >
              <v-list-item-content>
                <div class="d-flex align-center">
                  <div class="col1">
                    <span class="font-weight-medium">{{
                      assignment.name
                    }}</span>
                    <div>
                      {{ assignment.questions.length }} Question{{
                        assignment.questions.length | pluralize
                      }}
                    </div>
                  </div>
                  <div class="col2">
                    {{ assignment.start | date }}
                    <v-icon small>{{ $icons.mdiArrowRight }}</v-icon>
                    {{ assignment.dateDue | date }}
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
        <v-tab-item> </v-tab-item>
        <v-tab-item>
          <the-quote-of-the-day />
        </v-tab-item>
      </v-tabs-items>
    </template>
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
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mdiPlus, mdiHomeOutline, mdiArchiveOutline } from '@mdi/js'
import TheQuoteOfTheDay from '@/components/student/TheQuoteOfTheDay'
import GroupCard from '@/components/teacher/GroupCard'

export default {
  components: {
    TheQuoteOfTheDay,
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
      activeGroupCount: 'user/activeGroupCount',
      assignments: 'user/assignments',
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

/* Assignment name (students) */
.col1 {
  width: 400px;
}
</style>

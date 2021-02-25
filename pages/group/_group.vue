<template>
  <div>
    <GroupHeader :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav :group-id="group.id" />
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="mt-n8 mt-sm-0 pa-md-4">
          <v-card-title
            v-if="group.assignments"
            class="d-flex justify-space-between align-center"
          >
            Assignment{{ group.assignments.length | pluralize }} ({{
              group.assignments.length
            }})
            <v-btn outlined color="primary" @click="createAssignment()">
              <v-icon left>{{ $icons.mdiPlus }}</v-icon>
              <!-- Shorten button on mobile -->
              {{
                $vuetify.breakpoint.name == 'xs'
                  ? 'Create'
                  : 'Create Assignment'
              }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(assignment, i) in assignments"
                :key="i"
                nuxt
                :to="`/report/${assignment.id}`"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ assignment.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Due {{ assignment.dateDue | date }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template #activator="{ on }">
                      <v-btn
                        icon
                        v-on="on"
                        @click.prevent
                        @mousedown.stop
                        @touchstart.native.stop
                      >
                        <v-icon>{{ $icons.mdiDotsVertical }}</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <!-- <EgDeleteAssignment
                        :assignment-id="assignment.id"
                        :group-id="group.id"
                      /> -->
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
              <v-list-item v-if="assignments.length === 0">
                <v-list-item-icon>
                  {{ $icons.mdiInformationOutline }}
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> No assignments yet</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GroupNav from '@/components/teacher/GroupNav'
import GroupHeader from '@/components/teacher/GroupHeader'
// import EgDeleteAssignment from "@/components/EgDeleteAssignment";
import { mdiDotsVertical, mdiInformationOutline, mdiPlus } from '@mdi/js'

export default {
  components: {
    GroupNav,
    GroupHeader,
    // EgDeleteAssignment,
  },
  layout: 'app',
  async asyncData({ store, params }) {
    const url = new URL(
      '/.netlify/functions/getAssignments',
      'http://localhost:8888'
    )
    const data = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        groupId: params.group,
      }),
      method: 'POST',
    })
    if (!data.ok) {
      throw new Error(`Error fetching assignments ${data.status}`)
    }
    const assignments = await data.json()
    return { assignments }
  },
  head() {
    return {
      title: this.group ? this.group.name : 'Group',
    }
  },
  computed: {
    group() {
      return this.$store.getters['groups/groupById'](this.$route.params.group)
    },
  },
  created() {
    this.$icons = {
      mdiDotsVertical,
      mdiInformationOutline,
      mdiPlus,
    }
  },
  methods: {
    createAssignment() {
      // Remember group when creating assignments
      this.$store.commit('assignments/setGroup', this.group.id)
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>

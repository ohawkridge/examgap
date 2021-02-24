<template>
  <div>
    <GroupHeader :group="group" />
    <v-row>
      <v-col cols="12" md="3">
        <GroupNav :group-id="group.id" />
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="mt-n8 mt-sm-0">
          <v-card-title
            v-if="group.assignments"
            class="text-h6 font-weight-bold d-flex justify-space-between align-center"
          >
            Assignment{{ group.assignments.length | pluralize }} ({{
              group.assignments.length
            }})
            <v-btn outlined color="primary" elevation="0" @click="create()">
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
                v-for="(assignment, i) in group.assignments"
                :key="i"
                nuxt
                :to="`/teacher/assignment/${assignment.id}`"
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
                      <EgDeleteAssignment
                        :assignment-id="assignment.id"
                        :group-id="group.id"
                      />
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
              <v-list-item
                v-if="!group.assignments || group.assignments.length === 0"
              >
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
  layout: 'App',
  head() {
    return {
      title: this.group ? this.group.name : 'Group',
    }
  },
  computed: {
    group() {
      return this.$store.getters['user/groupById'](this.$route.params.group)
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
    create() {
      this.$store.commit('user/setGroup', this.group.id)
      this.$router.push(`/course/${this.group.course.id}`)
    },
  },
}
</script>

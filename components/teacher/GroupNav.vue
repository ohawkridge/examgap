<template>
  <v-col cols="12" md="3">
    <v-card v-if="$vuetify.breakpoint.name !== 'xs'">
      <v-list nav>
        <v-list-item-group v-model="nav" color="primary">
          <v-list-item value="group-group" nuxt :to="`/group/${group.id}`">
            <v-list-item-icon>
              <v-icon>
                {{ $icons.mdiTextBoxCheckOutline }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Assignments</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            value="students-students"
            nuxt
            :to="`/students/${group.id}`"
          >
            <v-list-item-icon>
              <v-icon>
                {{ $icons.mdiAccountGroupOutline }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Students</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item value="grades-grades" nuxt :to="`/grades/${group.id}`">
            <v-list-item-icon>
              <v-icon>
                {{ $icons.mdiChartBoxOutline }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Grades</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item value="edit-edit" nuxt :to="`/edit/${group.id}`">
            <v-list-item-icon>
              <v-icon>
                {{ $icons.mdiCogOutline }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <!-- Switch to bottom-nav on mobile -->
    <v-bottom-navigation v-else v-model="nav" color="primary" app mandatory>
      <v-btn value="group-group" nuxt :to="`/group/${group.id}`" exact>
        <v-icon>
          {{ $icons.mdiTextBoxCheckOutline }}
        </v-icon>
        <span>Assignments</span>
      </v-btn>
      <v-btn value="students-students" nuxt :to="`/students/${group.id}`" exact>
        <v-icon>
          {{ $icons.mdiAccountGroupOutline }}
        </v-icon>
        <span>Students</span>
      </v-btn>
      <v-btn value="grades-grades" nuxt :to="`/grades/${group.id}`" exact>
        <v-icon>
          {{ $icons.mdiChartBoxOutline }}
        </v-icon>
        <span>Grades</span>
      </v-btn>
      <v-btn value="edit-edit" nuxt :to="`/edit/${group.id}`" exact>
        <v-icon>
          {{ $icons.mdiCogOutline }}
        </v-icon>
        <span>Settings</span>
      </v-btn>
    </v-bottom-navigation>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  mdiAccountGroupOutline,
  mdiCogOutline,
  mdiChartBoxOutline,
  mdiTextBoxCheckOutline,
} from '@mdi/js'

export default {
  data() {
    return {
      nav: this.$route.name,
    }
  },
  computed: {
    ...mapGetters({
      group: 'user/activeGroup',
    }),
  },
  created() {
    this.$icons = {
      mdiAccountGroupOutline,
      mdiCogOutline,
      mdiChartBoxOutline,
      mdiTextBoxCheckOutline,
    }
  },
}
</script>

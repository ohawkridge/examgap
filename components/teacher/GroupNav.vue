<template>
  <div>
    <v-bottom-navigation
      v-if="$vuetify.breakpoint.name == 'xs'"
      v-model="nav"
      color="primary"
      app
      mandatory
    >
      <v-btn value="group-group" nuxt :to="`/group/${groupId}`" exact>
        <v-icon>
          {{ $icons.mdiBookOpenOutline }}
        </v-icon>
        <span>Assignments</span>
      </v-btn>
      <v-btn value="students-students" nuxt :to="`/students/${groupId}`" exact>
        <v-icon>
          {{ $icons.mdiAccountGroupOutline }}
        </v-icon>
        <span>Students</span>
      </v-btn>
      <v-btn value="grades-grades" nuxt :to="`/grades/${groupId}`" exact>
        <v-icon>
          {{ $icons.mdiFinance }}
        </v-icon>
        <span>Grade book</span>
      </v-btn>
      <v-btn
        value="group-settings-settings"
        nuxt
        :to="`/group/settings/${groupId}`"
        exact
      >
        <v-icon>
          {{ $icons.mdiCogOutline }}
        </v-icon>
        <span>Settings</span>
      </v-btn>
    </v-bottom-navigation>
    <v-card v-else>
      <v-list nav>
        <v-list-item-group v-model="nav" color="primary">
          <v-list-item value="group-group" nuxt :to="`/group/${groupId}`">
            <v-list-item-icon>
              <v-icon>
                {{ $icons.mdiBookOpenOutline }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Assignments</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            value="students-students"
            nuxt
            :to="`/students/${groupId}`"
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
          <v-list-item value="grades-grades" nuxt :to="`/grades/${groupId}`">
            <v-list-item-icon>
              <v-icon>
                {{ $icons.mdiFinance }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Grade book</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item value="edit-edit" nuxt :to="`/edit/${groupId}`">
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
  </div>
</template>

<script>
import {
  mdiAccountGroupOutline,
  mdiCogOutline,
  mdiFinance,
  mdiBookOpenOutline,
} from '@mdi/js'

export default {
  props: {
    groupId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      nav: this.$route.name,
    }
  },
  created() {
    this.$icons = {
      mdiAccountGroupOutline,
      mdiCogOutline,
      mdiFinance,
      mdiBookOpenOutline,
    }
  },
}
</script>

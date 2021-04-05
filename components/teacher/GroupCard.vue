<template>
  <v-col cols="12" md="6" lg="4">
    <v-hover v-slot="{ hover }">
      <v-card
        hover
        :class="`${onboard ? 'point-out' : ''}`"
        :color="hover ? 'primary' : ''"
        @click="open()"
      >
        <v-card-title :class="hover ? 'white--text' : ''">
          {{ group.name }}
        </v-card-title>
        <v-card-subtitle :class="hover ? 'grey--text text--lighten-2' : ''">
          {{ group.course.name }} ({{ group.course.board }})
        </v-card-subtitle>
        <!-- N.B. min-height must be in-line -->
        <v-card-text class="d-flex align-end" style="min-height: 80px">
          <v-chip small label outlined :color="hover ? 'white' : 'primary'">
            {{ group.num_students }} student{{ group.num_students | pluralize }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import { mdiPlus, mdiChevronDown, mdiAlertCircleOutline } from '@mdi/js'

export default {
  name: 'GroupCard',
  props: {
    group: {
      type: Object,
      required: true,
    },
    groupIndex: {
      type: Number,
      default: 0,
    },
    onboard: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.$icons = {
      mdiPlus,
      mdiChevronDown,
      mdiAlertCircleOutline,
    }
  },
  methods: {
    // Remember the active group so we don't
    // have to re-fetch it each time
    open() {
      this.$store.commit('groups/setActiveGroupIndex', this.groupIndex)
      this.$router.push(`/group/${this.group.id}`)
    },
  },
}
</script>

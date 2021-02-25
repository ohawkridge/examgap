<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="9" md="8" lg="7" class="mt-md-3">
      <v-card class="pa-md-4">
        <v-card-title> Profile </v-card-title>
        <v-card-text>
          <v-text-field
            :value="username"
            label="Username"
            outlined
            hide-details
            :class="teacher ? 'mb-8' : ''"
            readonly
          ></v-text-field>
          <v-checkbox
            v-if="!teacher"
            v-model="examMode"
            label="Exam mode*"
            disabled
            hide-details
          >
          </v-checkbox>
          <small v-if="!teacher" id="small">*Set by your teacher</small>
          <v-text-field
            :value="school"
            label="School name"
            outlined
            readonly
          ></v-text-field>
          <v-text-field
            :value="`${expiresx} ${days}`"
            label="Subscription expires"
            outlined
            readonly
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'app',
  head() {
    return {
      title: 'Profile',
    }
  },
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      teacher: (state) => state.user.teacher,
      examMode: (state) => state.user.examMode,
      school: (state) => state.user.school,
      expires: (state) => state.user.subscriptionExpires,
    }),
    expiresx() {
      // This has been so buggy
      if (this.teacher) {
        if ('value' in this.expires) {
          return this.expires.value.substring(0, 10)
        } else if ('@date' in this.expires) {
          return this.expires['@date'].substring(0, 10)
        } else {
          return 'N/A'
        }
      } else {
        return 'N/A'
      }
    },
    days() {
      if (this.expiresx !== 'N/A') {
        const expires = new Date(this.expiresx)
        const n = Math.ceil(
          (expires.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
        )
        if (n <= 0) {
          return '(Expired)'
        } else {
          return `(${n} day${n !== 1 ? 's' : ''})`
        }
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped>
#small {
  display: inline-block;
  margin-bottom: 16px;
}
</style>

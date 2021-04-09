<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="9" md="8" lg="7" class="mt-md-3">
      <v-card class="pa-md-3">
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
          <p v-if="!teacher" class="text-caption">*Set by your teacher</p>
          <v-text-field
            :value="school"
            label="School name"
            outlined
            readonly
          ></v-text-field>
          <v-text-field
            :value="expires <= 0 ? 'Expired' : `${expires} days`"
            label="Subscription expires"
            :error="expires <= 0"
            outlined
            readonly
          ></v-text-field>
        </v-card-text>
        <v-card-actions v-if="teacher">
          <the-subscribe-dialog :expired="expires <= 0" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import TheSubscribeDialog from '@/components/teacher/TheSubscribeDialog'

export default {
  components: {
    TheSubscribeDialog,
  },
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
  },
}
</script>

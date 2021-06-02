<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="9" md="8" lg="7" class="mt-md-3">
      <v-card class="pa-md-3">
        <v-card-title> Profile </v-card-title>
        <v-card-text>
          <v-text-field
            :value="$store.state.user.username"
            label="Username"
            outlined
            hide-details
            :class="teacher ? 'mb-8' : ''"
            readonly
          ></v-text-field>
          <v-checkbox
            v-if="!teacher"
            v-model="$store.state.user.examMode"
            label="Exam mode"
            disabled
            hide-details
          >
          </v-checkbox>
          <p v-if="!teacher" class="text-caption">Set by your teacher</p>
          <v-text-field
            :value="$store.state.user.school"
            label="School name"
            outlined
            readonly
          ></v-text-field>
          <v-text-field
            :value="expiry"
            label="Subscription expires"
            :error="teacher && expires <= 0"
            outlined
            readonly
          >
            <template #append>
              <v-chip v-if="expires > 30" color="green" label class="fix-chip">
                Subscribed
                <v-icon color="#183a11" right>
                  {{ $icons.mdiCheck }}
                </v-icon>
              </v-chip>
              <v-chip v-else color="accent" label class="fix-chip">
                Soon
              </v-chip>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions v-if="teacher">
          <the-subscribe-dialog :days="expires" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import { mdiCheck } from '@mdi/js'
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
      teacher: (state) => state.user.teacher,
      expires: (state) => state.user.subscriptionExpires,
    }),
    expiry() {
      if (!this.teacher) return `N/A`
      return this.expires <= 0 ? 'Expired' : `${this.expires} days`
    },
  },
  created() {
    this.$icons = {
      mdiCheck,
    }
  },
}
</script>

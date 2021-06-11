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
            :error-messages="
              teacher && expires <= 0 ? ['Subscription expired'] : []
            "
            outlined
            readonly
          >
            <template v-if="teacher" #append>
              <v-chip
                v-if="expires > 30"
                color="green"
                outlined
                class="fix-chip"
              >
                Subscribed
                <v-icon color="green" right>
                  {{ $icons.mdiCheck }}
                </v-icon>
              </v-chip>
              <v-chip v-else color="accent" outlined class="fix-chip">
                Soon
                <v-icon color="accent" right>
                  {{ $icons.mdiClockAlertOutline }}
                </v-icon>
              </v-chip>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions v-if="teacher">
          <the-subscribe-dialog :block="true" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import { mdiCheck, mdiClockAlertOutline } from '@mdi/js'
import TheSubscribeDialog from '@/components/teacher/TheSubscribeDialog'

export default {
  name: 'Profile',
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
      if (!this.teacher) return this.expires
      return `${this.expires} days ${this.expires <= 0 ? 'ago' : ''}`
    },
  },
  created() {
    this.$icons = {
      mdiCheck,
      mdiClockAlertOutline,
    }
  },
}
</script>

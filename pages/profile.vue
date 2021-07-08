<template>
  <v-row class="justify-center">
    <v-col cols="12" sm="10" md="8" lg="7" class="mt-sm-3">
      <v-card class="eg-card">
        <v-card-text class="pa-sm-8">
          <p class="text-h6">Profile</p>
          <p class="font-weight-bold">
            <v-icon class="mr-2"> {{ $icons.mdiAccountOutline }} </v-icon
            >Account
          </p>
          <v-divider class="mb-6" />
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
            v-if="teacher"
            :value="`${expires} (${subscriptionDays} days)`"
            label="Subscription expires"
            :error="subscriptionDays <= 0"
            :success="subscriptionDays > 0"
            :append-icon="
              subscribed
                ? $icons.mdiCheckCircleOutline
                : $icons.mdiAlertCircleOutline
            "
            outlined
            readonly
          >
          </v-text-field>
          <the-subscribe-dialog v-if="teacher" :block="true" />
          <p class="font-weight-bold mt-6">
            <v-icon class="mr-2"> {{ $icons.mdiLockOutline }} </v-icon>Password
          </p>
          <v-divider class="mb-6" />
          <v-text-field
            v-model="pass1"
            type="password"
            :rules="passwordRules"
            label="New password* (min. 6 characters)"
            required
            validate-on-blur
            outlined
          ></v-text-field>
          <v-text-field
            v-model="pass2"
            type="password"
            :rules="passwordRules"
            label="New password again*"
            required
            validate-on-blur
            outlined
            :error-messages="match"
          ></v-text-field>
          <small>*Indicates required field</small>
          <v-btn
            color="primary"
            block
            type="submit"
            elevation="0"
            :disabled="typeof match == 'string' || loading"
            :loading="loading"
            @click="updatePass()"
            >Update Password</v-btn
          >
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiCheckCircleOutline,
  mdiAlertCircleOutline,
  mdiAccountOutline,
  mdiLockOutline,
} from '@mdi/js'
import TheSubscribeDialog from '@/components/teacher/TheSubscribeDialog'

export default {
  name: 'Profile',
  components: {
    TheSubscribeDialog,
  },
  layout: 'app',
  data() {
    return {
      pass1: '',
      pass2: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ],
      loading: false,
    }
  },
  head() {
    return {
      title: 'Profile',
    }
  },
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
      subscribed: (state) => state.user.subscribed,
      expires: (state) =>
        state.user.subscriptionExpires['@ts'].substring(0, 10),
      subscriptionDays: (state) => state.user.subscriptionDays,
    }),
    match() {
      return this.pass1 === this.pass2 ? [] : 'Passwords do not match'
    },
  },
  created() {
    this.$icons = {
      mdiCheckCircleOutline,
      mdiAlertCircleOutline,
      mdiAccountOutline,
      mdiLockOutline,
    }
  },
  methods: {
    async updatePass() {
      if (this.pass1 === this.pass2) {
        this.loading = true
        try {
          const url = new URL(
            '/.netlify/functions/updatePassword',
            this.$config.baseURL
          )
          let response = await fetch(url, {
            body: JSON.stringify({
              secret: this.$store.state.user.secret,
              newPass: this.pass1,
            }),
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error(`Error updating password ${response.status}`)
          }
          response = await response.json()
          this.$snack.showMessage({
            type: 'success',
            msg: 'Password updated',
          })
        } catch (e) {
          console.error(e)
          this.$snack.showMessage({
            msg: 'Error updating password',
            type: 'error',
          })
        } finally {
          this.loading = false
        }
      }
    },
  },
}
</script>

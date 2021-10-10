<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="5" class="mt-sm-6">
        <div class="text-h5">Account</div>
        <p class="font-weight-light mb-9">Manage your account details.</p>
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
          on-icon="fa-light fa-square-check"
          off-icon="fa-light fa-square"
          hide-details
        >
        </v-checkbox>
        <p v-if="!teacher" class="text-caption mb-6">Set by your teacher</p>
        <v-text-field
          :value="$store.state.user.school"
          label="School name"
          outlined
          readonly
        ></v-text-field>
        <v-text-field
          v-if="teacher"
          :value="`${expires} (${subscriptionDays} days)`"
          :label="subscribed ? 'Subscription expires' : 'Trial expires'"
          :error="subscriptionDays < 1"
          outlined
          readonly
        >
          <template #append>
            <div id="fix-chip">
              <v-chip v-if="subscribed" label color="#db5461" outlined>
                Subscribed
                <font-awesome-icon icon="fa-light fa-check" class="ml-2" />
              </v-chip>
            </div>
          </template>
        </v-text-field>
        <the-subscribe-dialog v-if="teacher" />
        <v-divider class="my-10" />
        <div class="text-h5 d-flex justify-space-between">Password</div>
        <p class="font-weight-light mb-9">Update your password.</p>
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
          rounded
          :disabled="typeof match == 'string' || loading"
          :loading="loading"
          @click="updatePass()"
          ><span class="heading--text">Update Password</span></v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
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
  mounted() {
    this.$store.commit('app/setPageTitle', 'Profile')
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

<style scoped>
#fix-chip {
  margin-top: -5px;
}
</style>

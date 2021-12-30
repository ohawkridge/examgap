<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="5" offset-md="1">
        <div class="text-subtitle-2">Account</div>
        <p class="text-caption">View your account details.</p>
        <v-text-field
          :value="$store.state.user.username"
          label="Username"
          outlined
          hide-details
          readonly
        ></v-text-field>
        <v-checkbox
          v-if="!teacher"
          v-model="$store.state.user.examMode"
          label="Exam mode"
          disabled
        >
        </v-checkbox>
        <p v-if="!teacher" class="text-caption mb-6">Set by your teacher</p>
        <v-text-field
          :value="$store.state.user.school"
          label="School name"
          outlined
          hide-details
          readonly
        ></v-text-field>
        <v-text-field
          v-if="teacher"
          :value="subMsg"
          :label="subscribed ? 'Subscription expires' : 'Trial expires'"
          :error="subscriptionDays < 1"
          outlined
          readonly
        >
          <template #append>
            <v-chip
              v-if="subscribed"
              id="fix-chip"
              label
              color="secondary"
              outlined
            >
              Subscribed
              <font-awesome-icon icon="fa-light fa-check" class="ml-2 fa-lg" />
            </v-chip>
          </template>
        </v-text-field>
        <the-subscribe-dialog v-if="teacher" />
        <v-divider class="mt-10 mb-8" />
        <div class="text-subtitle-2">Password</div>
        <p class="text-caption">Update your password.</p>
        <v-form ref="form">
          <v-text-field
            v-model="pass1"
            type="password"
            :rules="rules"
            label="New password* (min. 6 characters)"
            required
            outlined
          ></v-text-field>
          <v-text-field
            v-model="pass2"
            type="password"
            :rules="rules"
            label="New password again*"
            required
            outlined
          ></v-text-field>
          <v-btn
            color="primary"
            block
            elevation="0"
            rounded
            :disabled="loading"
            :loading="loading"
            @click="updatePass()"
          >
            <span :class="$vuetify.theme.dark ? 'pb-text' : ''">
              Update Password</span
            >
          </v-btn>
        </v-form>
        <v-divider class="mt-10 mb-8" />
        <div class="text-subtitle-1">Appearance</div>
        <p class="text-caption">Choose how Examgap looks.</p>
        <v-radio-group v-model="mode" mandatory>
          <v-radio value="light" class="mb-4">
            <template #label>
              <div class="ml-2">
                <font-awesome-icon icon="fa-light fa-sun" class="mr-2 fa-lg" />
                Day theme
              </div>
            </template>
          </v-radio>
          <v-radio value="dark">
            <template #label>
              <div class="ml-2">
                <font-awesome-icon icon="fa-light fa-moon" class="mr-2 fa-lg" />
                Night theme
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
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
      loading: false,
      rules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
        (v) => this.pass1 === this.pass2 || 'Passwords must match',
      ],
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
      subscriptionDays: (state) => state.user.subscriptionDays,
    }),
    ...mapGetters({ expires: 'user/expires' }),
    mode: {
      get() {
        return this.$vuetify.theme.dark ? 'dark' : 'light'
      },
      set(val) {
        this.$vuetify.theme.dark = val === 'dark'
      },
    },
    subMsg() {
      return this.subscriptionDays < 0
        ? `${this.expires} (${Math.abs(this.subscriptionDays)} days ago)`
        : `${this.expires} (${this.subscriptionDays}) days`
    },
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Profile')
  },
  methods: {
    async updatePass() {
      if (this.$refs.form.validate()) {
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
        } catch (err) {
          console.error(err)
          this.$snack.showMessage({
            msg: 'Error updating password',
            type: 'error',
          })
        } finally {
          this.loading = false
          this.$refs.form.resetValidation()
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

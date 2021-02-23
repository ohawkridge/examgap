<template>
  <v-row class="justify-center mt-md-6">
    <v-col cols="12" sm="9" md="8">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold">
          Change password
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="oldPw"
              type="password"
              label="Old password*"
              :error-messages="oldErrMsg"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="pass1"
              type="password"
              :rules="passwordRules"
              label="New password*"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="pass2"
              type="password"
              :rules="passwordRules"
              label="New password again*"
              required
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
              >Change Password</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'EgApp',
  data() {
    return {
      loading: false,
      oldPw: '',
      pass1: '',
      pass2: '',
      oldErrMsg: [],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ],
    }
  },
  head() {
    return {
      title: 'Change password',
    }
  },
  computed: {
    match() {
      return this.pass1 === this.pass2 ? [] : 'Passwords do not match'
    },
  },
  methods: {
    // async updatePass() {
    //   if (this.$refs.form.validate()) {
    //     this.loading = true
    //     try {
    //       const res = await updatePass(this.oldPw, this.pass1)
    //       if (!res) {
    //         this.oldErrMsg.push(`Old password incorrect`)
    //       } else {
    //         this.$refs.form.reset()
    //         this.$snack.showMessage({
    //           msg: 'Success. Password updated',
    //           type: 'success',
    //         })
    //       }
    //     } catch (e) {
    //       console.error(e)
    //       this.$snack.showMessage({
    //         msg: 'Error changing password',
    //         type: 'error',
    //       })
    //     } finally {
    //       this.$refs.form.reset()
    //       this.loading = false
    //     }
    //   }
    // },
  },
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on }">
      <v-btn color="primary" block elevation="0" v-on="on">
        {{ subscribed ? 'Renew Subscription' : 'Subscribe' }}
      </v-btn>
    </template>
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"
        >Subscribe to Examgap</v-card-title
      >
      <v-card-text>
        <p>
          Request an email invoice you can pay online or forward to your bursar.
        </p>
        <!-- <v-checkbox v-model="selectedPackage" value="both">
          <template #label>
            <div>
              Complete Computer Science—<strong>£199</strong>
              <v-chip color="accent" outlined class="ml-2 mb-1" small
                >Save £59</v-chip
              >
            </div>
          </template>
        </v-checkbox> -->
        <v-checkbox v-model="selectedPackage" value="gcse" readonly>
          <template #label>
            <div>
              GCSE Computer Science—<strong>£129</strong>
              <span class="text-caption">(VAT included)</span>
            </div>
          </template>
        </v-checkbox>
        <!-- <v-checkbox v-model="selectedPackage" value="alevel">
          <template #label>
            <div>A Level Computer Science—<strong>£129</strong></div>
          </template>
        </v-checkbox> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="primary"
          elevation="0"
          :loading="loading"
          :disabled="loading"
          @click="request()"
        >
          Request invoice
        </v-btn>
      </v-card-actions>
    </v-card>
    <the-success-dialog :title="title" :subtitle="subtitle" />
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import TheSuccessDialog from '@/components/common/TheSuccessDialog'

export default {
  components: {
    TheSuccessDialog,
  },
  data() {
    return {
      dialog: false,
      selectedPackage: 'gcse',
      loading: false,
      title: 'Thank You',
      subtitle: 'You should receive your invoice within one day.',
    }
  },
  computed: {
    ...mapState({
      expires: (state) => state.user.subscriptionExpires,
      subscribed: (state) => state.user.subscribed,
    }),
  },
  methods: {
    request() {
      try {
        this.loading = true
        const url = new URL(
          '/.netlify/functions/sendEmailInvoice',
          this.$config.baseURL
        )
        fetch(url, {
          method: 'POST',
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.$store.state.user.id,
            username: this.$store.state.user.username,
            school: this.$store.state.user.school,
          }),
        })
        this.$nuxt.$emit('show-success')
      } catch (e) {
        console.log(e)
        this.$snack.showMessage({
          type: 'error',
          msg: 'Error sending request',
        })
      } finally {
        this.loading = false
        this.dialog = false
      }
    },
  },
}
</script>

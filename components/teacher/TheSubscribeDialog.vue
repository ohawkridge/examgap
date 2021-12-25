<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ on }">
      <v-btn color="primary" block rounded elevation="0" v-on="on">
        <span :class="$vuetify.theme.dark ? 'pb-text' : ''">
          {{ subscribed ? 'Renew Subscription' : 'Subscribe' }}
        </span>
      </v-btn>
    </template>
    <v-card class="rounded-xl">
      <v-card-title
        class="d-flex justify-center text-h5 secondary--text mb-1 pt-5"
      >
        <font-awesome-icon icon="fa-light fa-receipt" class="fa-sm" />
      </v-card-title>
      <p class="text-h5 text-center">Request Invoice</p>
      <v-card-text class="modal-text">
        <p>
          Request an email invoice you can pay online or forward to your bursar.
        </p>
        <v-checkbox v-model="selectedPackage" value="gcse" readonly>
          <template #label>
            <div>
              GCSE Computer Science—£84
              <span class="text-caption">(VAT included)</span>
            </div>
          </template>
        </v-checkbox>
        <div class="d-flex justify-end">
          <v-btn text rounded @click="dialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            rounded
            text
            class="ml-2"
            @click="request()"
          >
            Request
          </v-btn>
        </div>
      </v-card-text>
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
      } catch (err) {
        console.log(err)
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

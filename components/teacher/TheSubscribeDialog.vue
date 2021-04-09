<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        :color="expired ? 'accent' : 'primary'"
        elevation="0"
        block
        v-on="on"
      >
        Subscribe to Examgap
      </v-btn>
    </template>
    <v-card class="modal">
      <v-card-title class="d-flex justify-center"
        >Subscribe to Examgap</v-card-title
      >
      <v-card-text>
        <p>Request an email invoice you can forward to your finance office.</p>
        <v-radio-group v-model="choice" hide-details>
          <v-radio :value="1">
            <template #label>
              <p>
                <span class="text-overline">GCSE Computer Science</span><br />
                One year subscription—<strong>£89</strong> (VAT included)
              </p>
            </template>
          </v-radio>
          <!-- <v-radio label="Rad 2" :value="2">
            <template #label>
              <p>
                <span class="text-overline">GCSE Computer Science</span><br />
                Proprated until summer 2022—<strong>£{{ prorate }}</strong>
              </p>
            </template>
          </v-radio> -->
        </v-radio-group>
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
    <the-success-dialog
      title="Invoice requested"
      subtitle="You should receive your invoice within 24hrs."
    />
  </v-dialog>
</template>

<script>
import TheSuccessDialog from '@/components/common/TheSuccessDialog'

export default {
  components: { TheSuccessDialog },
  props: {
    expired: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      choice: 1,
      loading: false,
    }
  },
  computed: {
    prorate() {
      // N.B. Months are numbered from 0 !!
      return Math.round(
        Math.round(
          (new Date(2021, 7, 31) - new Date()) / (1000 * 60 * 60 * 24)
        ) *
          (89 / 365) +
          89
      )
    },
  },
  methods: {
    request() {
      console.log(`Sending request...`)
      this.loading = true
      try {
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

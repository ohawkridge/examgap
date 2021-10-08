<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="10" class="d-flex justify-space-between">
        <p class="text-h6">{{ group.name }} logins</p>
        <div>
          <v-btn elevation="0" text rounded nuxt :to="`/group/${group.id}`">
            Back
          </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            rounded
            class="ml-2"
            @click="print()"
          >
            <span class="heading--text">Print</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="usernames.length > 0" class="justify-center">
      <v-col cols="12" md="10">
        <v-alert border="top" icon="fa-circle-info" type="info" text>
          If you created accounts by entering student's email addresses, the
          password is '<b>password</b>'. Otherwise, students chose their own
          passwords when they signed up. You can reset student passwords on the
          <nuxt-link nuxt :to="`/group/${group.id}`">'STUDENTS'</nuxt-link>
          tab.
        </v-alert>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <template v-for="(user, i) in usernames">
        <v-col :key="i" cols="6" md="5" class="border">
          <p class="mb-1">https://examgap.com</p>
          <p class="mb-0">
            Username:
            <span class="font-weight-medium">{{ user.username }}</span>
          </p>
        </v-col>
        <v-col
          v-if="i % 13 === 0 && i > 0 && i < usernames.length - 1"
          :key="user.id"
          cols="12"
          md="10"
        >
          <div class="page-break"></div>
          <div></div>
        </v-col>
      </template>
      <p v-if="usernames.length === 0" class="text-center mt-3">
        No students yet. Go to the
        <nuxt-link :to="`/students/${group.id}`">Students</nuxt-link> screen and
        click Students, Add students&hellip;
      </p>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'print',
  async asyncData({ store, params, $config: { baseURL } }) {
    const url = new URL('/.netlify/functions/getStudents', baseURL)
    let usernames = await fetch(url, {
      body: JSON.stringify({
        secret: store.state.user.secret,
        groupId: params.logins,
        namesOnly: true,
      }),
      method: 'POST',
    })
    if (!usernames.ok) {
      throw new Error(`Error fetching logins ${usernames.status}`)
    }
    usernames = await usernames.json()
    return { usernames }
  },
  head() {
    return {
      title: `${this.group.name} logins`,
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
  },
  mounted() {
    window.print()
  },
  methods: {
    print() {
      window.print()
    },
  },
}
</script>

<style scoped>
.border {
  border: 1px dashed grey;
  height: 110px;
}
@media all {
  .page-break {
    display: none;
  }
}
@media print {
  .page-break {
    display: block;
    page-break-after: always;
  }
}
</style>

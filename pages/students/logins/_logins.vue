<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="12" md="10" class="d-flex justify-space-between">
        <p class="text-h6">{{ group.name }} logins</p>
        <div>
          <v-btn
            color="primary"
            outlined
            elevation="0"
            class="mr-2"
            @click="print()"
          >
            Print
          </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            outlined
            nuxt
            :to="`/students/${group.id}`"
          >
            Back
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <v-alert
          :icon="$icons.mdiInformationOutline"
          border="left"
          type="info"
          text
        >
          Note: '<b>pw</b>' is the default password for new accounts. Students
          may have changed their passwords. You can reset passwords on the
          '<nuxt-link
            nuxt
            :to="`/students/${group.id}`"
            title="Back to students"
            >Students</nuxt-link
          >' screen.
        </v-alert>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <template v-for="(user, i) in usernames">
        <v-col :key="i" cols="6" md="5" class="border">
          <p>Examgap.com</p>
          <p>
            Username:
            <span class="font-weight-medium">{{ user.username }}</span
            >&nbsp;&nbsp;Password:
            <span class="font-weight-medium">pw</span>
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
      <p v-if="usernames.length === 0" class="text-center">
        No students added yet. Go to the <b>'Students'</b> screen and click
        'Actions'
        <v-icon small>{{ $icons.mdiArrowRight }}</v-icon>
        'Add students'.
      </p>
    </v-row>
  </div>
</template>

<script>
import { mdiArrowRight, mdiInformationOutline } from '@mdi/js'

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
    group() {
      return this.$store.getters['groups/groupById'](this.$route.params.logins)
    },
  },
  created() {
    this.$icons = {
      mdiArrowRight,
      mdiInformationOutline,
    }
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

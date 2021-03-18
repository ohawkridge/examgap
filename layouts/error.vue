<template>
  <v-app>
    <v-main>
      <v-container>
        <p v-if="error.statusCode === 404" class="text-h6">
          {{ pageNotFound }}
        </p>
        <p v-else class="text-h6">
          {{ otherError }}
        </p>
        <p>
          Go back
          <NuxtLink :to="home()"> home </NuxtLink>
        </p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
  methods: {
    home() {
      if (this.$store.state.user.id === '') return '/'
      return this.$store.state.user.teacher ? '/classes' : '/home'
    },
  },
}
</script>

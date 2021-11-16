<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <div class="text-h5">Archive</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  name: 'Archive',
  layout: 'app',
  head() {
    return {
      title: 'Archive',
    }
  },
  computed: {
    // ...mapState({
    //   teacher: (state) => state.user.teacher,
    // }),
  },
  mounted() {
    this.$store.commit('app/setPageTitle', 'Archive')
  },
}
</script>

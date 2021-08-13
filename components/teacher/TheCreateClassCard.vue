<template>
  <v-col
    v-if="!$store.state.app.tab && activeGroupCount > 0"
    cols="12"
    md="6"
    lg="4"
  >
    <v-hover v-slot="{ hover }">
      <v-card
        :id="hover ? 'cc2' : 'cc1'"
        class="d-flex align-center justify-center"
        outlined
        hover
        height="172"
        @click="$nuxt.$emit('show-create')"
      >
        <v-btn text rounded :color="hover ? 'primary' : ''">
          <v-icon left>{{ $icons.mdiPlus }}</v-icon>
          Create class
        </v-btn>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiPlus } from '@mdi/js'

export default {
  computed: {
    ...mapGetters({
      activeGroupCount: 'user/activeGroupCount',
    }),
  },
  created() {
    this.$icons = {
      mdiPlus,
    }
  },
}
</script>

<style scoped>
#cc1 {
  border: 1px dashed darkgray !important;
}

#cc2 {
  border: 1px dashed #0099cc !important;
}
</style>

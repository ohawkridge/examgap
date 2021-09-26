<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between">
          <nuxt-link to="/">
            <the-logo />
          </nuxt-link>
          <div class="d-flex">
            <v-btn text rounded class="d-none d-sm-flex mr-2" nuxt to="/pricing"
              >Pricing</v-btn
            >
            <v-btn text rounded class="d-none d-sm-flex mr-2" nuxt to="/signup"
              >Join class</v-btn
            >
            <v-btn text rounded class="d-none d-sm-flex" nuxt to="/signin"
              >Sign in</v-btn
            >
            <v-btn
              v-if="!menu"
              icon
              class="d-flex d-sm-none"
              @click="menu = !menu"
            >
              <v-icon>{{ $icons.mdiMenu }}</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <nuxt />
    <the-static-footer />
    <v-overlay :value="menu" opacity="0.86" @click.native="menu = false">
      <v-btn
        v-if="menu"
        id="close"
        icon
        class="d-flex d-sm-none"
        @click="menu = false"
      >
        <v-icon>{{ $icons.mdiClose }}</v-icon>
      </v-btn>
      <div class="d-flex flex-column">
        <v-btn text large rounded class="mb-6" nuxt to="/pricing"
          >Pricing</v-btn
        >
        <v-btn text large rounded class="mb-6" nuxt to="/signup"
          >Join class</v-btn
        >
        <v-btn outlined large rounded class="mb-6" nuxt to="/signin"
          >Sign in</v-btn
        >
        <v-btn large rounded color="primary" elevation="0" nuxt to="/trial"
          >Free trial</v-btn
        >
      </div>
    </v-overlay>
  </v-app>
</template>

<script>
import TheLogo from '@/components/common/TheLogo'
import TheStaticFooter from '@/components/common/TheStaticFooter'
import { mdiMenu, mdiClose } from '@mdi/js'

export default {
  name: 'Static',
  components: {
    TheLogo,
    TheStaticFooter,
  },
  data() {
    return {
      menu: false,
    }
  },
  watch: {
    $route() {
      this.menu = false
    },
  },
  created() {
    this.$icons = {
      mdiMenu,
      mdiClose,
    }
  },
}
</script>

<style scoped>
#close {
  position: fixed;
  top: 12px;
  right: 12px;
}
</style>

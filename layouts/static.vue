<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between">
          <div class="d-flex">
            <nuxt-link to="/">
              <the-logo />
            </nuxt-link>
            <v-btn text class="ml-8 d-none d-sm-flex" nuxt to="/pricing" rounded
              >Pricing</v-btn
            >
          </div>
          <div class="d-flex">
            <v-btn nuxt to="/signin" rounded text>
              Your Account
              <v-icon>{{ $icons.mdiArrowRight }}</v-icon>
            </v-btn>
            <!-- <v-btn text class="mr-2 d-none d-sm-flex" nuxt to="/signup"
              >Join class</v-btn
            >
            <v-btn outlined class="mr-2 d-none d-sm-flex" nuxt to="/signin"
              >Sign in</v-btn
            >
            <v-btn
              color="primary"
              elevation="0"
              class="d-none d-sm-flex"
              nuxt
              to="/trial"
              >Free trial</v-btn
            >
            <v-btn
              v-if="!menu"
              outlined
              class="d-flex d-sm-none"
              @click="menu = !menu"
            >
              <v-icon left>{{ $icons.mdiMenu }}</v-icon>
              Menu
            </v-btn> -->
          </div>
        </v-col>
      </v-row>
    </v-container>
    <nuxt />
    <TheStaticFooter />
    <v-overlay :value="menu" opacity="0.86" @click.native="menu = false">
      <v-btn
        v-if="menu"
        id="close"
        outlined
        class="d-flex d-sm-none"
        @click="menu = false"
      >
        <v-icon left>{{ $icons.mdiClose }}</v-icon>
        Close
      </v-btn>
      <div class="d-flex flex-column">
        <v-btn text large class="mb-6" nuxt to="/">Home</v-btn>
        <v-btn text large class="mb-6" nuxt to="/pricing">Pricing</v-btn>
        <v-btn text large class="mb-6" nuxt to="/#how">How it works</v-btn>
        <v-btn text large class="mb-6" nuxt to="/signup">Join class</v-btn>
        <v-btn outlined large class="mb-6" nuxt to="/signin">Sign in</v-btn>
        <v-btn large color="primary" elevation="0" nuxt to="/trial"
          >Free trial</v-btn
        >
      </div>
    </v-overlay>
  </v-app>
</template>

<script>
import TheLogo from '@/components/common/TheLogo'
import TheStaticFooter from '@/components/common/TheStaticFooter'
import { mdiMenu, mdiClose, mdiArrowRight } from '@mdi/js'

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
      mdiArrowRight,
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

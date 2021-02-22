<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12" md="6" class="d-flex justify-center justify-md-start">
          <nuxt-link to="/">
            <Logo />
          </nuxt-link>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center justify-md-end">
          <v-btn text class="mr-2" nuxt to="/pricing"
            ><span>Pricing</span></v-btn
          >
          <v-btn text nuxt to="/signin"><span>Sign in</span></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <nuxt />
    <!-- <EgFooter /> -->
  </v-app>
</template>

<script>
import Logo from '@/components/common/Logo'
// import EgFooter from "@/components/EgFooter";

export default {
  components: {
    Logo,
    // EgFooter,
  },
}
</script>

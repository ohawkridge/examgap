<template>
  <v-card>
    <template v-if="$fetchState.pending">
      <v-skeleton-loader
        :loading="true"
        class="pa-4"
        type="heading"
        width="200%"
      ></v-skeleton-loader>
      <v-skeleton-loader
        :loading="true"
        class="px-4 mt-4"
        type="text"
        width="40%"
      ></v-skeleton-loader>
      <v-skeleton-loader
        :loading="true"
        class="px-4 mt-4"
        type="paragraph"
      ></v-skeleton-loader>
    </template>
    <v-card-title v-else>
      <v-menu offset-x open-on-hover>
        <template #activator="{ on }">
          <v-hover v-slot="{ hover }">
            <v-icon
              class="mr-2"
              :color="hover ? 'primary' : 'grey'"
              v-on="on"
              >{{ $icons.mdiEarth }}</v-icon
            >
          </v-hover>
        </template>
        <v-card max-width="250">
          <v-card-text class="text-body-1">
            <span class="font-weight-medium">{{ greeting.text }}</span>
            is how you say 'Hello' in
            <span class="font-weight-medium">{{ greeting.country }}.</span>
          </v-card-text>
        </v-card> </v-menu
      >{{ greeting.text }}, {{ shortName }}
    </v-card-title>
    <v-card-text class="text-body-2">
      <p class="text-subtitle-1">Quote of the day</p>
      {{ quote }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { mdiEarth } from '@mdi/js'

export default {
  name: 'TheQuoteOfTheDay',
  async fetch() {
    await this.$store.dispatch('user/getQuote')
  },
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      quote: (state) => state.user.quote,
    }),
    greeting() {
      const greetings = [
        { country: 'Arabic', text: 'Asalaam alaikum' },
        { country: 'Bengali', text: 'Namaskar' },
        { country: 'Bulgarian', text: 'Zdraveĭte' },
        { country: 'Catalan', text: 'Hola' },
        { country: 'Chinese', text: 'Nǐ hǎo' },
        { country: 'Dutch', text: 'Goede dag' },
        { country: 'English', text: 'Hi' },
        { country: 'French', text: 'Bonjour' },
        { country: 'German', text: 'Guten tag' },
        { country: 'Greek', text: 'Kalimera' },
        { country: 'Hebrew', text: 'Shalom aleichem' },
        { country: 'Hindi', text: 'Namastē' },
        { country: 'Hungarian', text: 'Jo napot' },
        { country: 'Indonesian', text: 'Selamat siang' },
        { country: 'Italian', text: 'Salve' },
        { country: 'Japanese', text: 'Konnichiwa' },
        { country: 'Korean', text: 'Anyoung haseyo' },
        { country: 'Lithuanian', text: 'Sveiki' },
        { country: 'Norwegian', text: 'God dag' },
        { country: 'Polish', text: 'Dzień dobry' },
        { country: 'Portuguese', text: 'Olá' },
        { country: 'Romainian', text: 'Bună ziua' },
        { country: 'Russian', text: 'Zdravstvuyte' },
        { country: 'Serbian', text: 'Zdravo' },
        { country: 'Spanish', text: 'Hola' },
        { country: 'Swahili', text: 'Shikamoo' },
        { country: 'Swedish', text: 'God dag' },
        { country: 'Thai', text: 'Sawasdee' },
        { country: 'Tahitian', text: 'Ia ora na' },
        { country: 'Turkish', text: 'Merhaba' },
        { country: 'Ukrainian', text: 'Zdravstvuyte' },
        { country: 'Vietnamese', text: 'Xin chào' },
        { country: 'Welsh', text: 'Shwmae' },
        { country: 'Zulu', text: 'Ngiyakwemukela' },
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    },
    shortName() {
      return this.username.includes('@')
        ? this.username.substring(0, this.username.indexOf('@'))
        : this.username
    },
  },
  created() {
    this.$icons = {
      mdiEarth,
    }
  },
}
</script>

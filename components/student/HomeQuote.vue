<template>
  <v-card>
    <v-card-title>
      <v-menu offset-x open-on-hover>
        <template #activator="{ on, attrs }">
          <v-hover v-slot="{ hover }">
            <v-icon
              class="mr-2"
              :color="hover ? 'primary' : 'grey'"
              v-bind="attrs"
              v-on="on"
              >{{ $icons.mdiEarth }}</v-icon
            >
          </v-hover>
        </template>
        <v-card max-width="240">
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
  name: 'Quote',
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      quote: (state) => state.user.quote,
    }),
    greeting() {
      const greetings = [
        { country: 'Arabic', text: 'Asalaam alaikum' },
        { country: 'Bulgarian', text: 'Zdraveĭte' },
        { country: 'Chinese', text: 'Nǐ hǎo' },
        { country: 'Dutch', text: 'Goede dag' },
        { country: 'English', text: 'Hi' },
        { country: 'French', text: 'Bonjour' },
        { country: 'German', text: 'Guten tag' },
        { country: 'Greek', text: 'Kalimera' },
        { country: 'Hebrew', text: 'Shalom aleichem' },
        { country: 'Hindi', text: 'Namastē' },
        { country: 'Indonesian', text: 'Selamat siang' },
        { country: 'Italian', text: 'Salve' },
        { country: 'Japanese', text: 'Konnichiwa' },
        { country: 'Korean', text: 'Anyoung haseyo' },
        { country: 'Polish', text: 'Dzień dobry' },
        { country: 'Portuguese', text: 'Olá' },
        { country: 'Romainian', text: 'Bună ziua' },
        { country: 'Russian', text: 'Zdravstvuyte' },
        { country: 'Spanish', text: 'Hola' },
        { country: 'Swahili', text: 'Habari' },
        { country: 'Swedish', text: 'God dag' },
        { country: 'Tahitian', text: 'Ia ora na' },
        { country: 'Turkish', text: 'Merhaba' },
        { country: 'Vietnamese', text: 'Xin chào' },
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

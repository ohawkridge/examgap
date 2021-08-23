<template>
  <div class="mt-4 ml-2">
    <v-menu v-if="!teacher" offset-x open-on-hover>
      <template #activator="{ on }">
        <v-hover v-slot="{ hover }">
          <span :class="hover ? 'primary--text' : ''" v-on="on">
            {{ greeting.text }},</span
          >
          <nuxt-link
            to="/profile"
            class="grey--text text--darken-2 text-subtitle-2"
            >{{ shortName }}</nuxt-link
          >
        </v-hover>
      </template>
      <v-card max-width="250">
        <v-card-text>
          {{ greeting.text }} is how you say 'Hello' in
          <span class="font-weight-medium">{{ greeting.country }}.</span>
        </v-card-text>
      </v-card>
    </v-menu>
    <template v-else>
      <nuxt-link
        to="/profile"
        class="grey--text text--darken-2 text-subtitle-2"
        >{{ shortName }}</nuxt-link
      >
    </template>
    <div>
      <v-chip x-small label>
        {{ teacher ? 'Teacher' : 'Student' }}
      </v-chip>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TheGreeting',
  computed: {
    ...mapState({
      teacher: (state) => state.user.teacher,
      username: (state) => state.user.username,
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
}
</script>

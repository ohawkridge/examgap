<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-btn color="primary" nuxt to="/home" outlined>
          <v-icon left>{{ $icons.mdiArrowLeft }}</v-icon>
          Home
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12">
        <!-- <v-skeleton-loader :loading="$fetchState.pending" type="card"> -->
        <v-card>
          <v-card-title class="text-h5 font-weight-bold">
            {{ assignment.name }}
          </v-card-title>
          <v-card-subtitle>
            <v-icon class="pb-1">{{ $icons.mdiCalendarRangeOutline }}</v-icon>
            {{ assignment.start | date }}
            <v-icon class="pb-1" small>{{ $icons.mdiArrowRight }}</v-icon>
            {{ assignment.dateDue | date }}
          </v-card-subtitle>
          <v-card-text class="mt-6">
            <p
              v-if="!$fetchState.pending && assignment.questions"
              class="text-body-1 font-weight-medium mb-0"
            >
              Question{{ assignment.questions.length | pluralize }} ({{
                assignment.questions.length
              }})
            </p>
            <!-- <v-skeleton-loader
                :loading="$fetchState.pending"
                type="list"
                :types="{ list: 'list-item-two-line@3' }"
              > -->
            <!-- <v-list>
                  <EgListItemQuestion
                    v-for="(question, i) in assignment.questions"
                    :key="i"
                    :question="question"
                    :assignment-id="$route.params.assignment"
                  />
                </v-list> -->
            <!-- </v-skeleton-loader> -->
          </v-card-text>
        </v-card>
        <!-- </v-skeleton-loader> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import EgListItemQuestion from '@/components/EgListItemQuestion'
import { mdiCalendarRangeOutline, mdiArrowRight, mdiArrowLeft } from '@mdi/js'

export default {
  components: {
    // EgListItemQuestion,
  },
  layout: 'app',
  async asyncData({ store }) {
    console.log(`asyncData fired (server-side?)...`)
    try {
      const response = await fetch('/.netlify/functions/getAssignment', {
        body: JSON.stringify({
          secret: store.state.user.secret,
        }),
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`Error fetching assignment ${response.status}`)
      }
      const assignment = await response.json()
      console.log(`asyncData got`, assignment)
      console.log(assignment)
      return assignment
    } catch (e) {
      console.error(e)
    }
  },
  created() {
    this.$icons = {
      mdiCalendarRangeOutline,
      mdiArrowRight,
      mdiArrowLeft,
    }
  },
}
</script>

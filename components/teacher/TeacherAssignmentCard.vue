<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="mb-4"
      :class="hover ? 'ass-card2' : 'ass-card'"
      hover
      @click="nav()"
    >
      <v-card-title class="d-flex justify-space-between">
        {{ assignment.name }}
        <v-menu offset-y>
          <template #activator="{ on }">
            <v-btn icon @click.stop="">
              <font-awesome-icon
                icon="fa-light fa-ellipsis-vertical"
                class="ico-btn"
                v-on="on"
              />
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              @click="
                $nuxt.$emit('show-delete', assignment.id, assignment.group.id)
              "
            >
              <v-list-item-title class="red--text"> Delete </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-subtitle>
        {{ assignment.numQuestions }} Question{{
          assignment.numQuestions | pluralize
        }}
        → {{ assignment.group.name }}
      </v-card-subtitle>
      <v-card-text>
        <div>
          <span class="align-date font-weight-bold">Start:</span
          >{{ assignment.start | date }}
        </div>
        <v-chip label outlined small class="float-right">
          {{ assignment.numStudents }} Student{{
            assignment.numStudents | pluralize
          }}
        </v-chip>
        <div>
          <span class="align-date font-weight-bold">Due:</span
          >{{ assignment.dateDue | date }}
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    assignment: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  methods: {
    nav() {
      this.$store.commit('user/setActiveGroupId', this.assignment.group.id)
      this.$router.push(`/report/${this.assignment.id}`)
    },
  },
}
</script>

<style scoped>
.align-date {
  display: inline-block;
  width: 56px;
}
@media only screen and (max-width: 600px) {
  .align-date {
    display: inline-block;
    width: 60px;
  }
}

/* Does not work external */
.ico-btn {
  height: 24px;
  width: 24px;
}

.ass-card {
  border-left: 2px solid #b3b3b3;
}

.ass-card2 {
  border-left: 3px solid #0099cc;
}
</style>

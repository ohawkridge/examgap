<template>
  <v-card class="mb-4 ass-card" hover @click="nav()">
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
          <v-list-item @click="dialog = true">
            <v-list-item-title class="red--text"> Delete </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle>
      {{ assignment.group.name }}
    </v-card-subtitle>
    <v-card-text class="text-body-1">
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
    <!-- Delete dialog xx -->
    <v-dialog v-model="dialog" max-width="440">
      <v-card>
        <v-card-title class="d-flex justify-center">
          Delete assignment?
        </v-card-title>
        <v-card-text>
          <!-- TODO Does not work -->
          <v-form @submit.prevent="deleteAssignment()">
            <p>
              This assignment and all the responses that go with it will be
              deleted. This action <em>cannot</em> be undone.
            </p>
            <div class="d-flex justify-end">
              <v-btn text rounded @click="dialog = false">Cancel</v-btn>
              <v-btn
                color="error"
                elevation="0"
                rounded
                :loading="loading"
                :disabled="loading"
                class="ml-2"
                type="submit"
              >
                Delete Assignment</v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
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
    async deleteAssignment() {
      try {
        this.loading = true
        console.log('Deleting', this.assignment.id)
        await this.$store.dispatch('user/deleteAssignment', this.assignment.id)
        // If on _report.vue, go back to _group.vue
        // Otherwise, stay put
        if (this.$route.name !== 'report-report') {
          this.$router.push(`/group/${this.assignment.group.id}`)
        }
        this.$snack.showMessage({
          type: 'success',
          msg: 'Assignment deleted',
        })
      } catch (err) {
        console.warn(err)
        this.$snack.showMessage({
          msg: 'Error deleting assignment',
          type: 'error',
        })
      } finally {
        this.dialog = false
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.align-date {
  display: inline-block;
  width: 72px;
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
  border-left: 3px solid #0099cc;
}
</style>

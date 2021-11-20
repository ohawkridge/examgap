<template>
  <v-card outlined class="mb-4" hover @click="nav()">
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
          <!-- TODO -->
          <!-- <v-list-item class="px-0">
            <v-list-item-title>
              Edit
            </v-list-item-title>
          </v-list-item> -->
          <v-list-item class="px-0">
            <v-list-item-title>
              <the-delete-assignment-dialog :assignment-id="assignment.id" />
            </v-list-item-title>
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
  </v-card>
</template>

<script>
import TheDeleteAssignmentDialog from './TheDeleteAssignmentDialog.vue'

export default {
  components: {
    TheDeleteAssignmentDialog,
  },
  props: {
    assignment: {
      type: Object,
      default: () => {},
    },
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
  width: 72px;
}

/* Does not work external */
.ico-btn {
  height: 24px;
  width: 24px;
}
</style>

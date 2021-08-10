<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="students"
    checkbox-color="primary"
    item-key="id"
    hide-default-footer
    show-select
    disable-pagination
    :loading="$fetchState.pending"
    loading-text="Loading students..."
  >
    <template #no-data>
      <div class="mt-4">
        <v-img
          max-width="200"
          contain
          src="/no-student.svg"
          alt="Graduation gap illustration"
          class="mx-auto"
        />
        <p class="text-body-2 mt-4" style="color: #000000de">No students yet</p>
        <v-btn
          color="primary"
          elevation="0"
          @click="$nuxt.$emit('open-invite')"
        >
          Invite students
        </v-btn>
      </div>
    </template>
    <template #[`item.target`]="props">
      <v-edit-dialog>
        <!-- groupId is the key into target object -->
        <!-- Different targets for each group -->
        {{ props.item.target[`${group.id}`] }}
        <template #input>
          <v-text-field
            :value="props.item.target[`${group.id}`]"
            :rules="targetRules"
            placeholder="E.g., 7"
            :loading="loading"
            label="Set target"
            @keyup.enter="save(props.item.id, $event.target.value)"
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>
  </v-data-table>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      selected: [],
      targetRules: [(v) => v.length === 1 || 'Max. one character'],
      headers: [
        {
          text: 'Username',
          align: 'start',
          value: 'username',
        },
        {
          text: 'Assignment Questions',
          align: 'center',
          value: 'data.assignment',
        },
        { text: 'Revision Questions', align: 'center', value: 'data.revision' },
        {
          text: 'Average (%)',
          align: 'center',
          value: 'data.average',
        },
        {
          text: 'Target',
          align: 'center',
          value: 'target',
        },
      ],
      csv: '',
      loading: false,
    }
  },
  async fetch() {
    try {
      await this.$store.dispatch('students/getStudents')
    } catch (err) {
      console.error(err)
      this.$snack.showMessage({
        type: 'error',
        msg: 'Error fetching students',
      })
    }
  },
  computed: {
    ...mapGetters({ group: 'user/activeGroup' }),
    ...mapState({
      students: (state) => state.students.students,
    }),
  },
}
</script>

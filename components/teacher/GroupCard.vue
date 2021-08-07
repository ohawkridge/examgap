<template>
  <v-col cols="12" md="6" lg="4">
    <v-hover v-slot="{ hover }">
      <v-card hover rounded="lg" @click="open()">
        <v-card-title :class="hover ? 'primary--text' : ''">
          {{ group.name }}
        </v-card-title>
        <v-card-subtitle>
          {{ group.course.name }} ({{ group.course.board }})
        </v-card-subtitle>
        <v-card-text class="d-flex align-end fix-height">
          <v-chip label color="primary" outlined small>
            {{ group.count }} student{{ group.count | pluralize }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
export default {
  name: 'GroupCard',
  props: {
    group: {
      type: Object,
      required: true,
    },
    groupIndex: {
      type: Number,
      required: true,
    },
  },
  methods: {
    open() {
      this.$store.commit('students/clearStudents')
      // Remember active group
      this.$store.commit('user/setActiveGroupIndex', this.groupIndex)
      this.$router.push(`/group/${this.group.id}`)
    },
  },
}
</script>

<style scoped>
.fix-height {
  min-height: 80px;
}
</style>

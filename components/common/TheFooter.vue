<template>
  <v-footer color="transparent" app inset absolute>
    <v-container>
      <v-row class="text-caption grey--text text--darken-2">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          support@examgap.com
          <div class="d-flex align-center">
            <font-awesome-icon
              icon="fa-light fa-arrows-left-right"
              class="mr-1"
            />
            {{ $vuetify.breakpoint.name }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'TheFooter',
}
</script>

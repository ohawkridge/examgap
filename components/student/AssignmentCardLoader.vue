<template>
  <v-sheet
    elevation="0"
    class="rounded-lg pa-4 mb-6"
    style="border: 1px solid rgb(220, 221, 224)"
  >
    <v-skeleton-loader :loading="true" type="heading"></v-skeleton-loader>
    <v-skeleton-loader
      :loading="true"
      type="text"
      width="20%"
      class="mt-3"
    ></v-skeleton-loader>
    <v-skeleton-loader
      :loading="true"
      type="text"
      width="34%"
      class="mt-5"
    ></v-skeleton-loader>
    <v-skeleton-loader
      :loading="true"
      type="chip"
      class="float-right chip-fix"
    ></v-skeleton-loader>
    <v-skeleton-loader
      :loading="true"
      type="text"
      width="34%"
      class="mt-1"
    ></v-skeleton-loader>
  </v-sheet>
</template>

<style scoped></style>

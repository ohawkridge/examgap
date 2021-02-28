<template>
  <v-dialog v-model="dialog" width="480">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" outlined v-bind="attrs" v-on="on">
        Boundaries
      </v-btn>
    </template>
    <v-card class="modal">
      <v-card-title class="text-h6 d-flex justify-center">
        Boundaries
      </v-card-title>
      <v-card-text>
        <p>
          By default, the grade book uses these boundaries for colour-coding:
        </p>
        <v-simple-table dense>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Colour</th>
                <th class="text-left">Boundaries (%)</th>
                <th class="text-left">Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Secure</td>
                <td>{{ Math.round((boundaries.rag[1] + 0.01) * 100) }}-100</td>
                <td>{{ boundaries.rag[4] }}</td>
              </tr>
              <tr>
                <td>Middle</td>
                <td>
                  {{ Math.round((boundaries.rag[0] + 0.01) * 100) }}-{{
                    boundaries.rag[1] * 100
                  }}
                </td>
                <td>{{ boundaries.rag[3] }}</td>
              </tr>
              <tr>
                <td>Vulnerable</td>
                <td>0-{{ Math.round(boundaries.rag[0] * 100) }}</td>
                <td>{{ boundaries.rag[2] }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <p class="mt-4">
          If you have entered target grades on the
          <NuxtLink :to="`/students/${groupId}`">Students</NuxtLink>
          screen, colour-coding will be against these using the
          <a
            href="https://docs.google.com/spreadsheets/d/1j7XvDI6jhrPDRDhjh6rRL8z2K3duh2Lg2JTaIU6cuLI/edit?usp=sharing"
            target="_blank"
            >highest boundaries across exam series</a
          ><v-icon small>{{ $icons.mdiOpenInNew }}</v-icon
          >.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" elevation="0" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiOpenInNew } from "@mdi/js";
export default {
  name: "EgBoundariesModal",
  props: {
    boundaries: {
      type: Object,
      default: () => {},
    },
    groupId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  created() {
    this.$icons = {
      mdiOpenInNew,
    };
  },
};
</script>

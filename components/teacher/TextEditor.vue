<template>
  <ClientOnly>
    <TiptapVuetify
      v-model="content"
      :card-props="{ flat: true }"
      :extensions="extensions"
    />
    <template #placeholder> Loading... </template>
  </ClientOnly>
</template>

<script>
// import the component and the necessary extensions
import {
  TiptapVuetify,
  Bold,
  Italic,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  History,
} from "tiptap-vuetify";
export default {
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify },
  props: {
    initial: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      extensions: [
        Bold,
        Underline,
        Italic,
        Paragraph,
        Code,
        Blockquote,
        ListItem,
        BulletList,
        OrderedList,
        History,
      ],
      content: this.initial,
    };
  },
  // Initial value comes only *after* parent fetch completes
  // Watch for this so when prop changes content is updated
  watch: {
    initial() {
      this.content = this.initial;
    },
  },
};
</script>

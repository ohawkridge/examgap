import Vue from "vue";

Vue.filter("pluralize", function (count) {
  return count == 1 ? "" : "s";
});

Vue.filter("date", function (dateStr) {
  // Old assignments don't have a start date
  if (dateStr === "N/A") {
    return dateStr;
  }
  if (!dateStr) {
    return "-";
  }
  return dateStr.substring(0, 10);
});

Vue.filter("strip", function (html) {
  return html.replace(/<[^>]*>?/gm, "");
});

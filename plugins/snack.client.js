export default ({ store }, inject) => {
  // Injects $snack across our components
  inject("snack", {
    showMessage({ msg = "", type = "" }) {
      store.commit("snackbar/showSnack", { msg, type });
    },
  });
};

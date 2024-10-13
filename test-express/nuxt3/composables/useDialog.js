export default (options = {}) => {
  return reactive({
    visible: false,
    ...options,
    toggle() {
      return this.visible ? this.hide() : this.show();
    },
    show() {
      this.visible = true;
      return this;
    },
    hide() {
      this.visible = false;
      return this;
    },

    data: null,
    setData(data) {
      this.data = data;
      return this;
    },
  });
};

export default (options = {}) => {
  options = {
    onToggle: ({ visible }) => null,
    onShow: () => null,
    onHide: () => null,
    ...options,
  };

  return reactive({
    visible: false,
    ...options,
    toggle() {
      this.onToggle({ visible: this.visible });
      return this.visible ? this.hide() : this.show();
    },
    show() {
      this.onShow();
      this.visible = true;
      return this;
    },
    hide() {
      this.onHide();
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

const { ref, reactive, computed, onMounted } = Vue;

const appLayout = {
  props: {
    drawerWidth: { type: String, default: "250px" },
    actions: { type: Function, default: () => [] },
  },
  setup(props, ctx) {
    const view = reactive({
      ready: false,
      isMobile: false,
      init() {
        view.isMobile = window.innerWidth < 768;
        drawer.init();
        header.init();
        content.init();
        footer.init();
        actions.init();
        snackbar.init();
        view.ready = true;
      },
    });

    const drawerRef = ref(null);
    const drawer = reactive({
      ref: null,
      width: null,
      height: null,
      open: false,
      toggle(value = null) {
        drawer.ref = drawerRef.value;
        drawer.open = value === null ? !drawer.open : value;
      },
      init() {
        drawer.width = drawerRef.value.offsetWidth + "px";
        drawer.height = drawerRef.value.offsetHeight + "px";
      },
    });

    const headerRef = ref(null);
    const header = reactive({
      ref: null,
      width: null,
      height: null,
      init() {
        header.ref = headerRef.value;
        header.width = headerRef.value.offsetWidth + "px";
        header.height = headerRef.value.offsetHeight + "px";
      },
    });

    const contentRef = ref(null);
    const content = reactive({
      ref: null,
      width: null,
      height: null,
      init() {
        content.ref = contentRef.value;
        content.width = contentRef.value.offsetWidth + "px";
        content.height = contentRef.value.offsetHeight + "px";
      },
    });

    const footerRef = ref(null);
    const footer = reactive({
      ref: null,
      width: null,
      height: null,
      init() {
        footer.ref = footerRef.value;
        footer.width = footerRef.value.offsetWidth + "px";
        footer.height = footerRef.value.offsetHeight + "px";
      },
    });

    const actionsRef = ref(null);
    const actions = reactive({
      ref: null,
      width: null,
      height: null,
      items: computed(() => {
        const items = [];
        props.actions(scope()).map((item) => {
          items.push(item);
        });

        if (view.isMobile) {
          items.push({
            text: "Drawer",
            icon: "system-uicons:menu-hamburger",
            onClick: () => {
              drawer.toggle();
            },
          });
        }
        return items;
      }),
      init() {
        actions.ref = actionsRef.value;
        actions.width = actionsRef.value.offsetWidth + "px";
        actions.height = actionsRef.value.offsetHeight + "px";
      },
    });

    const snackbar = reactive({
      items: [],
      add(params = {}) {
        snackbar.items.push({ actions: () => [], ...params });
      },
      remove(snack) {
        const index = snackbar.items.indexOf(snack);
        snackbar.items.splice(index, 1);
      },
      actions(item) {
        const actions = item.actions(scope({ item }));
        actions.push({
          text: "Ok",
          onClick: () => {
            snackbar.remove(item);
          },
        });
        return actions;
      },
      init() {},
    });

    const scope = (merge = {}) => {
      return {
        view,
        drawer,
        header,
        content,
        footer,
        actions,
        snackbar,
        ...merge,
      };
    };

    onMounted(() => {
      setTimeout(() => {
        view.init();

        window.addEventListener("resize", () => {
          view.init();
        });
      }, 10);
    });

    return {
      props,
      view,
      drawer,
      drawerRef,
      header,
      headerRef,
      content,
      contentRef,
      footer,
      footerRef,
      actions,
      actionsRef,
      snackbar,
      scope,
    };
  },
  template: `<div>
    <div class="flex">
      <div
        ref="drawerRef"
        class="fixed md:static bg-white drop-shadow-md flex flex-column gap-1"
        :style="{
          transition: 'all 300ms ease',
          height: '100vh',
          minWidth: props.drawerWidth,
          maxWidth: props.drawerWidth,
          left: drawer.open ? '0' : '-'+props.drawerWidth,
          zIndex: 2,
        }"
      >
        <a
          href="javascript:;"
          class="md:hidden bg-white pa-3"
          :style="{
            position: 'absolute',
            top: '10px',
            right: '-50px',
            borderRadius: '50%',
          }"
          @click="drawer.toggle()"
        >
          <img v-if="drawer.open" src="https://api.iconify.design/material-symbols:close-small-rounded.svg" />
          <img v-if="!drawer.open" src="https://api.iconify.design/system-uicons:menu-hamburger.svg" />
        </a>

        <div class="h-full overflow-auto">
          <slot name="drawer" v-bind="scope()"></slot>
        </div>
      </div>

      <div class="grow flex flex-column" style="height:100vh;">
        <div ref="headerRef" class="flex align-center gap-3">
          <slot name="header" v-bind="scope()"></slot>
        </div>

        <div ref="contentRef" class="grow overflow-auto">
          <slot name="default" v-bind="scope()"></slot>
        </div>

        <div ref="footerRef">
          <slot name="footer" v-bind="scope()"></slot>
        </div>

        <div ref="actionsRef" class="flex items-center justify-center gap-2">
          <template v-for="o in actions.items">
            <v-btn v-bind="o" stacked rounded="0" size="60"></v-btn>
          </template>
        </div>

        <template v-for="o in snackbar.items">
          <v-snackbar :model-value="true" :timeout="-1" v-bind="{ ...o, actions: undefined }">
            <template #actions>
              <template v-for="oo in snackbar.actions(o)">
                <v-btn v-bind="oo"></v-btn>
              </template>
            </template>
          </v-snackbar>
        </template>
      </div>
    </div>

    <div
      :style="{
        transition: 'all 300ms ease',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: '#000000',
        zIndex: (drawer.open && view.isMobile) ? 1 : -1,
        opacity: (drawer.open && view.isMobile) ? .5 : 0,
      }"
      @click="drawer.toggle(false)"
    ></div>
  </div>`,
};

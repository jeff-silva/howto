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
        view.ready = true;
      },
    });

    const drawerRef = ref(null);
    const drawer = reactive({
      width: null,
      height: null,
      open: false,
      toggle(value = null) {
        drawer.open = value === null ? !drawer.open : value;
      },
      init() {
        drawer.width = drawerRef.value.offsetWidth + "px";
        drawer.height = drawerRef.value.offsetHeight + "px";
      },
    });

    const headerRef = ref(null);
    const header = reactive({
      width: null,
      height: null,
      init() {
        header.width = headerRef.value.offsetWidth + "px";
        header.height = headerRef.value.offsetHeight + "px";
      },
    });

    const contentRef = ref(null);
    const content = reactive({
      width: null,
      height: null,
      init() {
        content.width = contentRef.value.offsetWidth + "px";
        content.height = contentRef.value.offsetHeight + "px";
      },
    });

    const footerRef = ref(null);
    const footer = reactive({
      width: null,
      height: null,
      init() {
        footer.width = footerRef.value.offsetWidth + "px";
        footer.height = footerRef.value.offsetHeight + "px";
      },
    });

    const actionsRef = ref(null);
    const actions = reactive({
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
            icon: {
              src: "https://api.iconify.design/system-uicons:menu-hamburger.svg",
            },
            onClick: () => {
              drawer.toggle();
            },
          });
        }
        return items;
      }),
      init() {
        actions.width = actionsRef.value.offsetWidth + "px";
        actions.height = actionsRef.value.offsetHeight + "px";
      },
    });

    const scope = (merge = {}) => {
      return { view, drawer, header, content, footer, actions, ...merge };
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
      view,
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
            <button class="px-3 shadow-xl" style="height:50px;" v-bind="o">
              <img v-if="o.icon" v-bind="o.icon" />
              <span v-else>{{ o.text }}</span>
            </button>
          </template>
        </div>
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

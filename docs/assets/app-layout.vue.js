const { ref, reactive, computed, onMounted } = Vue;

const appLayout = {
  props: {
    drawerWidth: { type: String, default: "250px" },
    actions: { type: Function, default: () => [] },
  },
  setup(props, ctx) {
    const uid = (prefix) => prefix + Math.random().toString(36).substr(2, 9);

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
      items: [],
      if(item) {
        if (typeof item.if == "function") {
          return item.if();
        }
        return true;
      },
      init() {
        actions.ref = actionsRef.value;
        actions.width = actionsRef.value.offsetWidth + "px";
        actions.height = actionsRef.value.offsetHeight + "px";

        actions.items = props.actions(scope());

        if (actions.items.filter((o) => o.dataId === "drawer").length == 0) {
          actions.items.push({
            dataId: "drawer",
            text: "Drawer",
            icon: "system-uicons:menu-hamburger",
            onClick: () => {
              drawer.toggle();
            },
            if() {
              return view.isMobile;
            },
          });
        }

        actions.items.map((item) => {
          if (typeof item.actions != "function") {
            item.actions = (scope) => [];
          }
        });
      },
    });

    const snackbar = reactive({
      items: [],
      add(params = {}) {
        snackbar.items.push({ actions: (scope) => [], ...params });
        snackbar.init();
      },
      remove(item) {
        const items = snackbar.items;
        console.log(JSON.stringify({ item, items, snackbar }, null, 2));
        // const index = snackbar.items.findIndex((o) => o.dataId === item.dataId);
        // console.log({ index, item });
        // const index = snackbar.items.indexOf(snack);
        // snackbar.items.splice(index, 1);
        // snackbar.init();
      },
      if(item) {
        if (typeof item.if == "function") {
          return item.if();
        }
        if (typeof item.if == "boolean") {
          return item.if;
        }
        return true;
      },
      init() {
        snackbar.items.map((item) => {
          item.dataId = item.dataId || uid("item-");

          if (typeof item.actions != "function") {
            item.actions = (scope) => [];
          }
        });
      },
    });

    const dialog = reactive({
      items: [],
      create(params = {}) {
        dialog.items.push({
          title: "",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum nobis omnis, incidunt ad voluptates eos! Esse, quos veritatis neque doloribus necessitatibus perferendis vero! Deserunt suscipit est animi nobis maxime atque!",
          actions: [],
          ...params,
        });
      },
      close() {
        dialog.items.splice(0, 1);
      },
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
        dialog,
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
      dialog,
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
            <v-btn v-if="actions.if(o)" v-bind="o" stacked rounded="0" size="60"></v-btn>
          </template>
        </div>

        <v-snackbar-queue v-model="snackbar.items">
          <template #actions="{ item, props }">
            <template v-for="oo in item.actions(scope({ item }))">
              <v-btn v-bind="oo"></v-btn>
            </template>
            <v-btn v-bind="props">Ok</v-btn>
          </template>
        </v-snackbar-queue>
        
        <template v-for="o in dialog.items">
          <v-dialog :model-value="true" max-width="600">
            <v-card :title="o.title" :text="o.text">
              <v-card-actions>
                <template v-for="oo in o.actions">
                  <v-btn v-bind="oo"></v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-dialog>
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

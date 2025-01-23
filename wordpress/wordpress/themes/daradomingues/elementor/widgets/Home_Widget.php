<?php

return new class extends \Elementor\Widget_Base
{

  public function get_name()
  {
    return 'daradomingues-home';
  }

  public function get_title()
  {
    return 'daradomingues.com | home';
  }

  public function get_icon()
  {
    return 'eicon-code';
  }

  public function get_categories()
  {
    return ['basic'];
  }

  protected function get_portfolio_items_categories($options = false)
  {
    $categories = [
      [
        'id' => 'styling',
        'name' => 'Styling',
      ],
      [
        'id' => 'styling-assistant',
        'name' => 'Styling Assistant',
      ],
      [
        'id' => 'production',
        'name' => 'Production',
      ],
    ];

    if ($options) {
      foreach ($categories as $i => $cat) {
        unset($categories[$i]);
        $categories[$cat['id']] = $cat['name'];
      }
    }

    return $categories;
  }

  protected function register_controls()
  {
    $this->start_controls_section(
      'section_portfolio_items',
      [
        'label' => 'Portfolio Items',
        'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
      ]
    );

    $this->add_control(
      'portfolio_items',
      [
        'label' => 'Portfolio items',
        'type' => \Elementor\Controls_Manager::REPEATER,
        'fields' => [
          [
            'name' => 'name',
            'label' => 'Título',
            'type' => \Elementor\Controls_Manager::TEXT,
            'default' => '',
            'label_block' => true,
          ],
          [
            'name' => 'description',
            'label' => 'Descrição',
            'type' => \Elementor\Controls_Manager::WYSIWYG,
            'default' => '',
            'show_label' => false,
          ],
          [
            'name' => 'image',
            'label' => 'Imagem',
            'type' => \Elementor\Controls_Manager::MEDIA,
            'default' => ['url' => ''],
          ],
          [
            'name' => 'categories',
            'label' => 'Categories',
            'type' => \Elementor\Controls_Manager::SELECT2,
            'multiple' => true,
            'options' => $this->get_portfolio_items_categories(true),
            'default' => [],
          ],
        ],
        'default' => [],
        'title_field' => '{{{ name }}}',
      ]
    );

    $this->end_controls_section();
  }

  protected function get_attach($id)
  {
    $url = wp_get_attachment_image_url($id, 'full');
    $meta = wp_get_attachment_metadata($id);
    return (object) [
      'id' => $id,
      'url' => $url,
      'size' => $meta['filesize'],
      'width' => $meta['width'],
      'height' => $meta['height'],
      // 'meta' => $meta,
    ];
  }

  protected function get_posts_schema($type)
  {
    $terms = get_terms(['taxonomy' => 'work_tag']);
    $terms = array_values($terms);

    $posts = get_posts(['post_type' => $type, 'posts_per_page' => -1]);
    $posts = array_map(function ($post) {
      $post->meta = new stdClass;

      $post->meta->work_tag = get_the_terms($post->ID, 'work_tag');
      $post->meta->work_tag = is_array($post->meta->work_tag) ? $post->meta->work_tag : [];
      $post->meta->work_tag = array_values($post->meta->work_tag);

      $post->meta->cover = get_post_meta($post->ID, 'cover');
      $post->meta->cover = isset($post->meta->cover[0]) ? $post->meta->cover[0] : null;
      $post->meta->cover = $this->get_attach($post->meta->cover);

      $post->meta->images = get_post_meta($post->ID, 'images');
      $post->meta->images = array_map(fn($id) => $this->get_attach($id), $post->meta->images);

      return $post;
    }, $posts);

    return [
      'terms' => $terms,
      'posts' => $posts,
    ];
  }

  protected function render()
  {
    $settings = $this->get_settings_for_display();
    $work = $this->get_posts_schema('work');
?>
    <div id="app" style="opacity:0;">

      <!-- Nav -->
      <div
        class="fixed top-0 left-0 w-full"
        style="background: #ffffffee; z-index:99;">
        <div class="mx-auto container py-2 flex items-center gap-2">
          <a
            href="/"
            class="text-gray-500 text-slate-600 px-3 text-sm font-roboto-800 hover:text-slate-900">
            Dara Domingues
          </a>

          <div class="flex-1 flex justify-center">
            <nav class="hidden lg:flex space-x-4" aria-label="Tabs">
              <template v-for="o in nav.items">
                <a
                  href="javascript:;"
                  class="text-gray-500 text-slate-600 px-3 py-2 hover:text-slate-900"
                  v-bind="o.bind">
                  <span
                    class="decoration-black underline-offset-8 font-roboto-400 text-sm"
                    :class="{'underline text-slate-900': o.active}">
                    {{ o.name }}
                  </span>
                </a>
              </template>
            </nav>
          </div>

          <a
            href="mailto:daradomingues.studio@gmail.com"
            class="text-gray-500 text-slate-600 px-3 text-sm font-roboto-400 hover:text-slate-900">
            Contact
          </a>

          <a href="javascript:;" class="lg:hidden" @click="nav.dialog.set()">
            <img src="https://api.iconify.design/fluent:navigation-16-filled.svg?height=35" alt="">
          </a>
        </div>
      </div>

      <!-- Drawer -->
      <dialog
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center p-3"
        style="background: #00000088; z-index:99;"
        :style="{
          'opacity': nav.dialog.visible ? 1 : 0,
          'z-index': nav.dialog.visible ? 99 : -1,
        }"
        open
        @click.self="nav.dialog.set(null)">
        <div
          class="fixed flex flex-col bg-white h-full shadow overflow-hidden"
          style="width: 300px;"
          :style="{
            'top': 0,
            'right': nav.dialog.visible ? 0 : '-100%',
          }">
          <div class="grow overflow-auto">
            <template v-for="o in nav.items">
              <a
                href="javascript:;"
                class="flex items-center px-2 py-3 text-slate-600 hover:bg-gray-100 font-roboto-400"
                :class="{'underline text-slate-900': o.active}"
                v-bind="o.bind"
                @click="() => {
                  o.bind.onClick();
                  nav.dialog.set(null);
                }">
                <span>{{ o.name }}</span>
              </a>
            </template>
          </div>
          <div class="p-3 flex justify-end">
            <a
              href="javascript:;"
              class="bg-gray-200 text-slate-600 px-3 py-2 rounded"
              @click="nav.dialog.set(null)">
              Close
            </a>
          </div>
        </div>
      </dialog>

      <!-- Preload -->
      <template v-for="o in work.raw.posts">
        <link rel="preload" as="image" :href="o.meta.cover.url" />
      </template>

      <!-- Results -->
      <div class="mx-auto container mt-16">
        <div class="columns-1 md:columns-3">
          <template v-for="o in work.posts">
            <div
              class="group rounded shadow mb-4 relative"
              style="break-inside: avoid-column"
              @click="dialog.setData(o)">
              <div class="bg-gray-200" style="min-height:300px;">
                <img v-if="o.meta.cover" :src="o.meta.cover.url" class="w-full rounded-t-lg" alt="" />
              </div>
              <div class="p-3 opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full bg-gray-100">
                <div class="text-sm font-medium">{{ o.post_title }}</div>
                <div
                  v-if="o.post_excerpt"
                  v-html="o.post_excerpt"
                  class="text-sm line-clamp-2"
                  style="height:40px;"></div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Dialog -->
      <dialog
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center p-3"
        style="background: #00000088"
        :style="{
          'z-index': dialog.visible ? 99 : -1,
          'opacity': dialog.visible ? 1 : 0,
        }"
        open
        @click.self="dialog.setData(null)">
        <div
          class="flex flex-col bg-white shadow rounded overflow-hidden"
          style="width: 700px; max-width: 90vw; max-height:90vh;">
          <div v-if="dialog.data" class="p-3 bg-gray-200 text-slate-600 font-medium">
            {{ dialog.data.post_title }}
          </div>
          <div class="grow overflow-auto">
            <div
              v-if="dialog.data"
              class="relative w-full flex gap-6 snap-x snap-mandatory overflow-x-auto">
              <template v-for="o in dialog.data.meta.images">
                <div class="snap-center shrink-0">
                  <img :src="o.url" style="width:auto; height:70vh;" />
                </div>
              </template>
            </div>
          </div>
          <div class="p-3 flex justify-end">
            <a
              href="javascript:;"
              class="bg-gray-200 text-slate-600 px-3 py-2 rounded"
              @click="dialog.setData(null)">
              Close
            </a>
          </div>
        </div>
      </dialog>

      <div
        class="mx-auto container text-md text-gray-400 text-center py-5 mt-5">
        &copy; 2025 daradomingues.com | All rights reserved.
      </div>

      <!-- <pre>work: {{ work }}</pre> -->
    </div>
    <script type="module">
      const {
        faker
      } = await import("https://esm.sh/@faker-js/faker");
      const {
        createApp,
        reactive,
        computed,
        onMounted,
      } = Vue;

      createApp({
        setup() {
          const work = reactive({
            filter: {
              work_tag: null,
            },
            terms: computed(() => {
              return work.raw.terms;
            }),
            posts: computed(() => {
              if (!work.filter.work_tag) {
                return work.raw.posts;
              }

              return work.raw.posts.filter((post) => {
                return post.meta.work_tag.filter((tag) => {
                  return tag.slug == work.filter.work_tag;
                }).length >= 1;
              });
            }),
            raw: <?php echo json_encode($work); ?>,
          });

          const nav = reactive({
            dialog: {
              visible: false,
              set(visible = null) {
                nav.dialog.visible = visible === null ? !nav.dialog.visible : visible;
              },
            },
            items: computed(() => {
              return work.raw.terms.map((term) => {
                const name = term.name;
                const active = work.filter.work_tag == term.slug;
                const bind = {
                  onClick: (ev) => {
                    work.filter.work_tag = active ? null : term.slug;
                  },
                };
                return {
                  name,
                  active,
                  bind
                };
              })
            }),
          });

          const dialog = reactive({
            visible: false,
            data: null,
            setData(data = {}) {
              dialog.visible = !!data;
              dialog.data = data;
            },
          });

          onMounted(() => {
            document.querySelector('#app').style.opacity = 1;
          });

          return {
            work,
            nav,
            dialog
          };
        },
      }).mount("#app");
    </script>
<?php
  }

  /*protected function content_template()
  {
  ?>
    <div class="meu-widget">
      <h2>{{{ settings.titulo }}}</h2>
      <p>{{{ settings.conteudo }}}</p>
    </div>
<?php
  }*/
};

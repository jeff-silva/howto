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
      <div
        class="px-4 py-6 sm:px-6 lg:px-8 sticky top-0"
        style="background: #ffffffee">
        <div class="flex items-center gap-6 justify-between mx-auto max-w-7xl">
          <a
            href="javascript:;"
            class="text-gray-500 text-gray-700 px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-100">
            Dara Domingues
          </a>

          <nav class="flex space-x-4" aria-label="Tabs">
            <a
              href="javascript:;"
              class="text-gray-500 text-gray-700 px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-100"
              :class="{'bg-gray-100': work.filter.work_tag == null}"
              @click="work.filter.work_tag = null">
              All
            </a>

            <template v-for="o in work.terms">
              <a
                href="javascript:;"
                class="text-gray-500 text-gray-700 px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-100"
                :class="{'bg-gray-100': work.filter.work_tag == o.slug}"
                @click="work.filter.work_tag = o.slug">
                {{ o.name }}
              </a>
            </template>
          </nav>

          <a
            href="javascript:;"
            class="text-gray-500 text-gray-700 px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-100">
            Contact
          </a>
        </div>
      </div>

      <!-- Preload -->
      <template v-for="o in work.raw.posts">
        <link rel="preload" as="image" :href="o.meta.cover.url" />
      </template>

      <!-- Results -->
      <div class="mx-auto max-w-7xl">
        <div class="columns-1 md:columns-3">
          <template v-for="o in work.posts">
            <div
              class="bg-gray-100 rounded shadow mb-4"
              style="break-inside: avoid-column"
              @click="dialog.setData(o)">
              <div class="bg-gray-200" style="min-height:300px;">
                <img v-if="o.meta.cover" :src="o.meta.cover.url" class="w-full rounded-t-lg" alt="" />
              </div>
              <div class="p-3">
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

      <dialog
        v-if="!!dialog.data"
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center p-3"
        style="background: #00000088"
        open
        @click.self="dialog.setData(null)">
        <div
          class="flex flex-col bg-white shadow rounded overflow-hidden"
          style="width: 700px; max-width: 90vw; max-height:90vh;">
          <div class="p-3 bg-gray-200 text-gray-700 font-medium">
            {{ dialog.data.post_title }}
          </div>
          <div class="grow overflow-auto">
            <div
              class="relative w-full flex gap-6 snap-x snap-mandatory overflow-x-auto"
              @drag="(ev) => {
                const scrollTo = ev.currentTarget.scrollLeft - (ev.movementX * 30);
                ev.currentTarget.scrollTo(scrollTo, 0);
                console.clear();
                console.log(ev.movementX);
              }">
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
              class="bg-gray-200 text-gray-700 px-3 py-2 rounded"
              @click="dialog.setData(null)">
              Close
            </a>
          </div>
        </div>
      </dialog>

      <div
        class="mx-auto max-w-7xl text-md text-gray-400 text-center py-5 mt-5">
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

          const dialog = reactive({
            data: null,
            setData(data = {}) {
              dialog.data = data;
            },
          });

          onMounted(() => {
            document.querySelector('#app').style.opacity = 1;
          });

          return {
            work,
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

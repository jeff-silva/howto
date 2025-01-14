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

  protected function render()
  {
    $settings = $this->get_settings_for_display();
?>
    <div id="app">
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
              :class="{'bg-gray-100': portfolio.params.category == null}"
              @click="portfolio.params.category = null">
              All
            </a>

            <template v-for="o in portfolio.options.categories">
              <a
                href="javascript:;"
                class="text-gray-500 text-gray-700 px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-100"
                :class="{'bg-gray-100': portfolio.params.category == o.slug}"
                @click="portfolio.params.category = o.slug">
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
      <template v-for="o in portfolio.results.data">
        <link rel="preload" as="image" :href="o.image" />
      </template>

      <!-- Results -->
      <div class="mx-auto max-w-7xl">
        <div class="columns-1 md:columns-3">
          <template v-for="o in portfolio.results.filtered">
            <div
              class="bg-gray-100 rounded shadow mb-4"
              style="break-inside: avoid-column"
              @click="dialog.setData(o)">
              <img v-if="o.image.url" :src="o.image.url" class="w-full rounded-t-lg" alt="" />
              <div class="p-3" v-if="o.name || o.description">
                <div class="text-sm font-medium">{{ o.name }}</div>
                <div class="text-sm line-clamp-2" style="height:40px;" v-html="o.description"></div>
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
          class="bg-white shadow rounded overflow-hidden"
          style="width: 700px">
          <div class="p-3 bg-gray-200 text-gray-700 font-medium">
            {{ dialog.data.name }}
          </div>
          <img
            v-if="dialog.data.image.url"
            :src="dialog.data.image.url"
            alt=""
            style="width: 100%; max-height: 60vh; object-fit: contain"
            class="bg-gray-300" />
          <div class="p-3" v-html="dialog.data.description"></div>
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

      <!-- <pre>portfolio: {{ portfolio }}</pre> -->
    </div>
    <script type="module">
      const {
        faker
      } = await import("https://esm.sh/@faker-js/faker");
      const {
        createApp,
        reactive,
        computed
      } = Vue;

      createApp({
        setup() {
          const portfolio = reactive({
            params: {
              category: null,
            },
            options: {
              columns: 3,
              categories: <?php echo json_encode($this->get_portfolio_items_categories()); ?>,
            },
            results: {
              data: (() => {
                const arrayShuffle = ([...arr]) => {
                  let m = arr.length;
                  while (m) {
                    const i = Math.floor(Math.random() * m--);
                    [arr[m], arr[i]] = [arr[i], arr[m]];
                  }
                  return arr;
                };

                let items = <?php echo json_encode($settings['portfolio_items']); ?>;

                items = items.map((item) => {
                  item.categories = arrayShuffle([
                    "styling",
                    "styling-assistant",
                    "production",
                  ]);
                  item.categories.shift();

                  return item;
                });

                // for (let i = 0; i <= 33; i++) {
                //   const id = faker.commerce.isbn();
                //   const name = faker.commerce.productName();
                //   const description = faker.commerce.productDescription();
                //   const width = 300;
                //   const height = 100 + Math.round(Math.random() * 200);
                //   const image = faker.image.url({
                //     width,
                //     height
                //   });

                //   const categories = arrayShuffle([
                //     "styling",
                //     "styling-assistant",
                //     "production",
                //   ]);
                //   categories.shift();

                //   items.push({
                //     id,
                //     name,
                //     image,
                //     description,
                //     width,
                //     height,
                //     categories,
                //   });
                // }

                return items;
              })(),

              filtered: computed(() => {
                let items = JSON.parse(JSON.stringify(portfolio.results.data));
                if (portfolio.params.category) {
                  items = items.filter((item) => {
                    return item.categories.includes(portfolio.params.category);
                  });
                }
                return items;
              }),
            },
          });

          const dialog = reactive({
            data: null,
            setData(data = {}) {
              dialog.data = data;
            },
          });

          return {
            portfolio,
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

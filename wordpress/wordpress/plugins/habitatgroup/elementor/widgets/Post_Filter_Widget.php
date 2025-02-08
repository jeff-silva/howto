<?php

return new class extends \Elementor\Widget_Base
{

  public function get_name()
  {
    return 'habitatgroup-post-filter';
  }

  public function get_title()
  {
    return 'Habitat Group | Post Filter';
  }

  public function get_icon()
  {
    return 'eicon-code';
  }

  public function get_categories()
  {
    return ['basic'];
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

    $this->add_control('post_type', [
      'label' => 'Post type',
      'type' => \Elementor\Controls_Manager::SELECT2,
      'multiple' => false,
      'default' => 'post',
      'options' => get_post_types(),
    ]);

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
            'options' => [],
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
    $element_id = uniqid('habitatgroup-post-filter-');
    $posts = get_posts([
      'post_type' => $settings['post_type'],
      'numberposts' => -1,
    ]);
?>
    <div id="<?php echo $element_id; ?>">
      <pre>posts: {{ posts }}</pre>
    </div>

    <script type="module">
      const {
        createApp,
        reactive,
        computed,
        onMounted,
      } = Vue;

      createApp({
        setup() {
          const settings = reactive(<?php echo json_encode($settings); ?>);
          const posts = reactive(<?php echo json_encode($posts); ?>);
          return {
            settings,
            posts,
          };
        },
      }).mount("#<?php echo $element_id; ?>");
    </script>
<?php
  }
};
